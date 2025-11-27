import React, { createContext } from "react";
import { useFetchApi } from "../hooks/useFetchApi";

export const RolePermisoContext = createContext();
export const RolePermisoContextProvider = ({ children }) => {

  const {
    roles_permisos, consultaRoles,
    consultaPermisos, permisos,
    storeRolePermiso, updateRolePermiso, 
    deleteRolePermiso, isLoading, 
    contextHolder, contextHolder2
  } = useFetchApi();

  return (
      <RolePermisoContext.Provider
        value={{ 
          roles_permisos, consultaRoles,
          consultaPermisos, permisos,
          storeRolePermiso, updateRolePermiso, 
          deleteRolePermiso, isLoading, 
          contextHolder, contextHolder2 
        }}
      >
        {children}
      </RolePermisoContext.Provider>
    );
}
