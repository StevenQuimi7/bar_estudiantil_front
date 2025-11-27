import React, { useState } from 'react'
import { CategoriaService } from '../../../services/categorias/CategoriaService';
import { message, notification } from 'antd';
import moment from 'moment';
export const useFetchApi = () => {
    const [categorias, setCategorias] = useState({});
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

    const consultaCategorias = async(values = {})=>{
        try {
            setIsLoading(true);
            const response = await CategoriaService.getCategorias(values);
            if(response.ok){
                const {data, current_page, per_page, total} = response.data
                setCategorias({
                    data: mapCategorias(data, current_page, per_page),
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
    const storeCategoria = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await CategoriaService.storeCategoria(values);
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
    const updateCategoria = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await CategoriaService.updateCategoria(values);
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
    const deleteCategoria = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await CategoriaService.deleteCategoria(values);
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

    const mapCategorias = (categorias, current_page, per_page) => {
        const startIndex = (current_page - 1) * per_page;
        return categorias.map((categoria, key) => ({
            ...categoria,
            key: key,
            id: categoria.id,
            numero: startIndex + key + 1,
            created_at: moment(categoria.created_at).format('DD/MM/YYYY'),
            usuario_creacion : categoria?.user?.username,
        }));
    };

    return {
        categorias, setCategorias,
        isLoading, setIsLoading,
        consultaCategorias,
        storeCategoria,
        updateCategoria,
        deleteCategoria,
        mensaje, contextHolder,
        openNotificationWithIcon, contextHolder2,
    }
}
