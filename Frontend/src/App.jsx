import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

function App() {
  const [conversationId, setConversationId] = useState(null);
  const [activeTitle, setActiveTitle] = useState("");
  const [refreshChats, setRefreshChats] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSelectChat = (id, title) => {
    setConversationId(id);
    setActiveTitle(title || "Conversation");
  };

  return (
    <div className="layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          style={{ display: "none" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        conversationId={conversationId}
        setConversationId={handleSelectChat}
        refreshChats={refreshChats}
        setRefreshChats={setRefreshChats}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <ChatWindow
        conversationId={conversationId}
        activeTitle={activeTitle}
        setRefreshChats={setRefreshChats}
        toggleSidebar={() => setSidebarOpen((o) => !o)}
        sidebarOpen={sidebarOpen}
        onNewConversation={handleSelectChat}
      />
    </div>
  );
}

export default App;
