import React, { useState } from 'react'
import { EspecialidadService } from '../../../services/especialidades/EspecialidadService';
import { message, notification } from 'antd';
import moment from 'moment';
export const useFetchApi = () => {
    const [especialidades, setEspecialidades] = useState({});
    const [comboEspecialidades, setComboEspecialidades] = useState([]);
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

    const consultaEspecialidades = async(values = {})=>{
        try {
            setIsLoading(true);
            const response = await EspecialidadService.getEspecialidades(values);
            if(response.ok){
                const {data, current_page, per_page, total} = response.data
                setEspecialidades({
                    data: mapEspecialidades(data, current_page, per_page),
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
    const getComboEspecialidades = async()=>{
        try {
            setIsLoading(true);
            const response = await EspecialidadService.getComboEspecialidades();
            if(response.ok){
                const {data} = response
                setComboEspecialidades(data);
            }
        } catch (error) {
            const msj = error?.msj ?? ['Error en el servidor'];
            mensaje("error",msj);
        }finally{
            setIsLoading(false);
        }
    }
    const storeEspecialidad = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await EspecialidadService.storeEspecialidad(values);
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
    const updateEspecialidad = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await EspecialidadService.updateEspecialidad(values);
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
    const deleteEspecialidad = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await EspecialidadService.deleteEspecialidad(values);
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

    const mapEspecialidades = (especialidades, current_page, per_page) => {
        const startIndex = (current_page - 1) * per_page;
        return especialidades.map((especialidad, key) => ({
            ...especialidad,
            key: key,
            id: especialidad.id,
            numero: startIndex + key + 1,
            created_at: moment(especialidad.created_at).format('DD/MM/YYYY'),
            usuario_creacion : especialidad?.user?.username,
        }));
    };

    return {
        especialidades, setEspecialidades,
        isLoading, setIsLoading,
        consultaEspecialidades,
        storeEspecialidad,
        updateEspecialidad,
        deleteEspecialidad,
        mensaje, contextHolder,
        openNotificationWithIcon, contextHolder2,
        getComboEspecialidades, comboEspecialidades
    }
}
