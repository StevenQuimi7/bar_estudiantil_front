import React, { createContext} from "react";
import { useFetchApi } from "../hooks/useFetchApi";

export const GradoContext = createContext();
export const GradoContextProvider = ({ children }) => {

  const {
    grados, consultaGrados,
    storeGrado, updateGrado, 
    deleteGrado, isLoading, 
    contextHolder, contextHolder2
  } = useFetchApi();

  return (
      <GradoContext.Provider
        value={{ 
          grados, consultaGrados,
          storeGrado, updateGrado, 
          deleteGrado, isLoading, 
          contextHolder, contextHolder2 
        }}
      >
        {children}
      </GradoContext.Provider>
    );
}
