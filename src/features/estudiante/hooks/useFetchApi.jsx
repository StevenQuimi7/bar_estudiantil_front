import React, { useState } from "react";
import { EstudianteService } from "../../../services/estudiantes/EstudianteService.js";
import { CursoService } from "../../../services/cursos/CursoService.js";
import { message, notification } from "antd";
import moment from "moment";
export const useFetchApi = () => {
  const [estudiantes, setEstudiantes] = useState({});
  const [comboCursos, setComboCursos] = useState([]);
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

  const consultaEstudiantes = async (values = {}) => {
    try {
      setIsLoading(true);
      const response = await EstudianteService.getEstudiantes(values);
      if (response.ok) {
        const { data, current_page, per_page, total } = response.data;
        setEstudiantes({
          data: mapEstudiantes(data, current_page, per_page),
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
  const storeEstudiante = async (values = null) => {
    try {
      setIsLoading(true);
      const response = await EstudianteService.storeEstudiante(values);
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
  const updateEstudiante = async (values = null) => {
    try {
      setIsLoading(true);
      const response = await EstudianteService.updateEstudiante(values);
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
  const deleteEstudiante = async (values = null) => {
    try {
      setIsLoading(true);
      const response = await EstudianteService.deleteEstudiante(values);
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

  const getComboCursos = async (values = {}) => {
      try {
        setIsLoading(true);
        const response = await CursoService.getComboCursos(values);
        if (response.ok) {
          const { data } = response;
          setComboCursos(data);
        }
      } catch (error) {
        const msj = error?.msj ?? ["Error en el servidor"];
        mensaje("error", msj);
      } finally {
        setIsLoading(false);
      }
    };

  const mapEstudiantes = (estudiantes, current_page, per_page) => {
    const startIndex = (current_page - 1) * per_page;
    return estudiantes.map((estudiante, key) => ({
      ...estudiante,
      key: key,
      id: estudiante.id,
      numero: startIndex + key + 1,
      numero_identificacion: estudiante?.cliente?.numero_identificacion,
      nombres: estudiante?.cliente?.nombres,
      apellidos: estudiante?.cliente?.apellidos,
      nivel: estudiante?.curso?.nivel?.nombre,
      grado: estudiante?.curso?.grado?.grado,
      seccion: estudiante?.curso?.seccion,
      especialidad: estudiante?.curso?.especialidad?.nombre,
      created_at: moment(estudiante.created_at).format("DD/MM/YYYY"),
      usuario_creacion: estudiante?.user?.username,
    }));
  };

  return {
    estudiantes,
    setEstudiantes,
    isLoading,
    setIsLoading,
    consultaEstudiantes,
    getComboCursos,
    comboCursos,
    storeEstudiante,
    updateEstudiante,
    deleteEstudiante,
    mensaje,
    contextHolder,
    openNotificationWithIcon,
    contextHolder2,
  };
};
