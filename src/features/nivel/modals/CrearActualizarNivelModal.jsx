import React, {useContext, useEffect, useState} from 'react'
import { Modal, Button, Row, Col, Form, Input } from 'antd'
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { NivelContext } from '../context/NivelContextProvider';
export const CrearActualizarNivelModal = ({
  open=false,
  toggle=()=>{},
  nivel={},
  isCreate=true,
  titulo='',
}) => {
  
  const { 
    storeNivel, 
    updateNivel,  
    contextHolder, contextHolder2,
    consultaNiveles,
    isLoading
  } = useContext(NivelContext);
  
  const [form] = Form.useForm();
  const [error, setError] = useState({});
  const onFinish = (values) =>{
    isCreate ? guardar(values) : actualizar(values);
  }

  const guardar = async(values)=>{
    const response = await storeNivel(values);
    if(response.ok){
      consultaNiveles();
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
    const response = await updateNivel(values);
    if(response.ok){
      consultaNiveles();
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
      if (!isCreate && nivel) {
        form.setFieldsValue({ id: nivel?.id, nombre: nivel.nombre || '' });
      } else {
        form.resetFields();
      }
    }
  }, [nivel, isCreate, form, open]);

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
                      message: "Por favor, escriba un nombre de nivel",
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
                <Input size="middle" placeholder="escriba una nivel" />
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
