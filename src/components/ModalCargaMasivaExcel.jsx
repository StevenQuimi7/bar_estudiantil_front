import React, { useState } from 'react';
import { Modal, Upload, Button, Card, Col, Row, message } from 'antd';
import { InboxOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';

export const ModalCargaMasivaExcel = ({ 
    open = false, 
    toggle = () => {}, 
    onSave = () => {}, 
    titulo = "Carga Masiva de Datos"
}) => {

    const { Dragger } = Upload;

    const [fileList, setFileList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Configuración del Dragger
    const propsDragger = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".xlsx, .xls",
        fileList,
        onChange(info) {
            const { status } = info.file;
            setFileList(info.fileList);

            if (status === 'done') {
                message.success(`${info.file.name} cargado correctamente.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} falló al subir.`);
            }
        },
        onRemove() {
            setFileList([]);
        },
        beforeUpload: (file) => {
            return false; 
        },
    };

    const handleGuardar = async () => {
        if (fileList.length === 0) return;

        setIsLoading(true);
        try {
            // Pasamos el archivo o la lista de archivos a la función onSave
            let formData = new FormData();
            // Extraemos el archivo real que está dentro de la variable de estado
            // Ant Design guarda el archivo binario en 'originFileObj'
            const fileRaw = fileList[0].originFileObj;
            formData.append('file', fileRaw);
            const result = await onSave(formData);
            if(result){
                setFileList([]);
                toggle();
            }  
            
        } catch (error) {
            console.error("Error => ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const isButtonDisabled = isLoading || fileList.length === 0 || fileList.some(f => f.status === 'error');

    return (
        <Modal
            title={titulo}
            open={open}
            onCancel={toggle}
            footer={false}
            width={600}
        >
            <Card>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Dragger {...propsDragger}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click o arrastra el archivo Excel a esta área</p>
                            <p className="ant-upload-hint">
                                Solo se permite un archivo .xlsx o .xls. Los datos deben seguir el formato establecido.
                            </p>
                        </Dragger>
                    </Col>

                    <Col xs={24} style={{ textAlign: "end", marginTop: 20 }}>
                        <Button 
                            ghost
                            size='middle'
                            className={'btn-nuevo'}
                            style={{ marginRight: 6 }} 
                            onClick={toggle} 
                            type="primary"
                            icon={<CloseOutlined />}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            disabled={isButtonDisabled}
                            loading={isLoading}
                            size='middle'
                            className='btn-buscar'
                            type="primary"
                            onClick={handleGuardar}
                            icon={<SaveOutlined />}
                        >
                            Guardar
                        </Button>
                    </Col>
                </Row>
            </Card>
        </Modal>
    );
};