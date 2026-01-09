import React, { useState } from "react";
import { CreditoService } from "../../../../services/creditos/CreditoService.js";
import { message, notification } from "antd";
import moment from "moment";
export const useFetchApi = () => {
  const [credito, setCredito] = useState({});
  const [movimientos, setMovimientos] = useState({});
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

  const consultaCredito = async (values = {}) => {
    try {
      setIsLoading(true);
      const response = await CreditoService.creditoCliente(values);
      if (response.ok) {
        const { data } = response;
        setCredito(data);
        if(data && data.id){
          consultaMovimientos({id_credito_cliente: data.id});
        }
      }
    } catch (error) {
      const msj = error?.msj ?? ["Error en el servidor"];
      mensaje("error", msj);
    } finally {
      setIsLoading(false);
    }
  };

  const consultaMovimientos = async (values = {}) => {
    try {
      setIsLoading(true);
      const response = await CreditoService.consultaMovimientos(values);
      if (response.ok) {
        const { data, current_page, per_page, total } = response.data;
        setMovimientos({
          data: mapMovimientos(data, current_page, per_page),
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

  const storeCredito = async (values = null) => {
    try {
      setIsLoading(true);
      const response = await CreditoService.storeCredito(values);
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

  const mapMovimientos = (movimientos, current_page, per_page) => {
    const startIndex = (current_page - 1) * per_page;
    return movimientos.map((movimiento, key) => ({
      ...movimiento,
      key: key,
      id: movimiento.id,
      numero: startIndex + key + 1,
      created_at: moment(movimiento.created_at).format("DD/MM/YYYY"),
      usuario_creacion: movimiento?.user?.username,
    }));
  };

  return {
    credito,
    movimientos,
    setMovimientos,
    setCredito,
    isLoading,
    setIsLoading,
    consultaCredito,
    consultaMovimientos,
    storeCredito,
    mensaje,
    contextHolder,
    openNotificationWithIcon,
    contextHolder2,
  };
};
