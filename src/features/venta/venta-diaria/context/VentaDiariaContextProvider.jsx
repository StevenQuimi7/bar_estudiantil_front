import React, { createContext, useState, useEffect } from "react";
//import { useFetchApi } from "../hooks/useFetchApi";
import { useFetchApi as useFetchApiProducto } from "../../../producto/hooks/useFetchApi";
import { useFetchApi as useFetchApiCliente } from "../../../cliente/hooks/useFetchApi";
import { useFetchApi } from "../hooks/useFetchApi";

export const VentaDiariaContext = createContext();

export const VentaDiariaContextProvider = ({ children }) => {
  const [busqueda, setBusqueda] = useState("");
  const [detalle, setDetalle] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const { storeVenta, isLoading, contextHolder, contextHolder2 } = useFetchApi();
  const { productos, consultaProductos } = useFetchApiProducto();
  const { comboClientes, getComboClientes } = useFetchApiCliente();
  const [pagado, setPagado] = useState(true);

  // Filtrar productos por búsqueda
  useEffect(() => {
    const timeout = setTimeout(() => {
      consultaProductos({ nombre: busqueda });
    }, 400);

    return () => clearTimeout(timeout);
  }, [busqueda]);


  // Agregar producto al detalle de venta
  const agregarProducto = (producto) => {
    const existe = detalle.find((d) => d.id === producto.id);
    if (existe) {
      setDetalle((prev) =>
        prev.map((d) =>
          d.id === producto.id ? { ...d, cantidad: d.cantidad + 1 } : d
        )
      );
    } else {
      setDetalle((prev) => [
        ...prev,
        { ...producto, cantidad: 1 },
      ]);
    }
  };

  // Cambiar cantidad de producto en el detalle
  const cambiarCantidad = (id, cantidad) => {
    setDetalle((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, cantidad } : d
      )
    );
  };

  // Eliminar producto del detalle
  const eliminarItem = (id) => {
    setDetalle((prev) => prev.filter((d) => d.id !== id));
  };

  // Calcular totales
  const subtotal = detalle.reduce(
    (acc, d) => acc + d.precio * d.cantidad,
    0
  );
  const total = subtotal;
  //const iva = subtotal * 0.14;
  //const total = subtotal + iva;

  const guardar = async()=>{
    const detallesFormateados = detalle.map((item) => ({
      id_producto : item.id,
      cantidad    : item.cantidad,
      precio      : item.precio,
      subtotal    : item.precio * item.cantidad,
    }));

    const values = {
      id_cliente: clienteSeleccionado,
      estado_gestion: pagado ? "PAGADO" : "PENDIENTE",
      detalles: detallesFormateados,
    };
    const response = await storeVenta(values);
    if(response.ok){
      setDetalle([]);
      setClienteSeleccionado(null);
      setBusqueda('');
    }
  }
  

  return (
    <VentaDiariaContext.Provider
      value={{
        busqueda,
        setBusqueda,
        detalle,
        agregarProducto,
        cambiarCantidad,
        eliminarItem,
        subtotal,
        total,
        productos,
        consultaProductos,
        comboClientes,
        getComboClientes,
        clienteSeleccionado,
        setClienteSeleccionado,
        pagado,
        setPagado,
        guardar,
        isLoading,
        contextHolder,
        contextHolder2,
      }}
    >
      {children}
    </VentaDiariaContext.Provider>
  );
};
