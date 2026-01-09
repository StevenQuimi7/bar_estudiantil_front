import React, { useState } from 'react'
import { DashboardService } from '../../../services/dashboards/DashboardService';
import { message, notification } from 'antd';
import moment from 'moment';
export const useFetchApi = () => {
    const [ventasMeses, setVentasMeses] = useState([]);
    const [topFive, setTopFive] = useState({});
    const [comparativaAnios, setComparativaAnios] = useState([]);
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

    const consultaTopFive = async(values = {})=>{
        try {
            setIsLoading(true);
            const response = await DashboardService.consultaTopFive(values);
            if(response.ok){
                const { clientes, usuarios, productos } = response.data
                setTopFive({clientes, usuarios, productos});
            }
        } catch (error) {
            const msj = error?.msj ?? ['Error en el servidor'];
            mensaje("error",msj);
        }finally{
            setIsLoading(false);
        }
    }
    const consultaVentasMeses = async(values = {})=>{
        try {
            setIsLoading(true);
            const response = await DashboardService.consultaVentasMeses(values);
            if(response.ok){
                const {data} = response
                setVentasMeses(data);
            }
        } catch (error) {
            const msj = error?.msj ?? ['Error en el servidor'];
            mensaje("error",msj);
        }finally{
            setIsLoading(false);
        }
    }

    const consultaComparativaAnios = async(values = {})=>{
        try {
            setIsLoading(true);
            const response = await DashboardService.consultaComparativaAnios(values);
            if(response.ok){
                const {data} = response
                setComparativaAnios(data);
            }
        } catch (error) {
            const msj = error?.msj ?? ['Error en el servidor'];
            mensaje("error",msj);
        }finally{
            setIsLoading(false);
        }
    }

    return {
        topFive, comparativaAnios, ventasMeses,
        isLoading, setIsLoading,
        consultaComparativaAnios,
        consultaTopFive,
        consultaVentasMeses,
        mensaje, contextHolder,
        openNotificationWithIcon, contextHolder2
    }
}
