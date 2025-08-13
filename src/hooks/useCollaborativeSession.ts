import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { BroadcastMessage, useBroadcastProvider } from 'react-broadcast-sync';

export interface User {
  id: string;
  name: string;
  activities: Activity[];
}

export interface Activity {
  type: 'session_created' | 'counter_updated' | 'message_sent';
  timestamp: number;
  metadata?: Record<string, unknown>;
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

interface UserMessage {
  type: 'join' | 'leave' | 'sync-request' | 'sync-response' | 'activity';
  user?: User;
  userId?: string;
  users?: User[];
  timestamp: number;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const randomNames = [
  'Alice',
  'Bob',
  'Charlie',
  'Diana',
  'Eve',
  'Frank',
  'Grace',
  'Henry',
  'Ivy',
  'Jack',
  'Kate',
  'Liam',
  'Maya',
  'Noah',
  'Olivia',
  'Paul',
  'Quinn',
  'Ruby',
  'Sam',
  'Tara',
  'Uma',
  'Victor',
  'Wendy',
  'Xander',
];

const getRandomName = () =>
  randomNames[Math.floor(Math.random() * randomNames.length)];

const getUserHashFromUrl = () => {
  const hash = window.location.hash.slice(1);
  return hash || null;
};

const createActivity = (type: Activity['type'], metadata?: Record<string, unknown>): Activity => ({
  type,
  timestamp: Date.now(),
  metadata,
});

const addActivityToUser = (user: User, activity: Activity): User => ({
  ...user,
  activities: [...user.activities, activity],
});

const setUserHashInUrl = (hash: string) => {
  window.location.hash = hash;
};

const createUserSession = (): User => {
  const existingHash = getUserHashFromUrl();
  let userHash = existingHash;
  
  if (!userHash) {
    userHash = generateId();
    setUserHashInUrl(userHash);
  }

  const userKey = `dashboard-user-${userHash}`;
  const savedUser = localStorage.getItem(userKey);

  if (savedUser) {
    try {
      const parsedUser = JSON.parse(savedUser);

      if (!parsedUser.activities) {
        parsedUser.activities = [createActivity('session_created')];
      }

      const updatedUser = addActivityToUser(parsedUser, createActivity('session_created'));
      localStorage.setItem(userKey, JSON.stringify(updatedUser));
      return updatedUser;
    } catch {}
  }

  const newUser: User = {
    id: userHash,
    name: getRandomName(),
    activities: [createActivity('session_created')],
  };

  localStorage.setItem(userKey, JSON.stringify(newUser));
  return newUser;
};const savePersistentUser = (user: User) => {
  const userKey = `dashboard-user-${user.id}`;
  localStorage.setItem(userKey, JSON.stringify(user));
};

export const useCollaborativeSession = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [counter, setCounter] = useState<CounterState>({
    value: 0,
    lastChangedBy: '',
    lastChangeAt: Date.now(),
  });

  const [currentUser] = useState<User>(() => createUserSession());
  const currentUserRef = useRef<User>(currentUser);

  const { messages, channel } = useBroadcastProvider();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  console.log('🔗 Broadcast channel state:', { 
    channel: !!channel, 
    messagesCount: messages.length,
    channelName: channel ? 'available' : 'null'
  });

  const handleNativeMessage = useCallback((message: UserMessage) => {
    if (message.userId === currentUser.id) return;

    switch (message.type) {
      case 'join':
      case 'sync-response':
      case 'activity':
        if (message.user && message.user.id !== currentUser.id) {
          setUsers((prevUsers) => {
            const existingUserIndex = prevUsers.findIndex(
              (u) => u.id === message.user!.id
            );
            
            console.log('➕ Adding/updating user via native channel:', message.user);
            
            if (existingUserIndex >= 0) {
              const newUsers = [...prevUsers];
              newUsers[existingUserIndex] = message.user!;
              return newUsers;
            } else {
              return [...prevUsers, message.user!];
            }
          });

          if (message.type === 'join') {
            setTimeout(() => {
              if (broadcastChannelRef.current) {
                broadcastChannelRef.current.postMessage({
                  type: 'sync-response',
                  user: { ...currentUser },
                  timestamp: Date.now(),
                } as UserMessage);
              }
            }, 50);
          }
        }
        break;
      case 'leave':
        if (message.userId && message.userId !== currentUser.id) {
          console.log('👋 User leaving via native channel:', message.userId);
          setUsers((prevUsers) =>
            prevUsers.filter((u) => u.id !== message.userId)
          );
        }
        break;
      case 'sync-request':
        if (message.userId !== currentUser.id) {
          console.log('🔄 Native sync request received from:', message.userId);
          if (broadcastChannelRef.current) {
            broadcastChannelRef.current.postMessage({
              type: 'sync-response',
              user: { ...currentUser },
              timestamp: Date.now(),
            } as UserMessage);
          }
        }
        break;
    }
  }, [currentUser]);

  useEffect(() => {
    broadcastChannelRef.current = new BroadcastChannel('dashboard-native-channel');
    
    const handleMessage = (event: MessageEvent) => {
      console.log('📻 Native BroadcastChannel message received:', event.data);
      handleNativeMessage(event.data);
    };
    
    broadcastChannelRef.current.addEventListener('message', handleMessage);

    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.removeEventListener('message', handleMessage);
        broadcastChannelRef.current.close();
      }
    };
  }, [handleNativeMessage]);

  const postMessage = useCallback(
    (data: UserMessage) => {
      console.log('📤 Sending message:', data);
      
      if (channel) {
        channel.postMessage(data);
      }
      
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage(data);
      }
    },
    [channel]
  );

  const addUserActivity = useCallback((activityType: Activity['type'], metadata?: Record<string, unknown>) => {
    if (currentUser) {
      const newActivity = createActivity(activityType, metadata);
      const updatedUser = addActivityToUser(currentUser, newActivity);
      savePersistentUser(updatedUser);
      currentUserRef.current = updatedUser;

      postMessage({
        type: 'activity',
        user: updatedUser,
        timestamp: Date.now(),
      } as UserMessage);
    }
  }, [currentUser, postMessage]);

  const removeInactiveUsers = useCallback(() => {
    return;
  }, []);

  useEffect(() => {
    console.log('📨 Messages received:', messages.length, messages);
    const latestMessages = messages.slice(-10);

    latestMessages.forEach((broadcastMessage: BroadcastMessage) => {
      console.log('🔍 Processing broadcast message:', broadcastMessage);
      if (
        broadcastMessage.message &&
        typeof broadcastMessage.message === 'object'
      ) {
        const message = broadcastMessage.message as UserMessage;
        console.log('✅ Valid message found:', message);

        switch (message.type) {
          case 'join':
            if (message.user && message.user.id !== currentUser.id) {
              console.log('📥 JOIN message received:', message.user);
              setUsers((prevUsers) => {
                console.log('👥 Previous users before join:', prevUsers);
                const existingUserIndex = prevUsers.findIndex(
                  (u) => u.id === message.user!.id
                );
                let newUsers;
                if (existingUserIndex >= 0) {
                  newUsers = [...prevUsers];
                  newUsers[existingUserIndex] = message.user!;
                  console.log('🔄 Updated existing user, new list:', newUsers);
                } else {
                  newUsers = [...prevUsers, message.user!];
                  console.log('➕ Added new user, new list:', newUsers);
                }
                return newUsers;
              });

              postMessage({
                type: 'sync-response',
                user: { ...currentUser },
                timestamp: Date.now(),
              } as UserMessage);

              setTimeout(() => {
                postMessage({
                  type: 'join',
                  user: { ...currentUser },
                  timestamp: Date.now(),
                } as UserMessage);
              }, 100);
            }
            break;

          case 'leave':
            if (message.userId && message.userId !== currentUser.id) {
              setUsers((prevUsers) =>
                prevUsers.filter((u) => u.id !== message.userId)
              );
            }
            break;

          case 'sync-request':
            if (message.userId !== currentUser.id) {
              console.log('🔄 Sync request received from:', message.userId);
              postMessage({
                type: 'sync-response',
                user: { ...currentUser },
                timestamp: Date.now(),
              } as UserMessage);
              
              setTimeout(() => {
                postMessage({
                  type: 'join',
                  user: { ...currentUser },
                  timestamp: Date.now(),
                } as UserMessage);
              }, 50);
            }
            break;

          case 'sync-response':
            if (message.user && message.user.id !== currentUser.id) {
              setUsers((prevUsers) => {
                const existingUserIndex = prevUsers.findIndex(
                  (u) => u.id === message.user!.id
                );
                if (existingUserIndex >= 0) {
                  const newUsers = [...prevUsers];
                  newUsers[existingUserIndex] = message.user!;
                  return newUsers;
                } else {
                  return [...prevUsers, message.user!];
                }
              });
            }
            break;

          case 'activity':
            if (message.user && message.user.id !== currentUser.id) {
              console.log('💓 Activity update received:', message.user);
              setUsers((prevUsers) => {
                const existingUserIndex = prevUsers.findIndex(
                  (u) => u.id === message.user!.id
                );
                
                if (existingUserIndex >= 0) {
                  const newUsers = [...prevUsers];
                  newUsers[existingUserIndex] = message.user!;
                  console.log('🔄 Updated user activity, new list:', newUsers);
                  return newUsers;
                } else {
                  const newUsers = [...prevUsers, message.user!];
                  console.log('➕ Adding user from activity, new list:', newUsers);
                  return newUsers;
                }
              });
            }
            break;
        }
      }
    });
  }, [messages, postMessage, currentUser]);

  useEffect(() => {
    const userId = currentUser.id;

    postMessage({
      type: 'join',
      user: { ...currentUser },
      timestamp: Date.now(),
    } as UserMessage);

    postMessage({
      type: 'sync-request',
      userId: currentUser.id,
      timestamp: Date.now(),
    } as UserMessage);

    setTimeout(() => {
      postMessage({
        type: 'sync-request',
        userId: currentUser.id,
        timestamp: Date.now(),
      } as UserMessage);
    }, 100);

    setTimeout(() => {
      postMessage({
        type: 'sync-request',
        userId: currentUser.id,
        timestamp: Date.now(),
      } as UserMessage);
    }, 500);

    setTimeout(() => {
      postMessage({
        type: 'sync-request',
        userId: currentUser.id,
        timestamp: Date.now(),
      } as UserMessage);
    }, 1000);

    intervalRef.current = setInterval(removeInactiveUsers, 60000);

    const handleBeforeUnload = () => {
      postMessage({
        type: 'leave',
        userId,
        timestamp: Date.now(),
      } as UserMessage);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setTimeout(() => {
          postMessage({
            type: 'sync-request',
            userId: currentUser.id,
            timestamp: Date.now(),
          } as UserMessage);
        }, 100);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      postMessage({
        type: 'leave',
        userId,
        timestamp: Date.now(),
      } as UserMessage);
    };
  }, [postMessage, currentUser, removeInactiveUsers]);

  const sendMessage = (text: string) => {
    addUserActivity('message_sent', { message: text });
    console.log('Sending message:', text);
  };

  const updateCounter = (newValue: number) => {
    addUserActivity('counter_updated', { 
      oldValue: counter.value, 
      newValue: newValue 
    });
    setCounter((prev) => ({
      ...prev,
      value: newValue,
      lastChangedBy: currentUser.name,
      lastChangeAt: Date.now(),
    }));
  };

  const addUser = (user: User) => {
    console.log('Adding user:', user);
    setUsers((prev) => [...prev, user]);
  };

  const removeUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const allUsers = useMemo(() => {
    const currentUserWithActivity = { 
      ...currentUserRef.current
    };
    
    const otherUsers = users.filter(user => user.id !== currentUser.id);
    
    const result = [currentUserWithActivity, ...otherUsers];
    
    return result;
  }, [users, currentUser]);

  return {
    users: allUsers,
    currentUser: currentUserRef.current,
    messages: [],
    counter,
    sendMessage,
    updateCounter,
    addUser,
    removeUser,
    addUserActivity,
  };
};
