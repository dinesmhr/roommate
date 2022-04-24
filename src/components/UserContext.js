import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';

export const UserContext = React.createContext();
export const ActionContext = React.createContext();

export const UserProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return subscriber;
  }, []);

  return (
    <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>
  );
};

export const ActionProvider = ({children}) => {
  const [action, setAction] = useState(false);
  const handleAction = () => {
    setAction(!action);
  };
  return (
    <ActionContext.Provider value={{action, handleAction}}>
      {children}
    </ActionContext.Provider>
  );
};
