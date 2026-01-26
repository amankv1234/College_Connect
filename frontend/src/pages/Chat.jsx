import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, messageAPI } from '../services/api';
import ChatBox from '../components/ChatBox';

const Chat = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadConversations();
    const userIdFromUrl = searchParams.get('userId');
    const userNameFromUrl = searchParams.get('userName');

    if (userIdFromUrl && userNameFromUrl && (!selectedUser || selectedUser.id !== userIdFromUrl)) {
      setSelectedUser({ id: userIdFromUrl, name: userNameFromUrl });
    }
  }, [user, searchParams]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const response = await messageAPI.getConversations();
      // Ensure unique conversations and sort by last message
      const uniqueConversations = {};
      response.data.forEach(conv => {
        const otherUserId = conv.user._id.toString();
        if (!uniqueConversations[otherUserId] || new Date(conv.lastMessage.createdAt) > new Date(uniqueConversations[otherUserId].lastMessage.createdAt)) {
          uniqueConversations[otherUserId] = conv;
        }
      });
      setConversations(Object.values(uniqueConversations).sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)));
      setError('');
    } catch (error) {
      console.error('Error loading conversations:', error);
      setError('Failed to load conversations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (convUser) => {
    setSelectedUser({ id: convUser._id, name: convUser.name });
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', fontSize: '1.2rem', color: '#667eea' }}>
      Loading chat...
    </div>
  );
  if (error) return (
    <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem', fontSize: '1.1rem' }}>
      {error}
    </div>
  );

  return (
    <div style={{ 
      display: 'flex', 
      height: 'calc(100vh - 100px)', // Adjust height for navbar
      maxWidth: '1200px', 
      margin: '2rem auto', 
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      <div style={{ 
        width: '350px', // Slightly wider conversation list
        borderRight: '1px solid #eee', 
        overflowY: 'auto',
        background: '#f9f9f9',
      }}>
        <h3 style={{ 
          padding: '1.5rem', 
          borderBottom: '1px solid #eee', 
          margin: 0, 
          color: '#333', 
          fontSize: '1.8rem', 
          fontWeight: '700' 
        }}>
          Conversations
        </h3>
        {conversations.length === 0 && !selectedUser ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: '#666', fontSize: '1rem' }}>
            No conversations yet. Find students on the "Students" page to start chatting!
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.user._id}
              onClick={() => handleSelectUser(conv.user)}
              style={{
                padding: '1.2rem 1.5rem',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
                background: String(selectedUser?.id) === String(conv.user._id) ? '#e0e7ff' : 'white',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
              }}
              onMouseOver={(e) => { if (String(selectedUser?.id) !== String(conv.user._id)) e.target.style.background = '#f5f5f5'; }}
              onMouseOut={(e) => { if (String(selectedUser?.id) !== String(conv.user._id)) e.target.style.background = 'white'; }}
            >
              <img 
                src={conv.user.profilePhoto || 'https://via.placeholder.com/50/667eea/ffffff?text=U'} 
                alt="User" 
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', marginRight: '1rem' }}
              />
              <div>
                <div style={{ fontWeight: 'bold', color: '#333', fontSize: '1.1rem' }}>{conv.user.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.2rem' }}>
                  {conv.lastMessage?.content?.substring(0, 30) || 'No messages'}...
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div style={{ flex: 1 }}>
        <ChatBox 
          receiverId={selectedUser?.id} 
          receiverName={selectedUser?.name}
          onMessageSent={loadConversations} // Callback to refresh conversations
        />
      </div>
    </div>
  );
};

export default Chat;
