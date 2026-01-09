import React, { createContext } from "react";
import { useFetchApi } from "../hooks/useFetchApi";
export const CreditoContext = createContext();
export const CreditoContextProvider = ({ children }) => {

  const {
    credito, consultaCredito,
    storeCredito, isLoading,
    movimientos, consultaMovimientos,
    contextHolder, contextHolder2
  } = useFetchApi();

  return (
      <CreditoContext.Provider
        value={{ 
          credito, consultaCredito,
          movimientos, consultaMovimientos,
          storeCredito, isLoading,
          contextHolder, contextHolder2
        }}
      >
        {children}
      </CreditoContext.Provider>
    );
}
