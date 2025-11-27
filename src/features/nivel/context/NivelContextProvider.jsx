import React, { createContext } from "react";
import { useFetchApi } from "../hooks/useFetchApi";

export const NivelContext = createContext();
export const NivelContextProvider = ({ children }) => {

  const {
    niveles, consultaNiveles,
    storeNivel, updateNivel, 
    deleteNivel, isLoading, 
    contextHolder, contextHolder2
  } = useFetchApi();

  return (
      <NivelContext.Provider
        value={{ 
          niveles, consultaNiveles,
          storeNivel, updateNivel, 
          deleteNivel, isLoading, 
          contextHolder, contextHolder2 
        }}
      >
        {children}
      </NivelContext.Provider>
    );
}
