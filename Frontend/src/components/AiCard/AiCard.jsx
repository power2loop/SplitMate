import React, { useState, useRef, useEffect } from "react";
import "./AiCard.css";
import { api } from "../../services/api.js";

function AiCard() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef(null);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = { role: "user", content: message };
    setConversation((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      // Send to backend
      const data = await api("/aibot", {
        method: "POST",
        body: { message },
      });

      const aiReply = { role: "ai", content: data.reply || "No response." };
      setConversation((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error("AI Error:", err);
      setConversation((prev) => [
        ...prev,
        { role: "ai", content: "⚠️ Failed to reach AI service." },
      ]);
    } finally {
      setLoading(false);
    }

  };

  // Auto scroll
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div>
          <h2>AI Assistant</h2>
          <p>Ask me anything about your data</p>
        </div>
      </div>

      <div className="chat-content" ref={contentRef}>
        {conversation.length === 0 ? (
          <div className="no-msg">No conversation yet</div>
        ) : (
          conversation.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.role === "ai" ? "ai" : "user"}`}
            >
              <strong>{msg.role === "ai" ? "AI " : "You "}</strong>
              {msg.content}
            </div>
          ))
        )}
        {loading && <div className="chat-message ai">AI is typing...</div>}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default AiCard;
