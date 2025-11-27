import React, { createContext } from "react";
import { useFetchApi } from "../hooks/useFetchApi";
import { useFetchApi as useFetchApiEspecialidad } from "../../especialidad/hooks/useFetchApi";
import { useFetchApi as useFetchApiGrado } from "../../grado/hooks/useFetchApi";
import { useFetchApi as useFetchApiNivel } from "../../nivel/hooks/useFetchApi";

export const CursoContext = createContext();
export const CursoContextProvider = ({ children }) => {

  const {
    cursos, consultaCursos,
    storeCurso, updateCurso, 
    deleteCurso, isLoading, 
    contextHolder, contextHolder2
  } = useFetchApi();

  const { comboEspecialidades, getComboEspecialidades } = useFetchApiEspecialidad();
  const { comboGrados, getComboGrados } = useFetchApiGrado();
  const { comboNiveles, getComboNiveles } = useFetchApiNivel();

  return (
      <CursoContext.Provider
        value={{ 
          cursos, consultaCursos,
          storeCurso, updateCurso, 
          deleteCurso, isLoading, 
          contextHolder, contextHolder2,
          comboEspecialidades, getComboEspecialidades,
          comboGrados, getComboGrados,
          comboNiveles, getComboNiveles,
        }}
      >
        {children}
      </CursoContext.Provider>
    );
}
