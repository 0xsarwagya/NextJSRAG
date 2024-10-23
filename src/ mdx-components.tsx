import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  console.log("components", components);
  return {
    ...components,
    h1: (props) => <h1 style={{ color: "tomato" }} />,
    h2: (props) => <h2 style={{ color: "tomato" }} />,
    h3: (props) => <h3 style={{ color: "tomato" }} />,
    h4: (props) => <h4 style={{ color: "tomato" }} />,
    h5: (props) => <h5 style={{ color: "tomato" }} />,
    h6: (props) => <h6 style={{ color: "tomato" }} />,
  };
}
