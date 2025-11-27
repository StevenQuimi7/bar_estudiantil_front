import React, { useState } from 'react'
import { RolePermisoService } from '../../../services/roles_permisos/RolePermisoService';
import { message, notification } from 'antd';
import moment from 'moment';
export const useFetchApi = () => {
    const [roles_permisos, setRolesPermisos] = useState({});
    const [permisos, setPermisos] = useState([]);
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

    const consultaRoles = async(values = {})=>{
        try {
            setIsLoading(true);
            const response = await RolePermisoService.getRoles(values);
            if(response.ok){
                const {data, current_page, per_page, total} = response.data
                setRolesPermisos({
                    data: mapRolesPermisos(data, current_page, per_page),
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
    const consultaPermisos = async()=>{
        try {
            setIsLoading(true);
            const response = await RolePermisoService.getPermisos();
            if(response.ok){
                const {data} = response
                setPermisos(data);
            }
        } catch (error) {
            const msj = error?.msj ?? ['Error en el servidor'];
            mensaje("error",msj);
        }finally{
            setIsLoading(false);
        }
    }
    const storeRolePermiso = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await RolePermisoService.storeRolePermiso(values);
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
    const updateRolePermiso = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await RolePermisoService.updateRolePermiso(values);
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
    const deleteRolePermiso = async(values = null)=>{
        try {
            setIsLoading(true);
            const response = await RolePermisoService.deleteRolePermiso(values);
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

    const mapRolesPermisos = (roles_permisos, current_page, per_page) => {
        const startIndex = (current_page - 1) * per_page;
        return roles_permisos.map((role_permiso, key) => ({
            ...role_permiso,
            key: key,
            id: role_permiso.id,
            numero: startIndex + key + 1,
            created_at: moment(role_permiso.created_at).format('DD/MM/YYYY')
        }));
    };

    return {
        roles_permisos, setRolesPermisos,
        isLoading, setIsLoading,
        consultaRoles,
        storeRolePermiso,
        updateRolePermiso,
        deleteRolePermiso,
        mensaje, contextHolder,
        openNotificationWithIcon, contextHolder2,
        consultaPermisos, permisos
    }
}
