import { createContext, useContext, useState } from 'react';

const DieticianContext = createContext();

export const useDieticianContext = () => {
  return useContext(DieticianContext);
};

export const DieticianProvider = ({ children }) => {
  const [email, setEmail] = useState('');

  return (
    <DieticianContext.Provider value={{ email, setEmail }}>
      {children}
    </DieticianContext.Provider>
  );
};
