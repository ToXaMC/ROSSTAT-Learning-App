import React, { createContext, useState } from 'react';

export const MainContext = createContext();

export function MainContextProvider({ children }) {
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <MainContext.Provider
      value={{
        selectedTask,
        setSelectedTask,
      }}>
      {children}
    </MainContext.Provider>
  );
}
