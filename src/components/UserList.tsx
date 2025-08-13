import React from 'react';
import { User, Activity } from '../hooks/useCollaborativeSession';

interface UserListProps {
  users: User[];
}

const styles = {
  userList: {
    background: '#f5f5f5',
    padding: '1rem',
    borderRadius: '8px',
    margin: '1rem 0',
  },
  title: {
    marginTop: 0,
    marginBottom: '1rem',
    color: '#333',
  },
  items: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    background: 'white',
    padding: '0.75rem',
    marginBottom: '0.5rem',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  name: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '0.25rem',
  },
  activity: {
    fontSize: '0.875rem',
    color: '#666',
    marginBottom: '0.25rem',
  },
};

export const UserList: React.FC<UserListProps> = ({ users }) => {
  const getLastActivity = (activities: Activity[]): Activity | undefined => {
    if (activities.length === 0) return undefined;
    return activities[activities.length - 1];
  };

  const formatActivityTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (users.length === 0) {
    return (
      <div style={styles.userList}>
        <h3 style={styles.title}>Active Users</h3>
        <p>No users online</p>
      </div>
    );
  }

  return (
    <div style={styles.userList}>
      <h3 style={styles.title}>Active Users ({users.length})</h3>
      <ul style={styles.items}>
        {users.map((user, index) => {
          const lastActivity = getLastActivity(user.activities);
          return (
            <li 
              key={user.id} 
              style={{
                ...styles.item,
                marginBottom: index === users.length - 1 ? 0 : '0.5rem'
              }}
            >
              <div style={styles.name}>{user.name}</div>
              <div style={styles.activity}>
                Last activity: {lastActivity ? formatActivityTime(lastActivity.timestamp) : 'No activity yet'}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserList;
