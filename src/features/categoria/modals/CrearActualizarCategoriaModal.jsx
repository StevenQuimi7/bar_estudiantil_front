import React, {useEffect, useState} from 'react'
import { Modal, Button, Row, Col, Form, Input } from 'antd'
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { useFetchApi } from '../hooks/useFetchApi';
export const CrearActualizarCategoriaModal = ({
  open=false,
  toggle=()=>{},
  categoria={},
  isCreate=true,
  titulo='',
  consultaCategorias=()=>{}
}) => {
  
  const { 
    storeCategoria, 
    updateCategoria,  
    contextHolder, contextHolder2,
    isLoading
  } = useFetchApi();
  
  const [form] = Form.useForm();
  const [error, setError] = useState({});
  const onFinish = (values) =>{
    isCreate ? guardar(values) : actualizar(values);
  }

  const guardar = async(values)=>{
    const response = await storeCategoria(values);
    if(response.ok){
      consultaCategorias();
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
    const response = await updateCategoria(values);
    if(response.ok){
      consultaCategorias();
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
      setError({})
      if (!isCreate && categoria) {
        form.setFieldsValue({ id: categoria?.id, nombre: categoria.nombre || '' });
      } else {
        form.resetFields();
      }
    }
  }, [categoria, isCreate, form, open]);

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
          md:'30%'
          // xs: '90%',
          // sm: '80%',
          // md: '70%',
          // lg: '60%',
          // xl: '50%',
          // xxl: '40%',
        }}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={[2, 2]}>
            <Form.Item hidden name="id">  
              <Input type="hidden" name="id"/>
            </Form.Item>
            <Col xs={24}>
              <Form.Item 
                label="Nombre" 
                name="nombre"
                rules={[
                    {
                      required: true,
                      message: "Por favor, escriba un nombre de categoria",
                    },
                  ]}
                validateStatus={error?.nombre?.length ? "error" : ""}
                help={
                  error?.nombre?.length ? (
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {error?.nombre.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  ) : ""
                }
                >
                <Input size="middle" placeholder="escriba una categoria" />
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
