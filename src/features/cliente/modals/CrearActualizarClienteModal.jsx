import React, {useContext, useEffect, useState } from 'react'
import { Modal, Button, Row, Col, Form, Input, Select } from 'antd'
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { ClienteContext } from '../context/ClienteContextProvider';
export const CrearActualizarClienteModal = ({
  open=false,
  toggle=()=>{},
  cliente={},
  isCreate=true,
  titulo='',
}) => {
  
  const { 
    storeCliente, 
    updateCliente,  
    contextHolder, contextHolder2,
    consultaClientes,
    isLoading,
    comboTipoClientes,
    getComboTipoClientes
  } = useContext(ClienteContext);
  
  const [form] = Form.useForm();
  const [error, setError] = useState({});
  const [tipos_clientes, setTiposClientes] = useState([]);
  const onFinish = (values) =>{
    isCreate ? guardar(values) : actualizar(values);
  }

  const guardar = async(values)=>{
    const response = await storeCliente(values);
    if(response.ok){
      consultaClientes();
      toggle();
    }else{
      if(response?.error?.validaciones !== null){
        toggle();
      }
      if(response?.error?.formulario !== null){
        setError(response.error.formulario);
      }
    }
  }
  const actualizar = async(values)=>{
    const response = await updateCliente(values);
    if(response.ok){
      consultaClientes();
      toggle();
    }else{
      if(response?.error?.validaciones !== null){
        toggle();
      }
      if(response?.error?.formulario !== null){
        setError(response.error.formulario);
      }
    }
  }

  useEffect(() => {
    if (open) { 
      setError({});
      getComboTipoClientes();
      form.resetFields();
    }
  }, [open]);
  
  useEffect(() => {
    if (open && comboTipoClientes.length > 0) {
      setTiposClientes(comboTipoClientes.filter(item => item.label != "ESTUDIANTE"));
    
      if (!isCreate && cliente && comboTipoClientes.length > 0) {
        form.setFieldsValue({ 
          id: cliente?.id, 
          id_tipo_cliente: cliente?.id_tipo_cliente,
          nombres: cliente?.nombres || '', 
          apellidos: cliente?.apellidos || '',
          numero_identificacion: cliente?.numero_identificacion || ''
        });
      } 
    }
  }, [comboTipoClientes, isCreate, form, open]);

  return (
    <>
      {contextHolder2}
      {contextHolder}
      <Modal
        title={titulo}
        centered
        footer={false}
        open={open}
        onCancel={toggle}
        width={{
          xs:'90%',
          md:'35%'
        }}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={[4, 4]}>
            <Form.Item hidden name="id">  
              <Input type="hidden" name="id"/>
            </Form.Item>

            <Col xs={24} md={12}>
              <Form.Item 
                label="Tipo Cliente" 
                name="id_tipo_cliente"
                rules={[
                    {
                      required: true,
                      message: "Por favor, seleccion un tipo cliente",
                    },
                  ]}
                validateStatus={error?.id_tipo_cliente?.length ? "error" : ""}
                help={
                  error?.id_tipo_cliente?.length ? (
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {error?.id_tipo_cliente.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  ) : ""
                }
                >
                <Select
                  style={{ width: '100%' }}
                  showSearch
                  placeholder="Selecciona un tipo cliente"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={tipos_clientes}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item 
                label="Número de identificación" 
                name="numero_identificacion"
                rules={[
                    {
                      required: true,
                      message: "Por favor, escriba el número de identificación",
                    },
                  ]}
                validateStatus={error?.numero_identificacion?.length ? "error" : ""}
                help={
                  error?.numero_identificacion?.length ? (
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {error?.numero_identificacion.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  ) : ""
                }
                >
                <Input size="middle" placeholder="escriba el numero de identificación" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item 
                label="Nombres" 
                name="nombres"
                rules={[
                    {
                      required: true,
                      message: "Por favor, escriba los nombres",
                    },
                  ]}
                validateStatus={error?.nombres?.length ? "error" : ""}
                help={
                  error?.nombres?.length ? (
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {error?.nombres.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  ) : ""
                }
                >
                <Input size="middle" placeholder="escriba los nombres" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item 
                label="Apellidos" 
                name="apellidos"
                rules={[
                    {
                      required: true,
                      message: "Por favor, escriba los apellidos",
                    },
                  ]}
                validateStatus={error?.apellidos?.length ? "error" : ""}
                help={
                  error?.apellidos?.length ? (
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {error?.apellidos.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  ) : ""
                }
                >
                <Input size="middle" placeholder="escriba los apellidos" />
              </Form.Item>
            </Col>

            <Col xs={24} style={{ textAlign: "end"}}>
              <Button 
                ghost
                size='middle'
                className={'btn-nuevo'}
                style={{marginRight:6}} 
                onClick={toggle} 
                type="primary"
                icon={<CloseOutlined />}>
                  Cancelar
              </Button>
              <Button 
                disabled={isLoading}
                size='middle'
                className='btn-buscar'
                style={{marginRight:6}} 
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}>
                  {isCreate ? 'Guardar' : 'Actualizar'}
              </Button>
              
            </Col>
          </Row>
        </Form>

      </Modal>
    </>
  )
}
