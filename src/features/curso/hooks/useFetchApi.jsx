import React, { useState } from 'react'
import { CursoService } from '../../../services/cursos/CursoService';
import { message, notification } from 'antd';
import moment from 'moment';
export const useFetchApi = () => {
    const [cursos, setCursos] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolder2] = notification.useNotification();
    
    const mensaje = (type="info",content='', closable = false) => {
        messageApi.open({
            type,
            content,
            duration: 5
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

    const consultaCursos = async(values = {})=>{
        try {
            setIsLoading(true);
            const response = await CursoService.getCursos(values);
            if(response.ok){
                const {data, current_page, per_page, total} = response.data
                setCursos({
                    data: mapCursos(data, current_page, per_page),
                    current_page,
                    per_page,
                    total
                });
            }
        } catch (error) {
            const msj = error?.msj ?? ['Error en el servidor'];
            mensaje("error",msj);
        }finally{
            setIsLoading(false);
        }
    }
    const storeCurso = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await CursoService.storeCurso(values);
            if(response.ok){
                mensaje("success","Registrado exitosamente");
                return { ok: true };
            }
        } catch (error) {
            const msj = error?.msj ?? null;
            if(msj !== null){
                openNotificationWithIcon("error","Error al momento de guardar",msj);
            }
            return { 
                ok: false, 
                error :{
                    formulario: error?.errors ?? {},
                    validaciones : msj
                }  
            };
        }finally{
            setIsLoading(false);
        }
    }
    const updateCurso = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await CursoService.updateCurso(values);
            if(response.ok){
                mensaje("success","Actualizado exitosamente");
                return { ok: true };
            }
        } catch (error) {
            const msj = error?.msj ?? null;
            if(msj !== null){
                openNotificationWithIcon("error","Error al momento de actualizar",msj);
            }
            return { 
                ok: false, 
                error :{
                    formulario: error?.errors ?? {},
                    validaciones : msj
                }  
            };
        }finally{
            setIsLoading(false);
        }
    }
    const deleteCurso = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await CursoService.deleteCurso(values);
            if(response.ok){
                mensaje("success","Eliminado exitosamente");
                return { ok: true };
            }
        } catch (error) {
            const msj = error?.msj ?? 'Error en el servidor';
            openNotificationWithIcon("error","Error al momento de eliminar",msj);
        }finally{
            setIsLoading(false);
        }
    }

    const mapCursos = (cursos, current_page, per_page) => {
        const startIndex = (current_page - 1) * per_page;
        return cursos.map((curso, key) => ({
            ...curso,
            key: key,
            id: curso.id,
            numero: startIndex + key + 1,
            nivel: curso?.nivel?.nombre ?? '',
            grado: curso?.grado?.grado ?? '',
            especialidad: curso?.especialidad?.nombre ?? '',
            created_at: moment(curso.created_at).format('DD/MM/YYYY'),
            usuario_creacion : curso?.user?.username ?? ''
        }));
    };

    return {
        cursos, setCursos,
        isLoading, setIsLoading,
        consultaCursos,
        storeCurso,
        updateCurso,
        deleteCurso,
        mensaje, contextHolder,
        openNotificationWithIcon, contextHolder2,
    }
}
