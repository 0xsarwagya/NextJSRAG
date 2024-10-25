#!/usr/bin/env bash
# This line indicates that the script should be run using the Bash shell.
# It uses /usr/bin/env to locate Bash in the user's environment.

# Start the Ollama server in the background
ollama serve &

# Pause the script for 10 seconds to allow the server to initialize
sleep 10

# Pull the 'qwen2.5:1.5b' model from the Ollama repository for the base chat model
ollama pull qwen2.5:1.5b

# Pull the 'mxbai-embed-large' model from the Ollama repository for the embedding model
ollama pull mxbai-embed-large