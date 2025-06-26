"use client";

import { useEffect, useState } from "react";
import { supabase } from '../lib/supabase';

export default function LiveChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Fetch old messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });
      setMessages(data || []);
    };

    fetchMessages();

    // Realtime subscription
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    await supabase.from("messages").insert({
      content: newMessage,
      sender_id: user?.id,
    });

    setNewMessage("");
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '16px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box' // Ensures padding is included in height calculation
    }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '16px',
        color: '#333',
        textAlign: 'center'
      }}>💬 whatapp Chat</h2>
      
      <div style={{
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '16px',
        flex: '1 1 auto',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch', // Smooth scrolling for iOS
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        minHeight: 0 // Fix for Firefox flexbox issue
      }}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            style={{
              maxWidth: '80%',
              padding: '8px 12px',
              borderRadius: msg.sender_id === user?.id ? '8px 8px 0 8px' : '8px 8px 8px 0',
              alignSelf: msg.sender_id === user?.id ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender_id === user?.id ? '#dcf8c6' : '#ffffff',
              border: msg.sender_id === user?.id ? 'none' : '1px solid #e2e8f0',
              position: 'relative',
              wordBreak: 'break-word' // Ensure long words don't overflow
            }}
          >
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#333'
            }}>{msg.content}</p>
            <p style={{
              margin: 0,
              fontSize: '10px',
              color: '#666',
              textAlign: 'right',
              marginTop: '4px'
            }}>
              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
      </div>
      
      <div style={{
        display: 'flex',
        marginTop: '16px',
        width: '100%'
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{
            flex: 1,
            border: '1px solid #e2e8f0',
            padding: '8px 12px',
            borderRadius: '20px 0 0 20px',
            outline: 'none',
            fontSize: '14px',
            WebkitAppearance: 'none' // Fix for Safari
          }}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          style={{
            backgroundColor: '#128c7e',
            color: 'white',
            border: 'none',
            padding: '8px 16px',                                  
            borderRadius: '0 20px 20px 0',
            cursor: 'pointer',
            fontSize: '14px',
            WebkitAppearance: 'none' // Fix for Safari
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
