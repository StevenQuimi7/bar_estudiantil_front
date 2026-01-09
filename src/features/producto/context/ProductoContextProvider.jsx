import React, { createContext } from "react";
import { useFetchApi } from "../hooks/useFetchApi";
import { useFetchApi as useFetchApiCategoria } from "../../categoria/hooks/useFetchApi";
export const ProductoContext = createContext();
export const ProductoContextProvider = ({ children }) => {

  const {
    productos, consultaProductos,
    storeProducto, updateProducto,
    deleteProducto, cargaMasiva,
    exportar, exportarPlantilla, isLoading,
    contextHolder, contextHolder2
  } = useFetchApi();

  const {
    comboCategorias, getComboCategorias
  } = useFetchApiCategoria();

  return (
      <ProductoContext.Provider
        value={{ 
          productos, consultaProductos,
          comboCategorias, getComboCategorias,
          storeProducto, updateProducto, 
          deleteProducto, cargaMasiva,
          exportar, exportarPlantilla, isLoading,
          contextHolder, contextHolder2 
        }}
      >
        {children}
      </ProductoContext.Provider>
    );
}
