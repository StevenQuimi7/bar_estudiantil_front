import React, { useState } from 'react'
import { GradoService } from '../../../services/grados/GradoService';
import { message, notification } from 'antd';
import moment from 'moment';
export const useFetchApi = () => {
    const [grados, setGrados] = useState({});
    const [comboGrados, setComboGrados] = useState([]);
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

    const consultaGrados = async(values = {})=>{
        try {
            setIsLoading(true);
            const response = await GradoService.getGrados(values);
            if(response.ok){
                const {data, current_page, per_page, total} = response.data
                setGrados({
                    data: mapGrados(data, current_page, per_page),
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
    const getComboGrados = async()=>{
        try {
            setIsLoading(true);
            const response = await GradoService.getComboGrados();
            if(response.ok){
                const {data} = response
                setComboGrados(data);
            }
        } catch (error) {
            const msj = error?.msj ?? ['Error en el servidor'];
            mensaje("error",msj);
        }finally{
            setIsLoading(false);
        }
    }
    const storeGrado = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await GradoService.storeGrado(values);
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
    const updateGrado = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await GradoService.updateGrado(values);
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
    const deleteGrado = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await GradoService.deleteGrado(values);
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

    const mapGrados = (grados, current_page, per_page) => {
        const startIndex = (current_page - 1) * per_page;
        return grados.map((grado, key) => ({
            ...grado,
            key: key,
            id: grado.id,
            numero: startIndex + key + 1,
            created_at: moment(grado.created_at).format('DD/MM/YYYY'),
            usuario_creacion : grado?.user?.username,
        }));
    };

    return {
        grados, setGrados,
        isLoading, setIsLoading,
        consultaGrados,
        storeGrado,
        updateGrado,
        deleteGrado,
        mensaje, contextHolder,
        openNotificationWithIcon, contextHolder2,
        comboGrados, getComboGrados
    }
}
