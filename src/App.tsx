import { BroadcastProvider } from 'react-broadcast-sync'
import { useCollaborativeSession } from './hooks/useCollaborativeSession'

function App() {
  const {
    users,
    messages,
    counter,
    sendMessage,
    updateCounter,
    addUser,
    removeUser
  } = useCollaborativeSession()

  return (
    <BroadcastProvider channelName="dashboard-channel">
      <div className="app">
        <h1>Dashboard</h1>
        <div>Users: {users.length}</div>
        <div>Messages: {messages.length}</div>
        <div>Counter: {counter.value}</div>
      </div>
    </BroadcastProvider>
  )
}

export default App
