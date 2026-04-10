import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FiPlus, FiMessageSquare } from "react-icons/fi";
import {
  getConversations,
  createConversation,
  deleteConversation,
} from "../services/api";

export default function Sidebar({
  conversationId,
  setConversationId,
  refreshChats,
  setRefreshChats,
  sidebarOpen,
  onClose,
}) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadChats = async () => {
    try {
      const data = await getConversations();
      setChats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, [refreshChats]);

  const newChat = async () => {
    const chat = await createConversation();
    setConversationId(chat._id, chat.title || "New Chat");
    setRefreshChats((prev) => !prev);
  };

  const removeChat = async (e, id) => {
    e.stopPropagation();
    await deleteConversation(id);
    if (conversationId === id) setConversationId(null, "");
    setRefreshChats((prev) => !prev);
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="brand">
          <div className="brand-dot" />
          <span className="brand-name">Conversations</span>
        </div>
        <button className="new-chat-btn" onClick={newChat} title="New chat">
          <FiPlus size={16} />
        </button>
      </div>

      {/* List */}
      <div className="chats-list">
        {loading ? (
          <div className="empty-sidebar">
            <div className="typing-indicator" style={{ margin: "0 auto" }}>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        ) : chats.length === 0 ? (
          <div className="empty-sidebar">
            <FiMessageSquare size={28} />
            <span>No conversations yet.</span>
            <span style={{ fontSize: 11, marginTop: 2 }}>
              Click + to start one
            </span>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`chat-item ${conversationId === chat._id ? "active" : ""}`}
              onClick={() => setConversationId(chat._id, chat.title || "Chat")}
            >
              <div className="chat-icon">
                <FiMessageSquare size={13} />
              </div>
              <span className="chat-title">{chat.title || "New Chat"}</span>
              <button
                className="delete-btn"
                onClick={(e) => removeChat(e, chat._id)}
                title="Delete"
              >
                <FaTrash size={11} />
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
