import { BroadcastProvider } from 'react-broadcast-sync';
import { useCollaborativeSession } from './hooks/useCollaborativeSession';
import { UserList } from './components/UserList';
import { Chat } from './components/Chat';
import ThemeButton from './components/ThemeButton';

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
    counter,
    chatMessages,
    typingUsers,
    theme,
    sendMessageToChat,
    markTyping,
    deleteMessage,
    setTheme,
    updateCounter,
  } = useCollaborativeSession();

  return (
    <div className={`app ${theme}`}>
      <div className="container">
        <header className="header">
          <h1 className="title">Collaborative Dashboard</h1>
          <ThemeButton theme={theme} onThemeChange={setTheme} />
        </header>

        <section className="grid grid-2">
          <div className="card">
            <h2 className="subtitle">Your Info</h2>
            <p><strong>Name:</strong> {currentUser.name}</p>
            <p><strong>ID:</strong> {currentUser.id}</p>
          </div>

          <div className="card">
            <h2 className="subtitle">Counter</h2>
            <div className="stat"><strong>Value:</strong> {counter.value}</div>
            <div className="actions">
              <button className="btn btn-primary" onClick={() => updateCounter(counter.value + 1)}>Increment</button>
              <button className="btn btn-danger" onClick={() => updateCounter(counter.value - 1)}>Decrement</button>
            </div>
            {counter.lastChangedBy && (
              <p className="muted">
                Last changed by: {counter.lastChangedBy} at {new Date(counter.lastChangeAt).toLocaleTimeString()}
              </p>
            )}
          </div>
        </section>

        <section className="grid grid-2 mt-lg">
          <UserList users={users} />

          <div className="card">
            <h2 className="subtitle">Chat</h2>
            <Chat 
              messages={chatMessages} 
              typingUsers={typingUsers}
              currentUser={currentUser}
              users={users}
              sendMessage={sendMessageToChat}
              markTyping={markTyping}
              deleteMessage={deleteMessage}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
