import React, { useState } from "react";
import { ClienteService } from "../../../services/clientes/ClienteService.js";
import { message, notification } from "antd";
import moment from "moment";
export const useFetchApi = () => {
  const [clientes, setClientes] = useState({});
  const [comboTipoClientes, setComboTipoClientes] = useState([]);
  const [comboClientes, setComboClientes] = useState({});
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

  const consultaClientes = async (values = {}) => {
    try {
      setIsLoading(true);
      const response = await ClienteService.getClientes(values);
      if (response.ok) {
        const { data, current_page, per_page, total } = response.data;
        setClientes({
          data: mapClientes(data, current_page, per_page),
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
  const storeCliente = async (values = null) => {
    try {
      setIsLoading(true);
      const response = await ClienteService.storeCliente(values);
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
  const updateCliente = async (values = null) => {
    try {
      setIsLoading(true);
      const response = await ClienteService.updateCliente(values);
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
  const deleteCliente = async (values = null) => {
    try {
      setIsLoading(true);
      const response = await ClienteService.deleteCliente(values);
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

  const mapClientes = (clientes, current_page, per_page) => {
    const startIndex = (current_page - 1) * per_page;
    return clientes.map((cliente, key) => ({
      ...cliente,
      key: key,
      id: cliente.id,
      tipo_cliente: cliente?.tipo_cliente?.nombre,
      numero: startIndex + key + 1,
      created_at: moment(cliente.created_at).format("DD/MM/YYYY"),
      usuario_creacion: cliente?.user?.username,
    }));
  };

  const getComboTipoClientes = async (values = {}) => {
    try {
      setIsLoading(true);
      const response = await ClienteService.getComboTipoClientes(values);
      if (response.ok) {
        const { data } = response;
        setComboTipoClientes(data);
      }
    } catch (error) {
      const msj = error?.msj ?? ["Error en el servidor"];
      mensaje("error", msj);
    } finally {
      setIsLoading(false);
    }
  };

  const getComboClientes = async (values = {}) => {
    try {
      setIsLoading(true);
      const response = await ClienteService.getComboClientes(values);
      if (response.ok) {
        const { data } = response.data;
        setComboClientes(data);
      }
    } catch (error) {
      const msj = error?.msj ?? ["Error en el servidor"];
      mensaje("error", msj);
    } finally {
      setIsLoading(false);
    }
  };

  const cargaMasiva = async (values = null) => {
    try {
      setIsLoading(true);
      const response = await ClienteService.cargaMasiva(values);
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
    ClienteService.exportar(values)
    .then((response) => {
      setIsLoading(true);
      const blob = new Blob([response]);
      // Crea un objeto URL para el blob
      const url = window.URL.createObjectURL(blob);

      // Crea un enlace temporal para descargar el archivo
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_clientes_${Date.now()}.xlsx`;

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

  const exportarPlantilla = async (values) => {
    ClienteService.exportarPlantilla(values)
    .then((response) => {
      setIsLoading(true);
      const blob = new Blob([response]);
      // Crea un objeto URL para el blob
      const url = window.URL.createObjectURL(blob);

      // Crea un enlace temporal para descargar el archivo
      const a = document.createElement('a');
      a.href = url;
      a.download = `plantilla_clientes_${Date.now()}.xlsx`;

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

  return {
    clientes,
    setClientes,
    comboTipoClientes,
    comboClientes,
    getComboTipoClientes,
    getComboClientes,
    isLoading,
    setIsLoading,
    consultaClientes,
    storeCliente,
    updateCliente,
    deleteCliente,
    exportar,
    exportarPlantilla,
    cargaMasiva,
    mensaje,
    contextHolder,
    openNotificationWithIcon,
    contextHolder2,
  };
};
