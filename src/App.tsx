import { BroadcastProvider } from 'react-broadcast-sync';
import { useCollaborativeSession } from './hooks/useCollaborativeSession';
import { UserList } from './components/UserList';
import { Chat } from './components/Chat';

function App() {
  return (
    <BroadcastProvider channelName='dashboard-channel'>
      <AppContent />
    </BroadcastProvider>
  );
}

function AppContent() {
  const {
    users,
    currentUser,
    messages,
    counter,
    chatMessages,
    sendMessageToChat,
    updateCounter,
  } = useCollaborativeSession();

  return (
    <div className='app' style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Collaborative Dashboard</h1>
      
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <h2>Your Info</h2>
          <p><strong>Name:</strong> {currentUser.name}</p>
          <p><strong>ID:</strong> {currentUser.id}</p>
        </div>
        
        <div>
          <h2>Counter</h2>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Value:</strong> {counter.value}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <button 
              onClick={() => updateCounter(counter.value + 1)}
              style={{
                padding: '0.5rem 1rem',
                marginRight: '0.5rem',
                border: 'none',
                borderRadius: '4px',
                background: '#007bff',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Increment
            </button>
            <button 
              onClick={() => updateCounter(counter.value - 1)}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                background: '#dc3545',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Decrement
            </button>
          </div>
          {counter.lastChangedBy && (
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              Last changed by: {counter.lastChangedBy} at {new Date(counter.lastChangeAt).toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr', marginTop: '2rem' }}>
        <UserList users={users} />
        
        <div>
          <h2>Chat</h2>
          <Chat messages={chatMessages} sendMessage={sendMessageToChat} />
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Debug Info</h2>
        <p>Messages: {messages.length}</p>
        <p>Chat Messages: {chatMessages.length}</p>
        <p>Total Users: {users.length}</p>
      </div>
    </div>
  );
}

export default App;
