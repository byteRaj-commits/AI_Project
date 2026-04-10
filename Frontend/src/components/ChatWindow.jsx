import { useEffect, useRef, useState } from "react";
import { sendMessageToAI, getMessages, createConversation } from "../services/api";
import ChatInput from "./ChatInput";
import Message from "./Message";
import { FiMenu } from "react-icons/fi";

const WELCOME_CHIPS = [
  "Explain quantum computing simply",
  "Write a Python web scraper",
  "Help me debug my code",
  "Summarise a topic for me",
];

export default function ChatWindow({
  conversationId,
  activeTitle,
  setRefreshChats,
  toggleSidebar,
  sidebarOpen,
  onNewConversation,
}) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const bottomRef = useRef(null);
  const activeConvId = useRef(conversationId);

  // Keep ref in sync
  useEffect(() => {
    activeConvId.current = conversationId;
  }, [conversationId]);

  // Load messages when conversation changes
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    const load = async () => {
      setLoadingMsgs(true);
      try {
        const data = await getMessages(conversationId);
        if (activeConvId.current === conversationId) setMessages(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingMsgs(false);
      }
    };
    load();
  }, [conversationId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    // If no conversation yet, create one first
    let convId = conversationId;
    if (!convId) {
      try {
        const chat = await createConversation();
        convId = chat._id;
        onNewConversation(chat._id, chat.title || "New Chat");
        activeConvId.current = chat._id;
      } catch (e) {
        console.error("Failed to create conversation", e);
        return;
      }
    }

    const userMsg = { role: "user", content: text, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendMessageToAI(convId, text);
      const reply = response?.reply ?? response;
      const aiMsg = { role: "assistant", content: reply, ts: Date.now() };
      if (activeConvId.current === convId) {
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (e) {
      const errMsg = {
        role: "assistant",
        content: "Something went wrong. Please try again.",
        ts: Date.now(),
        error: true,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
      setRefreshChats((p) => !p);
    }
  };

  const handleChip = (text) => sendMessage(text);

  const isEmpty = messages.length === 0 && !loadingMsgs;

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <button className="menu-btn" onClick={toggleSidebar} title="Toggle sidebar">
          <FiMenu size={18} />
        </button>
        <span className="header-title">
          {activeTitle || (isEmpty ? "New conversation" : "Chat")}
        </span>
        <div className="header-badge">
          <span className="header-badge-dot" />
          Online
        </div>
      </div>

      {/* Welcome or Messages */}
      {isEmpty ? (
        <div className="welcome-screen">
          <div className="welcome-icon">✦</div>
          <h1 className="welcome-title">How can I help you?</h1>
          <p className="welcome-sub">
            Ask me anything — I can write, explain, debug, summarise, and more.
          </p>
          <div className="welcome-chips">
            {WELCOME_CHIPS.map((chip) => (
              <button key={chip} className="chip" onClick={() => handleChip(chip)}>
                {chip}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="messages">
          <div className="message-wrapper">
            {loadingMsgs ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                <div className="typing-indicator">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <Message key={i} role={m.role} content={m.content} ts={m.ts} />
              ))
            )}

            {/* AI typing indicator */}
            {isLoading && (
              <div className="message-row assistant">
                <div className="typing-indicator">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>
      )}

      {/* Input */}
      <ChatInput sendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}
