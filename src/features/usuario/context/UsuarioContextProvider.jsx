import React, { createContext } from "react";
import { useFetchApi } from "../hooks/useFetchApi";

export const UsuarioContext = createContext();
export const UsuarioContextProvider = ({ children }) => {

  const {
    usuarios, consultaUsuarios,
    roles, consultaRoles,
    storeUsuario, updateUsuario, 
    deleteUsuario, isLoading, 
    restoreUsuario,
    contextHolder, contextHolder2
  } = useFetchApi();

  return (
      <UsuarioContext.Provider
        value={{ 
          usuarios, consultaUsuarios,
          roles, consultaRoles,
          storeUsuario, updateUsuario, 
          deleteUsuario, isLoading, restoreUsuario,
          contextHolder, contextHolder2 
        }}
      >
        {children}
      </UsuarioContext.Provider>
    );
}
