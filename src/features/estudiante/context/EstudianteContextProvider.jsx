import React, { createContext } from "react";
import { useFetchApi } from "../hooks/useFetchApi";
import { useFetchApi as useFetchApiCliente } from "../../cliente/hooks/useFetchApi";
export const EstudianteContext = createContext();
export const EstudianteContextProvider = ({ children }) => {

  const {
    estudiantes, consultaEstudiantes,
    comboCursos, getComboCursos,
    deleteEstudiante, isLoading,
    contextHolder, contextHolder2
  } = useFetchApi();

  const {
    comboTipoClientes, getComboTipoClientes,
    storeCliente, updateCliente, cargaMasiva, exportar,exportarPlantilla
  } = useFetchApiCliente();

  return (
      <EstudianteContext.Provider
        value={{ 
          estudiantes, consultaEstudiantes,
          comboTipoClientes, getComboTipoClientes,
          comboCursos,getComboCursos,
          storeCliente, updateCliente, 
          cargaMasiva, exportar,exportarPlantilla,
          deleteEstudiante, isLoading,
          contextHolder, contextHolder2 
        }}
      >
        {children}
      </EstudianteContext.Provider>
    );
}
