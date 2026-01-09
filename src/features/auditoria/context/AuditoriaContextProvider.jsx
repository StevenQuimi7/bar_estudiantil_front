import React, { createContext } from "react";
import { useFetchApi } from "../hooks/useFetchApi";
export const AuditoriaContext = createContext();
export const AuditoriaContextProvider = ({ children }) => {

  const {
    auditorias, consultaAuditorias,
    comboAcciones, getComboAcciones,
    comboModulos, getComboModulos, isLoading, 
    contextHolder, contextHolder2
  } = useFetchApi();

  return (
      <AuditoriaContext.Provider
        value={{ 
          auditorias, consultaAuditorias,
          comboAcciones, getComboAcciones, 
          comboModulos, getComboModulos,isLoading, 
          contextHolder, contextHolder2
        }}
      >
        {children}
      </AuditoriaContext.Provider>
    );
}
