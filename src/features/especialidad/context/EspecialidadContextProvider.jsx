import React, { createContext} from "react";
import { useFetchApi } from "../hooks/useFetchApi";

export const EspecialidadContext = createContext();
export const EspecialidadContextProvider = ({ children }) => {

  const {
    especialidades, consultaEspecialidades,
    storeEspecialidad, updateEspecialidad, 
    deleteEspecialidad, isLoading, 
    contextHolder, contextHolder2
  } = useFetchApi();

  return (
      <EspecialidadContext.Provider
        value={{ 
          especialidades, consultaEspecialidades,
          storeEspecialidad, updateEspecialidad, 
          deleteEspecialidad, isLoading, 
          contextHolder, contextHolder2 
        }}
      >
        {children}
      </EspecialidadContext.Provider>
    );
}
