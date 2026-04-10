import { useRef, useState } from "react";

export default function ChatInput({ sendMessage, isLoading }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage(trimmed);
    setInput("");
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    // Auto-resize
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    }
  };

  const canSend = input.trim().length > 0 && !isLoading;

  return (
    <div className="input-area">
      <div className="input-inner">
        <textarea
          ref={textareaRef}
          className="input-textarea"
          rows={1}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKey}
          placeholder="Ask anything…"
          disabled={isLoading}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!canSend}
          title="Send (Enter)"
        >
          {isLoading ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.75s" repeatCount="indefinite" />
              </path>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </div>
      <p className="input-hint">Enter to send · Shift+Enter for new line</p>
    </div>
  );
}
