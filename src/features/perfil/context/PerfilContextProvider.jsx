import React, { createContext } from "react";
import { useFetchApi } from "../../usuario/hooks/useFetchApi";

export const PerfilContext = createContext();
export const PerfilContextProvider = ({ children }) => {

  const {
    miPerfil, consultaMiPerfil,updateUsuario, 
    isLoading, contextHolder, contextHolder2
  } = useFetchApi();

  return (
      <PerfilContext.Provider
        value={{ 
          miPerfil, consultaMiPerfil,
          updateUsuario, isLoading,
          contextHolder, contextHolder2 
        }}
      >
        {children}
      </PerfilContext.Provider>
    );
}
