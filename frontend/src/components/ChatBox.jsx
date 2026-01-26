import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { messageAPI } from '../services/api';

const ChatBox = ({ receiverId, receiverName, onMessageSent }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (receiverId) {
      loadMessages();
    } else {
      setMessages([]); // Clear messages if no receiver is selected
    }
  }, [receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await messageAPI.getMessages(receiverId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !receiverId) return;

    setLoading(true);
    setError('');
    try {
      const response = await messageAPI.sendMessage({
        receiver: receiverId,
        content: newMessage
      });
      // Add the new message to the local state immediately for a snappier UI
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage('');
      if (onMessageSent) {
        onMessageSent(); // Notify parent to refresh conversations
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.response?.data?.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  if (!receiverId) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        color: '#666', 
        fontSize: '1.1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
      }}>
        <p>Select a conversation from the left to start chatting.</p>
        <p>Or find a student on the "Students" page and click "Message" to start a new chat.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ 
        padding: '1.5rem', 
        background: 'linear-gradient(90deg, #e0e7ff 0%, #f0f3ff 100%)', // Lighter gradient
        borderBottom: '1px solid #ddd',
        fontWeight: 'bold',
        color: '#4a67e0',
        fontSize: '1.2rem',
      }}>
        Chat with {receiverName}
      </div>
      
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '1.5rem',
        background: '#fcfcfc',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
        {messages.length === 0 && !loading && (
          <div style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', marginTop: 'auto', marginBottom: 'auto' }}>
            Start a conversation with {receiverName}!
          </div>
        )}
        {messages.map((msg) => {
          const isOwnMessage = String(msg.sender._id) === String(user?.id);
          return (
            <div
              key={msg._id}
              style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                background: isOwnMessage ? 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)' : '#e9ecef',
                color: isOwnMessage ? 'white' : '#333',
                borderRadius: '15px',
                maxWidth: '75%',
                alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
                boxShadow: isOwnMessage ? '0 4px 10px rgba(102, 126, 234, 0.3)' : '0 2px 5px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem', opacity: 0.8 }}>
                {msg.sender.name}
              </div>
              <div>{msg.content}</div>
              <div style={{ fontSize: '0.7rem', textAlign: 'right', marginTop: '0.5rem', opacity: 0.6 }}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          );
        })}
        {loading && messages.length > 0 && (
          <div style={{ textAlign: 'center', color: '#aaa', margin: '1rem 0' }}>Sending...</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} style={{ display: 'flex', padding: '1rem', borderTop: '1px solid #ddd', background: '#f0f0f0' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ 
            flex: 1, 
            padding: '0.75rem', 
            marginRight: '0.75rem', 
            border: '2px solid #e0e0e0',
            borderRadius: '25px',
            fontSize: '1rem',
            boxSizing: 'border-box',
            transition: 'border-color 0.3s, box-shadow 0.3s',
          }}
          onFocus={(e) => { e.target.style.borderColor = '#667eea'; e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.2)'; }}
          onBlur={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.boxShadow = 'none'; }}
        />
        <button 
          type="submit" 
          disabled={loading || !newMessage.trim()} 
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white', 
            border: 'none', 
            borderRadius: '25px', 
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 10px rgba(102, 126, 234, 0.3)',
            opacity: (loading || !newMessage.trim()) ? 0.7 : 1,
          }}
          onMouseOver={(e) => { if (!e.target.disabled) { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 15px rgba(102, 126, 234, 0.4)'; }}}
          onMouseOut={(e) => { if (!e.target.disabled) { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 10px rgba(102, 126, 234, 0.3)'; }}}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
