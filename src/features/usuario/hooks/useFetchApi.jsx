import React, { useState } from 'react'
import { UsuarioService } from '../../../services/usuarios/UsuarioService';
import { message, notification } from 'antd';
import moment from 'moment';
export const useFetchApi = () => {
    const [usuarios, setUsuarios] = useState({});
    const [miPerfil, setMiPerfil] = useState({});
    const [roles, setRoles] = useState([]);
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

    const consultaUsuarios = async(values = {})=>{
        try {
            setIsLoading(true);
            const response = await UsuarioService.getUsuarios(values);
            if(response.ok){
                const {data, current_page, per_page, total} = response.data
                setUsuarios({
                    data: mapUsuarios(data, current_page, per_page),
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
    const consultaRoles = async()=>{
        try {
            setIsLoading(true);
            const response = await UsuarioService.getRoles();
            if(response.ok){
                const {data} = response
                setRoles(data);
            }
        } catch (error) {
            const msj = error?.msj ?? ['Error en el servidor'];
            mensaje("error",msj);
        }finally{
            setIsLoading(false);
        }
    }
    const storeUsuario = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await UsuarioService.storeUsuario(values);
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
    const updateUsuario = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await UsuarioService.updateUsuario(values);
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
    const deleteUsuario = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await UsuarioService.deleteUsuario(values);
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
    const restoreUsuario = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await UsuarioService.restoreUsuario(values);
            if(response.ok){
                mensaje("success","Restablecido exitosamente");
                return { ok: true };
            }
        } catch (error) {
            const msj = error?.msj ?? 'Error en el servidor';
            openNotificationWithIcon("error","Error al momento de eliminar",msj);
        }finally{
            setIsLoading(false);
        }
    }

    const mapUsuarios = (usuarios, current_page, per_page) => {
        const startIndex = (current_page - 1) * per_page;
        return usuarios.map((usuario, key) => ({
            ...usuario,
            key: key,
            id: usuario.id,
            numero: startIndex + key + 1,
            created_at: moment(usuario.created_at).format('DD/MM/YYYY'),
            rol : usuario?.roles[0]?.name,
            id_rol : usuario?.roles[0]?.id
        }));
    };

    const consultaMiPerfil = async(values = {})=>{
        try {
            setIsLoading(true);
            const response = await UsuarioService.getUsuario(values);
            if(response.ok){
                const { data } = response
                setMiPerfil(data);
            }
        } catch (error) {
            const msj = error?.msj ?? ['Error en el servidor'];
            mensaje("error",msj);
        }finally{
            setIsLoading(false);
        }
    }

    return {
        usuarios, setUsuarios,
        isLoading, setIsLoading,
        consultaUsuarios,
        storeUsuario,
        updateUsuario,
        deleteUsuario,
        restoreUsuario,
        consultaMiPerfil,
        miPerfil,
        mensaje, contextHolder,
        openNotificationWithIcon, contextHolder2,
        consultaRoles, roles
    }
}
