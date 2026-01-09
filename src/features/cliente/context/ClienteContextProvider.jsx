import React, { createContext } from "react";
import { useFetchApi } from "../hooks/useFetchApi";
export const ClienteContext = createContext();
export const ClienteContextProvider = ({ children }) => {

  const {
    clientes, consultaClientes,
    storeCliente, updateCliente, 
    comboTipoClientes,getComboTipoClientes,
    deleteCliente, isLoading,
    cargaMasiva, exportar, exportarPlantilla,
    contextHolder, contextHolder2
  } = useFetchApi();

  return (
      <ClienteContext.Provider
        value={{ 
          clientes, consultaClientes,
          storeCliente, updateCliente,
          comboTipoClientes, getComboTipoClientes,
          cargaMasiva, exportar, exportarPlantilla,
          deleteCliente, isLoading,
          contextHolder, contextHolder2
        }}
      >
        {children}
      </ClienteContext.Provider>
    );
}
