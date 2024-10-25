import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { AIMessage, BaseMessage } from "@langchain/core/messages";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { createClient } from "@supabase/supabase-js";
import { PromptTemplate } from "@langchain/core/prompts";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import { RunnableSequence } from "@langchain/core/runnables";
import {
  BytesOutputParser,
  StringOutputParser,
} from "@langchain/core/output_parsers";

export const runtime = "edge";

/**
 * Combines an array of document objects into a single string by serializing each document’s page content.
 *
 * @param docs - An array of documents to combine.
 * @returns A single string containing all document page contents, separated by double line breaks.
 */
const combineDocumentsFn = (docs: Document[]) => {
  const serializedDocs = docs.map((doc) => doc.pageContent);
  return serializedDocs.join("\n\n");
};

const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`;

/**
 * Template for rephrasing follow-up questions to standalone questions.
 */
const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE
);

const ANSWER_TEMPLATE = `You are a chatbot designed to assist users with detailed information on Rebackk. Your responses should be accurate, professional, and provide clear answers about Rebackk’s cybersecurity solutions. Users may ask about specific products, security features, technical specifications, pricing plans, target customer personas, or the mission of Rebackk. Refer directly to the whitepaper information, and provide concise summaries or details as required. Aim to be informative and approachable, guiding users through Rebackk’s features like Sentinel, Aegis, Fortify, and others, and their applications in different business contexts
Answers Should Be Cleanly Formatted In Markdown Format
Answer the question based only on the following context and chat history:
<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}
`;

/**
 * Template for generating responses based on the Rebackk whitepaper and chat history.
 */
const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

/**
 * Formats a conversation history into a string with 'Human:' and 'Assistant:' labels for each turn.
 *
 * @param chatHistory - An array of chat messages to format.
 * @returns A formatted string of the conversation history.
 */
const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
  const formattedDialogueTurns = chatHistory.map((message) => {
    if (message.role === "user") {
      return `Human: ${message.content}`;
    } else if (message.role === "assistant") {
      return `Assistant: ${message.content}`;
    } else {
      return `${message.role}: ${message.content}`;
    }
  });
  return formattedDialogueTurns.join("\n");
};

/**
 * Converts a LangChain `BaseMessage` to a Vercel chat message format.
 *
 * @param message - A message object from LangChain.
 * @returns A formatted object with content and role for Vercel messaging.
 */
const convertLangChainMessageToVercelMessage = (message: BaseMessage) => {
  if (message._getType() === "human") {
    return { content: message.content, role: "user" };
  } else if (message._getType() === "ai") {
    return {
      content: message.content,
      role: "assistant",
      tool_calls: (message as AIMessage).tool_calls,
    };
  } else {
    return { content: message.content, role: message._getType() };
  }
};

/**
 * Handles POST requests by processing incoming chat messages to generate responses
 * using a conversational retrieval QA chain powered by LangChain and Supabase.
 *
 * @param req - The incoming Next.js request object.
 * @returns A response containing the generated chat stream and related metadata.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const previousMessages = messages.slice(0, -1);
    const currentMessageContent = messages[messages.length - 1].content;

    // Initialize Chat model with Ollama configurations
    const model = new ChatOllama({
      model: env.OLLAMA_MODEL_NAME,
      baseUrl: env.OLLAMA_BASE_URL,
    });

    // Set up Supabase client and vector store for document retrieval
    const client = createClient(env.SUPABASE_URL, env.SUPABASE_PRIVATE_KEY);

    const vectorstore = new SupabaseVectorStore(
      new OllamaEmbeddings({
        baseUrl: env.OLLAMA_BASE_URL,
        model: env.OLLAMA_EMBEDDING_MODEL_NAME,
      }),
      {
        client,
        tableName: "documents",
        queryName: "match_documents",
      }
    );

    // Define the sequence to convert follow-up questions to standalone questions
    const standaloneQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      model,
      new StringOutputParser(),
    ]);

    let resolveWithDocuments: (value: Document[]) => void;
    const documentPromise = new Promise<Document[]>((resolve) => {
      resolveWithDocuments = resolve;
    });

    // Configure retriever with a callback to resolve retrieved documents
    const retriever = vectorstore.asRetriever({
      callbacks: [
        {
          handleRetrieverEnd(documents) {
            resolveWithDocuments(documents);
          },
        },
      ],
    });

    const retrievalChain = retriever.pipe(combineDocumentsFn);

    // Define the answer generation sequence
    const answerChain = RunnableSequence.from([
      {
        context: RunnableSequence.from([
          (input) => input.question,
          retrievalChain,
        ]),
        chat_history: (input) => input.chat_history,
        question: (input) => input.question,
      },
      answerPrompt,
      model,
    ]);

    // Set up conversational QA chain for end-to-end processing
    const conversationalRetrievalQAChain = RunnableSequence.from([
      {
        question: standaloneQuestionChain,
        chat_history: (input) => input.chat_history,
      },
      answerChain,
      new BytesOutputParser(),
    ]);

    // Generate response stream
    const stream = await conversationalRetrievalQAChain.stream({
      question: currentMessageContent,
      chat_history: formatVercelMessages(previousMessages),
    });

    // Retrieve and serialize documents for inclusion in response headers
    const documents = await documentPromise;
    const serializedSources = Buffer.from(
      JSON.stringify(
        documents.map((doc) => {
          return {
            pageContent: doc.pageContent.slice(0, 50) + "...",
            metadata: doc.metadata,
          };
        })
      )
    ).toString("base64");

    // Send streaming response with serialized document sources in headers
    return new StreamingTextResponse(stream, {
      headers: {
        "x-message-index": (previousMessages.length + 1).toString(),
        "x-sources": serializedSources,
      },
    });
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
