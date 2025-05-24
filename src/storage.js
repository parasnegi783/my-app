// src/storage.js
export const saveMessage = (user, message) => {
    try {
      const key = `chat_with_${user}`;
      const existing = JSON.parse(localStorage.getItem(key)) || [];
      const updated = [...existing, message];
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  };
  
  
  export const getMessages = (user) => {
    const key = `chat_with_${user}`;
    return JSON.parse(localStorage.getItem(key)) || [];
  };
  