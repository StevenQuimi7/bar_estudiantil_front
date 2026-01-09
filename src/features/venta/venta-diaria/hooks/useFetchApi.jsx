import React, { useState } from "react";
import { VentaService } from "../../../../services/ventas/VentaService";
import { message, notification } from "antd";
import moment from "moment";
export const useFetchApi = () => {
  const [ventas, setVentas] = useState({});
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

  const consultaVentas = async (values = {}) => {
    try {
      setIsLoading(true);
      const response = await VentaService.getClientes(values);
      if (response.ok) {
        const { data, current_page, per_page, total } = response.data;
        setVentas({
          data: mapVentas(data, current_page, per_page),
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
  const storeVenta = async (values = null) => {
    try {
      setIsLoading(true);
      const response = await VentaService.storeVenta(values);
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


  const mapVentas = (ventas, current_page, per_page) => {
    const startIndex = (current_page - 1) * per_page;
    return ventas.map((venta, key) => ({
      ...venta,
      key: key,
      id: venta.id,
      tipo_cliente: venta?.tipo_cliente?.nombre,
      numero: startIndex + key + 1,
      created_at: moment(venta.created_at).format("DD/MM/YYYY"),
      usuario_creacion: venta?.user?.username,
    }));
  };


  return {
    ventas,
    setVentas,
    isLoading,
    setIsLoading,
    consultaVentas,
    storeVenta,
    mensaje,
    contextHolder,
    openNotificationWithIcon,
    contextHolder2,
  };
};
