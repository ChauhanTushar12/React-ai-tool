import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function ensureParagraphs(str) {
  if (!str) return str;
  if (/\n\s*\n/.test(str)) return str;
  if (str.includes("```")) return str;
  return str
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .join("\n\n");
}

const Answer = ({ ans, type }) => {
  const formatted = ensureParagraphs(ans);

  if (type === "q") {
    return (
      <div className="m-2 flex justify-end">
        <p className="text-right text-lg italic p-2 text-zinc-200 border border-zinc-800 bg-zinc-600 rounded-br-3xl rounded-tl-3xl rounded-bl-3xl w-fit">
          {ans}
        </p>
      </div>
    );
  }

  return (
    <div className="text-left text-gray-300 max-w-none">
      <ReactMarkdown
        components={{
          p: ({ node, children, ...props }) => (
            <p className="mb-4 leading-7" {...props}>
              {children}
            </p>
          ),
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            if (match) {
              return <CodeBlock code={codeString} language={match[1]} />;
            }

            return (
              <code {...props} className="bg-gray-700 px-1 rounded">
                {children}
              </code>
            );
          },
        }}
      >
        {formatted}
      </ReactMarkdown>
    </div>
  );
};

export default Answer;

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-2 py-1 rounded hidden group-hover:block"
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      <SyntaxHighlighter style={oneDark} language={language} PreTag="div">
        {code}
      </SyntaxHighlighter>
    </div>
  );
};