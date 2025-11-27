import React, {useContext, useEffect, useState} from 'react'
import { Modal, Button, Row, Col, Form, Input, Transfer } from 'antd'
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { RolePermisoContext } from '../context/RolePermisoContextProvider';
export const CrearActualizarRolePermisoModal = ({
  open=false,
  toggle=()=>{},
  role_permiso={},
  isCreate=true,
  titulo='',
}) => {
  
  const { 
    storeRolePermiso, 
    updateRolePermiso,  
    contextHolder, contextHolder2,
    consultaRoles,
    isLoading,
    permisos
  } = useContext(RolePermisoContext);
  
  const [form] = Form.useForm();
  const [error, setError] = useState({});
  const [permisosData, setPermisosData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);

  const onFinish = (values) =>{
    isCreate ? guardar(values) : actualizar(values);
  }

  const guardar = async(values)=>{
    values.selectedPermisos = targetKeys;
    const response = await storeRolePermiso(values);
    if(response.ok){
      consultaRoles();
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
    values.selectedPermisos = targetKeys;
    values.selectedPermisosBase = role_permiso.permissions.map((permiso) => permiso.id);
    const response = await updateRolePermiso(values);
    if(response.ok){
      consultaRoles();
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

  const mapListadoPermisos = () => {
    return permisos.map((permiso) => {
      return {
        key: permiso.id,
        title: permiso.description,
        description: permiso.description,
      };
    });
  };
  const filtrarPermisos = (inputValue, option) => option.title.indexOf(inputValue) > -1;
  const seleccionaItems = newTargetKeys => {
    setTargetKeys(newTargetKeys);
  };

  useEffect(() => {
    if (open) { 
      setError({})
      setTargetKeys([]);
      if (!isCreate && role_permiso) {
        form.setFieldsValue({ id: role_permiso?.id, name: role_permiso.name || '' });
        setTargetKeys(role_permiso.permissions.map((permiso) => permiso.id));
      } else {
        form.resetFields();
        
      }
      setPermisosData(mapListadoPermisos());
    }
  }, [role_permiso, isCreate, form, open]);

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
          md:'60%'
        }}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={[6, 6]}>
            <Form.Item hidden name="id">  
              <Input type="hidden" name="id"/>
            </Form.Item>
            <Col xs={24}>
              <Form.Item 
                label="Nombre" 
                name="name"
                rules={[
                    {
                      required: true,
                      message: "Por favor, escriba un nombre de rol",
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
                <Input size="middle" placeholder="escriba un nombre de rol" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <div style={{
                overflowX:window.innerWidth < 768 ? 'auto' : 'none',
                width:'100%'
                }}>

                <Transfer
                  listStyle={{ width: '50%', height: '350px' }}
                  dataSource={permisosData}
                  showSearch
                  filterOption={filtrarPermisos}
                  targetKeys={targetKeys}
                  onChange={seleccionaItems}
                  render={item => item.title}
                />
              </div>

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
