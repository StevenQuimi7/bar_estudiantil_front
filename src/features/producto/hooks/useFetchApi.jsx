import React, { useState } from "react";
import { ProductoService } from "../../../services/productos/ProductoService.js";
import { message, notification } from "antd";
import moment from "moment";
export const useFetchApi = () => {
  const [productos, setProductos] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [api, contextHolder2] = notification.useNotification();

  const mensaje = (type = "info", content = "", closable = false) => {
    messageApi.open({
      type,
      content,
      duration: 5,
    });
  };

  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message,
      description,
      duration: 0,
      closable: true,
    });
  };

  const consultaProductos = async (values = {}) => {
    try {
      setIsLoading(true);
      const response = await ProductoService.getProductos(values);
      if (response.ok) {
        const { data, current_page, per_page, total } = response.data;
        setProductos({
          data: mapProductos(data, current_page, per_page),
          current_page,
          per_page,
          total,
        });
      }
    } catch (error) {
      const msj = error?.msj ?? ["Error en el servidor"];
      mensaje("error", msj);
    } finally {
      setIsLoading(false);
    }
  };
  const storeProducto = async (values = null) => {
    try {
      setIsLoading(true);
      const response = await ProductoService.storeProducto(values);
      if (response.ok) {
        mensaje("success", "Registrado exitosamente");
        return { ok: true };
      }
    } catch (error) {
      const msj = error?.msj ?? null;
      if (msj !== null) {
        openNotificationWithIcon("error", "Error al momento de guardar", msj);
      }
      return {
        ok: false,
        error: {
          formulario: error?.errors ?? {},
          validaciones: msj,
        },
      };
    } finally {
      setIsLoading(false);
    }
  };
  const updateProducto = async (values = null) => {
    try {
      setIsLoading(true);
      const response = await ProductoService.updateProducto(values);
      if (response.ok) {
        mensaje("success", "Actualizado exitosamente");
        return { ok: true };
      }
    } catch (error) {
      const msj = error?.msj ?? null;
      if (msj !== null) {
        openNotificationWithIcon(
          "error",
          "Error al momento de actualizar",
          msj
        );
      }
      return {
        ok: false,
        error: {
          formulario: error?.errors ?? {},
          validaciones: msj,
        },
      };
    } finally {
      setIsLoading(false);
    }
  };
  const deleteProducto = async (values = null) => {
    try {
      setIsLoading(true);
      const response = await ProductoService.deleteProducto(values);
      if (response.ok) {
        mensaje("success", "Eliminado exitosamente");
        return { ok: true };
      }
    } catch (error) {
      const msj = error?.msj ?? "Error en el servidor";
      openNotificationWithIcon("error", "Error al momento de eliminar", msj);
    } finally {
      setIsLoading(false);
    }
  };

  const cargaMasiva = async (values = null) => {
    try {
      setIsLoading(true);
      const response = await ProductoService.cargaMasiva(values);
      if (response.ok) {
        mensaje("success", "Registrado exitosamente");
        return { ok: true };
      }
    } catch (error) {
      const msj = error?.msj ?? null;
      if (msj !== null) {
        openNotificationWithIcon("error", "Error al momento de guardar", msj);
      }
      return {
        ok: false,
        error: {
          formulario: error?.errors ?? {},
          validaciones: msj,
        },
      };
    } finally {
      setIsLoading(false);
    }
  };

  const exportar = async (values = null) => {
    ProductoService.exportar(values)
    .then((response) => {
      setIsLoading(true);
      const blob = new Blob([response]);
      // Crea un objeto URL para el blob
      const url = window.URL.createObjectURL(blob);

      // Crea un enlace temporal para descargar el archivo
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_productos_${Date.now()}.xlsx`;

      // Haz clic en el enlace para descargar el archivo
      a.click();

      // Libera el objeto URL
      window.URL.revokeObjectURL(url);
      mensaje("success", "Reporte generado exitosamente");

    })
    .catch((error) => {
      const msj = error?.msj ?? "No se pudo generar el reporte";
      openNotificationWithIcon("error", "Error al exportar", msj);
    })
    .finally(() => {
      setIsLoading(false);
    }); 

  };

  const exportarPlantilla = async () => {
    ProductoService.exportarPlantilla()
    .then((response) => {
      setIsLoading(true);
      const blob = new Blob([response]);
      // Crea un objeto URL para el blob
      const url = window.URL.createObjectURL(blob);

      // Crea un enlace temporal para descargar el archivo
      const a = document.createElement('a');
      a.href = url;
      a.download = `plantilla_productos_${Date.now()}.xlsx`;

      // Haz clic en el enlace para descargar el archivo
      a.click();

      // Libera el objeto URL
      window.URL.revokeObjectURL(url);
      mensaje("success", "Plantilla generado exitosamente");

    })
    .catch((error) => {
      const msj = error?.msj ?? "No se pudo generar la plantilla";
      openNotificationWithIcon("error", "Error al exportar la plantilla", msj);
    })
    .finally(() => {
      setIsLoading(false);
    }); 

  };


  const mapProductos = (productos, current_page, per_page) => {
    const startIndex = (current_page - 1) * per_page;
    return productos.map((producto, key) => ({
      ...producto,
      key: key,
      id: producto.id,
      numero: startIndex + key + 1,
      categoria: producto?.categoria?.nombre,
      codigo: producto?.codigo,
      precio: producto?.precio,
      created_at: moment(producto.created_at).format("DD/MM/YYYY"),
      usuario_creacion: producto?.user?.username,
    }));
  };

  return {
    productos,
    setProductos,
    isLoading,
    setIsLoading,
    consultaProductos,
    storeProducto,
    updateProducto,
    deleteProducto,
    cargaMasiva,
    exportar,
    exportarPlantilla,
    mensaje,
    contextHolder,
    openNotificationWithIcon,
    contextHolder2,
  };
};
