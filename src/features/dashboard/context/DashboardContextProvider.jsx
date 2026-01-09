import React, { createContext} from "react";
import { useFetchApi } from "../hooks/useFetchApi";

export const DashboardContext = createContext();
export const DashboardContextProvider = ({ children }) => {

  const {
    consultaTopFive, consultaVentasMeses,
    consultaComparativaAnios, comparativaAnios, 
    ventasMeses,topFive, isLoading, 
    contextHolder, contextHolder2
  } = useFetchApi();

  return (
      <DashboardContext.Provider
        value={{ 
          consultaTopFive, consultaVentasMeses,
          consultaComparativaAnios, comparativaAnios, 
          ventasMeses,topFive, isLoading, 
          contextHolder, contextHolder2 
        }}
      >
        {children}
      </DashboardContext.Provider>
    );
}
