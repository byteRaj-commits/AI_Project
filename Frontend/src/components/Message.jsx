import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function formatTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, "");

  const copy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className="code-block-wrapper">
      <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={copy}>
        {copied ? "✓ Copied" : "Copy"}
      </button>
      <pre>
        <code className={className}>{code}</code>
      </pre>
    </div>
  );
}

export default function Message({ role, content, ts }) {
  const isUser = role === "user";

  return (
    <div className={`message-row ${role}`}>
      <div className="message-meta">
        <div className={`avatar ${role}`}>
          {isUser ? "U" : "✦"}
        </div>
        <span className="message-label">{isUser ? "You" : "Assistant"}</span>
        {ts && <span className="message-time">{formatTime(ts)}</span>}
      </div>

      <div className={`bubble ${role}`}>
        {isUser ? (
          <span style={{ whiteSpace: "pre-wrap" }}>{content}</span>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                if (inline) {
                  return <code className={className} {...props}>{children}</code>;
                }
                return <CodeBlock className={className}>{children}</CodeBlock>;
              },
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
