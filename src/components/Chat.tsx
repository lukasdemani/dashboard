import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, User } from '../hooks/useCollaborativeSession';

interface ChatProps {
  messages: ChatMessage[];
  typingUsers: string[];
  currentUser: User;
  users: User[];
  sendMessage: (text: string) => void;
  markTyping: (isTyping: boolean) => void;
  deleteMessage: (messageId: string) => void;
}

const styles = {
  chatContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '400px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  messagesArea: {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto' as const,
    backgroundColor: '#f9f9f9',
  },
  message: {
    marginBottom: '0.75rem',
    padding: '0.5rem',
    backgroundColor: 'white',
    borderRadius: '4px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.25rem',
  },
  userName: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '0.875rem',
  },
  timestamp: {
    fontSize: '0.75rem',
    color: '#666',
  },
  messageText: {
    color: '#444',
    lineHeight: '1.4',
  },
  inputArea: {
    padding: '1rem',
    backgroundColor: 'white',
    borderTop: '1px solid #ddd',
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
  },
  textarea: {
    flex: 1,
    minHeight: '40px',
    maxHeight: '100px',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
  },
  sendButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  emptyState: {
    textAlign: 'center' as const,
    color: '#666',
    fontStyle: 'italic',
    padding: '2rem',
  },
  deleteButton: {
    fontSize: '0.75rem',
    padding: '0.25rem 0.5rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    marginLeft: '0.5rem',
  },
  typingIndicator: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontStyle: 'italic',
    color: '#666',
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #ddd',
  },
};

export const Chat: React.FC<ChatProps> = ({ 
  messages, 
  typingUsers, 
  currentUser, 
  users, 
  sendMessage, 
  markTyping, 
  deleteMessage 
}) => {
  const [inputText, setInputText] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isCurrentlyTyping, setIsCurrentlyTyping] = useState(false);

  const getUserNameById = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  }, [users]);

  const handleTyping = useCallback(() => {
    if (!isCurrentlyTyping) {
      markTyping(true);
      setIsCurrentlyTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      markTyping(false);
      setIsCurrentlyTyping(false);
    }, 2000); // Stop typing after 2 seconds of inactivity
  }, [markTyping, isCurrentlyTyping]);

  const handleStopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (isCurrentlyTyping) {
      markTyping(false);
      setIsCurrentlyTyping(false);
    }
  }, [markTyping, isCurrentlyTyping]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (text) {
      sendMessage(text);
      setInputText('');
      handleStopTyping();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter' || e.shiftKey) {
      handleTyping();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messagesArea}>
        {messages.length === 0 ? (
          <div style={styles.emptyState}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} style={styles.message}>
              <div style={styles.messageHeader}>
                <span style={styles.userName}>{message.userName}</span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={styles.timestamp}>
                    {formatTimestamp(message.timestamp)}
                  </span>
                  {message.userId === currentUser.id && (
                    <button
                      onClick={() => deleteMessage(message.id)}
                      style={styles.deleteButton}
                      title="Delete message"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
              <div style={styles.messageText}>{message.text}</div>
            </div>
          ))
        )}
      </div>
      
      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div style={styles.typingIndicator}>
          {typingUsers.length === 1 
            ? `${getUserNameById(typingUsers[0])} is typing...`
            : typingUsers.length === 2
            ? `${getUserNameById(typingUsers[0])} and ${getUserNameById(typingUsers[1])} are typing...`
            : `${typingUsers.length} people are typing...`
          }
        </div>
      )}
      
      <div style={styles.inputArea}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            onKeyPress={handleKeyPress}
            onBlur={handleStopTyping}
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            style={styles.textarea}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            style={{
              ...styles.sendButton,
              ...(inputText.trim() ? {} : styles.sendButtonDisabled),
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
