import { createContext, React, useContext, useEffect, useState } from "react";

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("splitmateUser");
    if (saved) setUser(JSON.parse(saved));
  }, [setUser]);

  return <StoreContext.Provider value={{ user, setUser }}>{children}</StoreContext.Provider>;
};

export const useStore = () => useContext(StoreContext);
