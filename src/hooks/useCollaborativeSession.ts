import { useState } from 'react';

export interface User {
  id: string;
  name: string;
  lastActivity: number;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
  expiresAt?: number;
}

export interface CounterState {
  value: number;
  lastChangedBy: string;
  lastChangeAt: number;
}

export const useCollaborativeSession = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [counter, setCounter] = useState<CounterState>({
    value: 0,
    lastChangedBy: '',
    lastChangeAt: Date.now(),
  });

  const sendMessage = (text: string) => {};

  const updateCounter = (newValue: number) => {};

  const addUser = (user: User) => {};

  const removeUser = (userId: string) => {};

  return {
    users,
    messages,
    counter,
    sendMessage,
    updateCounter,
    addUser,
    removeUser,
  };
};
