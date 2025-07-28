# React Developer Assignment: Cross-Tab Collaboration Dashboard

## Time Limit: 3 hours

You are expected to focus on the core requirements. Bonus features are optional and may be partially implemented if time allows.

## Overview

Build a real-time collaboration dashboard that synchronizes user activity across multiple browser tabs using the  
<a href="https://www.npmjs.com/package/react-broadcast-sync" target="_blank" rel="noopener noreferrer">react-broadcast-sync</a> library.

---

## Setup Instructions

1. Create a new React project using any setup you prefer (e.g., Vite, CRA, Next.js)
2. Install the required package:
   ```bash
   npm install react-broadcast-sync
   ```
3. Use any styling approach (CSS, Tailwind, MUI, etc.)

---

## Requirements - Mandatory

### 1. Custom Hook
Create a custom hook called `useCollaborativeSession` that:
- Sets up the broadcast channel
- Manages internal state for users, chat, counter
- Exposes state and actions:
  - `users`, `messages`, `counter`
  - `sendMessage()`, `updateCounter()`, `markTyping()`, etc.
- Internally uses `react-broadcast-sync` to handle cross-tab communication

### 2. User Presence System
- Detect and display active users (based on tabs)
- Show a user list with:
  - Username or ID (you can generate random names if needed)
  - Last activity timestamp
- Detect and visually indicate when a user joins or leaves

### 3. Shared Counter
- Counter that stays synchronized across all tabs
- Any user can increment/decrement the value
- Show which user performed the last action
- Display timestamp of last action
  
### 4. Real-time Chat
- Text area for message writing
- Show typing indicators when users are actively typing
- Synchronize conversation content across all tabs
- For each message display which user sent it and its timestamp
- Allow users to delete **their own** messages from the chat with syncing across tabs
- Allow users to send a messages with expiration

### 5. Technical Standards
- Use proper error handling and cleanup
- Use TypeScript or well-typed PropTypes
- Abstract logic into reusable components/hooks
- Keep the code modular, readable, and clean
- Synchronize existing state on page load (rehydrate from current messages/users)

---

## Bonus Features
- Theme sync across tabs (light/dark mode)
- Include debouncing for frequent updates
- Implement loading states
- Add responsive layout
- Activity feed showing recent actions
- User avatar system
- Focus/cursor position indicators

---

## Deliverables
1. Complete source code
2. README with setup instructions and implementation notes
3. Working demo (open multiple tabs to test)

---

## Evaluation Criteria
- Proper use and integration of `react-broadcast-sync`
- Correct and clean custom hook abstraction
- Working real-time sync across tabs
- Well-structured and maintainable code
- Functional and user-friendly UI
- Handling of edge cases (e.g., expired messages, tab close)
- Bonus points for creative features, polish, or great UX
