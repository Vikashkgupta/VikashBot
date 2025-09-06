import React, { useState, useEffect, useRef } from "react";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      // Format messages for Gemini API
      const formattedMessages = messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      formattedMessages.push({
        role: "user",
        parts: [{ text: input }],
      });

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBLELJaysB_FgsBKtljubqAjg9rmx2w2QU",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: formattedMessages }),
        }
      );

      const data = await response.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "❌ No response from Gemini.";

      // Optional: Add formatting for emojis, bullets, headings
      const formattedReply = reply
        .replace(/^## (.*)$/gm, "<h3>🌾 $1</h3>") // headings
        .replace(/^\* (.*)$/gm, "• $1") // bullets
        .replace(/\n/g, "<br/>"); // new lines

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: formattedReply },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠ Error occurred!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "20px auto",
        display: "flex",
        flexDirection: "column",
        height: "90vh",
        borderRadius: "15px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#0078ff",
          color: "white",
          padding: "15px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        🤖 Vikash ChatBot
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          background: "#f5f5f5",
          padding: "15px",
          display: "flex",
          flexDirection: "column",
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/cubes.png')",
          gap: "10px",
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {messages.map((msg, i) =>
          msg.role === "assistant" ? (
            <div
              key={i}
              style={{
                alignSelf: "flex-start",
                background: "#e0e0e0",
                color: "black",
                padding: "10px 15px",
                borderRadius: "20px",
                maxWidth: "75%",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                fontSize: "15px",
                lineHeight: "1.4",
              }}
              dangerouslySetInnerHTML={{ __html: msg.content }} // HTML render
            />
          ) : (
            <div
              key={i}
              style={{
                alignSelf: "flex-end",
                background: "#0078ff",
                color: "white",
                padding: "10px 15px",
                borderRadius: "20px",
                maxWidth: "75%",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                fontSize: "15px",
                lineHeight: "1.4",
              }}
            >
              {msg.content} {/* User message plain text */}
            </div>
          )
        )}

        {/* Loader bubble */}
        {loading && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "#e0e0e0",
              color: "black",
              padding: "10px 15px",
              borderRadius: "20px",
              maxWidth: "50%",
              fontSize: "15px",
              display: "flex",
              gap: "5px",
            }}
          >
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          background: "#fff",
          borderTop: "1px solid #ddd",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "12px 15px",
            borderRadius: "25px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "15px",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            marginLeft: "10px",
            padding: "12px 20px",
            borderRadius: "50px",
            background: loading ? "#999" : "#0078ff",
            color: "white",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          ➤
        </button>
      </div>

      {/* CSS Loader Animation */}
      <style>{`
        .dot {
          width: 8px;
          height: 8px;
          background: #555;
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.3s infinite;
        }
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
