import React, { createContext} from "react";
import { useFetchApi } from "../hooks/useFetchApi";

export const ControlVentaContext = createContext();
export const ControlVentaContextProvider = ({ children }) => {

  const {
    ventas, updateEstadoGestion, consultaVentas, isLoading, exportar, 
    contextHolder, contextHolder2
  } = useFetchApi();

  return (
      <ControlVentaContext.Provider
        value={{ 
          ventas, consultaVentas, updateEstadoGestion, isLoading, exportar,
          contextHolder, contextHolder2 
        }}
      >
        {children}
      </ControlVentaContext.Provider>
    );
}
