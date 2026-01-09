import React, { useState } from 'react'
import { AuditoriaService } from '../../../services/auditorias/AuditoriaService';
import { message, notification } from 'antd';
import moment from 'moment';
export const useFetchApi = () => {
    const [auditorias, setAuditorias] = useState({});
    const [comboModulos, setComboModulos] = useState([]);
    const [comboAcciones, setComboAcciones] = useState([]);
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

    const consultaAuditorias = async(values = {})=>{
        try {
            setIsLoading(true);
            const response = await AuditoriaService.getAuditorias(values);
            if(response.ok){
                const {data, current_page, per_page, total} = response.data
                setAuditorias({
                    data: mapAuditorias(data, current_page, per_page),
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
    const getComboModulos = async()=>{
        try {
            setIsLoading(true);
            const response = await AuditoriaService.getComboModulos();
            if(response.ok){
                const { data } = response;
                setComboModulos(data);
            }
        } catch (error) {
            const msj = error?.msj ?? ['Error en el servidor'];
            mensaje("error",msj);
        }finally{
            setIsLoading(false);
        }
    }
     const getComboAcciones = async()=>{
        try {
            setIsLoading(true);
            const response = await AuditoriaService.getComboAcciones();
            if(response.ok){
                const { data } = response;
                setComboAcciones(data);
            }
        } catch (error) {
            const msj = error?.msj ?? ['Error en el servidor'];
            mensaje("error",msj);
        }finally{
            setIsLoading(false);
        }
    }

    const mapAuditorias = (auditorias, current_page, per_page) => {
        const startIndex = (current_page - 1) * per_page;
        return auditorias.map((auditoria, key) => ({
            ...auditoria,
            key: key,
            numero: startIndex + key + 1,
            created_at: moment(auditoria.created_at).format('DD/MM/YYYY'),
            usuario_creacion : auditoria?.user?.username ?? ''
        }));
    };

    return {
        auditorias, setAuditorias,
        isLoading, setIsLoading,
        consultaAuditorias,
        comboAcciones, getComboAcciones,
        comboModulos, getComboModulos,
        mensaje, contextHolder,
        openNotificationWithIcon, contextHolder2,
    }
}
