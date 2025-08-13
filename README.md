# Cross-Tab Collaboration Dashboard

A real-time collaboration dashboard built with React and TypeScript that synchronizes user activity across multiple browser tabs using broadcast channels.

## 🚀 Features

### Core Functionality

- **Real-time User Presence**: See who's online across different browser tabs
- **Synchronized Counter**: Shared counter that updates instantly across all tabs
- **Live Chat System**: Real-time messaging with typing indicators
- **Message Management**: Delete your own messages with cross-tab synchronization
- **Expiring Messages**: Send messages that automatically disappear after a set time
- **Theme Synchronization**: Dark/light mode synced across all tabs

### Advanced Features

- **Cross-tab Communication**: Uses `react-broadcast-sync` with native BroadcastChannel fallback
- **Activity Tracking**: Monitor user actions and timestamps
- **Responsive Design**: Modern, clean UI that works on all screen sizes
- **TypeScript**: Fully typed for better development experience
- **System Messages**: Discrete notifications when users join/leave

## 🛠 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Cross-tab Communication**: `react-broadcast-sync` + BroadcastChannel API
- **Styling**: Custom CSS with CSS Variables for theming
- **State Management**: React Hooks with custom `useCollaborativeSession` hook

## 📦 Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd dashboard
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000` (or the URL shown in your terminal)

## 🎮 How to Use

### Testing Cross-Tab Functionality

1. **Open the application** in your browser
2. **Open multiple tabs** with the same URL (`http://localhost:3000`)
3. Each tab represents a different user with a randomly generated name

### User Presence System

- **View Active Users**: See all users currently online in the left panel
- **Join/Leave Notifications**: Watch discrete system messages when users open/close tabs
- **Activity Timestamps**: See when each user was last active

### Shared Counter

- **Increment/Decrement**: Use the + and - buttons to modify the counter
- **Real-time Updates**: Watch the counter update instantly in all open tabs
- **Last Action Tracking**: See who made the last change and when

### Chat System

- **Send Messages**: Type in the text area and press Enter or click Send
- **Typing Indicators**: See when other users are typing
- **Message Timestamps**: Each message shows the sender and time sent
- **Delete Messages**: Click the × button to delete your own messages
- **Expiring Messages**:
  - Enter minutes in the "Min" field before sending
  - Watch messages countdown and disappear automatically
  - Example: Enter "0.1" for 6-second expiration

### Theme Switching

- **Toggle Theme**: Click the theme button in the top-right corner
- **Synchronized Changes**: Theme changes apply to all open tabs instantly
- **Persistent**: Your theme preference is saved in localStorage

## 🏗 Project Structure

```
src/
├── components/
│   ├── Chat.tsx              # Real-time chat component
│   ├── UserList.tsx          # Active users display
│   └── ThemeButton.tsx       # Theme toggle button
├── hooks/
│   └── useCollaborativeSession.ts  # Main collaboration logic
├── App.tsx                   # Main application component
├── index.css                 # Global styles and theme variables
└── main.tsx                  # Application entry point
```

## 🔧 Architecture

### Custom Hook: `useCollaborativeSession`

The core of the application is the `useCollaborativeSession` hook that:

- Manages all shared state (users, messages, counter, theme)
- Handles cross-tab communication via broadcast channels
- Provides actions for user interactions
- Manages user presence detection and cleanup

### Communication Strategy

- **Primary**: `react-broadcast-sync` for reliable message passing
- **Fallback**: Native BroadcastChannel API for broader browser support
- **Sync Protocol**: New tabs request current state from existing tabs

### State Management

- **Users**: Tracked by unique tab IDs with activity timestamps
- **Messages**: Chat messages with expiration support
- **Counter**: Shared numeric value with last-changed-by tracking
- **Theme**: Synchronized across tabs with localStorage persistence

## 🎯 Key Features Demo

### 1. Multi-Tab User Presence

```
Tab 1: Alice (you)
Tab 2: Bob
Tab 3: Charlie

→ Close Tab 2
→ System: "Bob left the chat"
```

### 2. Real-Time Counter Sync

```
Tab 1: Counter = 5 (last changed by Alice)
→ Click + in Tab 2
Tab 1: Counter = 6 (last changed by Bob)
```

### 3. Live Chat with Typing

```
Tab 1: Type "Hello..."
Tab 2: Shows "Alice is typing..."
Tab 1: Send message
Tab 2: Message appears instantly
```

### 4. Expiring Messages

```
1. Type message
2. Set expiration to 0.1 minutes
3. Send message
4. Watch 6-second countdown: "6s", "5s"...
5. Message disappears from all tabs
```

## 🚦 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript checks

### Browser Compatibility

- Chrome/Edge 60+
- Firefox 54+
- Safari 10.1+
- Requires BroadcastChannel API support

## 🐛 Troubleshooting

### Common Issues

**Messages not syncing between tabs:**

- Ensure you're using the same URL in all tabs
- Check browser console for BroadcastChannel errors
- Try refreshing all tabs

**User list not updating:**

- Verify tabs are on the same domain
- Check if localStorage is accessible
- Make sure BroadcastChannel is supported

**Theme not syncing:**

- Confirm localStorage permissions
- Check if multiple origins are being used

## 📝 License

This project is for demonstration purposes. Feel free to use and modify as needed.

---

**Enjoy collaborating across tabs! 🎉**
