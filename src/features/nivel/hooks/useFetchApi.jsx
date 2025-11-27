import React, { useState } from 'react'
import { NivelService } from '../../../services/niveles/NivelService';
import { message, notification } from 'antd';
import moment from 'moment';
export const useFetchApi = () => {
    const [niveles, setNiveles] = useState({});
    const [comboNiveles, setComboNiveles] = useState([]);
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

    const consultaNiveles = async(values = {})=>{
        try {
            setIsLoading(true);
            const response = await NivelService.getNiveles(values);
            if(response.ok){
                const {data, current_page, per_page, total} = response.data
                setNiveles({
                    data: mapNiveles(data, current_page, per_page),
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
    const getComboNiveles = async()=>{
        try {
            setIsLoading(true);
            const response = await NivelService.getComboNiveles();
            if(response.ok){
                const {data} = response
                setComboNiveles(data);
            }
        } catch (error) {
            const msj = error?.msj ?? ['Error en el servidor'];
            mensaje("error",msj);
        }finally{
            setIsLoading(false);
        }
    }
    const storeNivel = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await NivelService.storeNivel(values);
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
    const updateNivel = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await NivelService.updateNivel(values);
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
    const deleteNivel = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await NivelService.deleteNivel(values);
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

    const mapNiveles = (niveles, current_page, per_page) => {
        const startIndex = (current_page - 1) * per_page;
        return niveles.map((nivel, key) => ({
            ...nivel,
            key: key,
            id: nivel.id,
            numero: startIndex + key + 1,
            created_at: moment(nivel.created_at).format('DD/MM/YYYY'),
            usuario_creacion : nivel?.user?.username,
        }));
    };

    return {
        niveles, setNiveles,
        isLoading, setIsLoading,
        consultaNiveles,
        storeNivel,
        updateNivel,
        deleteNivel,
        mensaje, contextHolder,
        openNotificationWithIcon, contextHolder2,
        getComboNiveles, comboNiveles
    }
}
