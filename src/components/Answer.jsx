import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Answer = ({ ans, type }) => {
  if (type === "q") {
    return (
      <div className="m-2 flex justify-end">
        <p className="text-right text-lg italic p-2 text-zinc-200 border border-zinc-800 bg-zinc-800 rounded-br-3xl rounded-tl-3xl rounded-bl-3xl w-fit">
          {ans}
        </p>
      </div>
    );
  }

  return (
    <div className="text-left text-gray-300 mt-2 prose prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighter
                {...props}
                style={oneDark}
                language={match[1]}
                PreTag="div"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code {...props} className="bg-gray-700 px-1 rounded">
                {children}
              </code>
            );
          },
        }}
      >
        {ans}
      </ReactMarkdown>
    </div>
  );
};

export default Answer;
