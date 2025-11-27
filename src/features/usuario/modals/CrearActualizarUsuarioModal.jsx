import React, {useContext, useEffect, useState} from 'react'
import { Modal, Button, Row, Col, Form, Input, Select } from 'antd'
import { CloseOutlined, SaveOutlined, LockOutlined } from '@ant-design/icons';
import { UsuarioContext } from '../context/UsuarioContextProvider';
export const CrearActualizarUsuarioModal = ({
  open=false,
  toggle=()=>{},
  usuario={},
  isCreate=true,
  titulo='',
}) => {
  
  const { 
    storeUsuario, 
    updateUsuario,  
    contextHolder, contextHolder2,
    consultaUsuarios,
    isLoading,
    roles
  } = useContext(UsuarioContext);
  
  const [form] = Form.useForm();
  const [error, setError] = useState({});
  const onFinish = (values) =>{
    isCreate ? guardar(values) : actualizar(values);
  }

  const guardar = async(values)=>{
    values.rol_name = roles.find(rol => rol.value === values.id_rol).label;
    const response = await storeUsuario(values);
    if(response.ok){
      consultaUsuarios();
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
    values.rol_name = roles.find(rol => rol.value === values.id_rol).label;
    values.rol_name_base = roles.find(rol => rol.value === usuario.id_rol)?.label;
    const response = await updateUsuario(values);
    if(response.ok){
      consultaUsuarios();
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
      if (!isCreate && usuario) {
        form.setFieldsValue({ 
          id: usuario?.id, 
          id_rol: usuario.id_rol || '',
          username: usuario.username || '',
          apellidos: usuario.apellidos || '',
          nombres: usuario.nombres || '',
          email: usuario.email || '',
          
        });
      } else {
        form.resetFields();
      }
    }
  }, [usuario, isCreate, form, open]);

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
          md:'50%'
        }}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={[6, 6]}>
            <Form.Item hidden name="id">  
              <Input type="hidden" name="id"/>
            </Form.Item>
            <Col xs={12}>
              <Form.Item 
                label="UserName" 
                name="username"
                rules={[
                    {
                      required: true,
                      message: "Por favor, escriba un nombre de usuario",
                    },
                  ]}
                validateStatus={error?.username?.length ? "error" : ""}
                help={
                  error?.username?.length ? (
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {error?.username.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  ) : ""
                }
                >
                <Input size="middle" placeholder="escriba un nombre de usuario" />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item 
                label="Roles" 
                name="id_rol"
                rules={[
                    {
                      required: true,
                      message: "Por favor, seleccione un rol",
                    },
                  ]}
                validateStatus={error?.id_rol?.length ? "error" : ""}
                help={
                  error?.id_rol?.length ? (
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {error?.id_rol.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  ) : ""
                }
                >
                <Select
                  style={{ width: '100%' }}
                  showSearch
                  placeholder="Selecciona un rol"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={roles}
                />
              </Form.Item>
            </Col>
            <Col xs={12}>
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
            <Col xs={12}>
              <Form.Item 
                label="Nombres" 
                name="nombres"
                rules={[
                    {
                      required: true,
                      message: "Por favor, escriba nombre completo",
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
                <Input size="middle" placeholder="escriba nombre completo" />
              </Form.Item>
            </Col>
            <Col xs={isCreate ? 12 : 24}>
              <Form.Item 
                label="Correo Electronico" 
                name="email"
                rules={[
                    {
                      type: "email",
                      required: true,
                      message: "Por favor, escriba correo electronico",
                    },
                  ]}
                validateStatus={error?.email?.length ? "error" : ""}
                help={
                  error?.email?.length ? (
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {error?.email.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  ) : ""
                }
                >
                <Input size="middle" placeholder="escriba correo electronico" />
              </Form.Item>
            </Col>
            {isCreate &&
              <Col xs={12}>
                <Form.Item
                  label="Contraseña"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, escriba su contraseña",
                    },
                  ]}
                  validateStatus={error?.formulario?.password?.length ? "error" : ""}
                  help={
                    error?.formulario?.password?.length ? (
                      <ul style={{ margin: 0, paddingLeft: "20px" }}>
                        {error?.formulario?.password.map((err, index) => (
                          <li key={index}>{err}</li>
                        ))}
                      </ul>
                    ) : ""
                  }
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="contraseña" />
                </Form.Item>
              </Col>
            }

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
