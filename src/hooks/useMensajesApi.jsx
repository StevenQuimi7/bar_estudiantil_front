import React from 'react'
import { message } from 'antd';
export const useMensajesApi = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const mensaje = (type="info",content='') => {
        messageApi.open({
        type: type,
        content: content,
        });
    };
    return { mensaje, contextHolder };
}
