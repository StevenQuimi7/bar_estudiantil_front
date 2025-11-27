import React, { useState, useEffect, useContext, useCallback } from 'react'
import { RolePermisoContext } from '../context/RolePermisoContextProvider'
import { BreadCrumbComponent } from '../../../components/BreadCrumbComponent';
import { HomeOutlined, SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { Card, Button, Form, Input, Row, Col, Space, Collapse, Tooltip } from 'antd';
import { RolePermisoTable } from '../components/RolePermisoTable';
export const RolesPermisos = () => {
  const { consultaRoles,consultaPermisos, contextHolder} = useContext(RolePermisoContext);
  const [form] = Form.useForm();
  const [filtros, setFiltros] = useState({});
  
  const ITEMS = [
    { path: '', title: <HomeOutlined /> },
    { path: 'roles_permisos', title: 'Roles y Permisos' }
  ];

  const onFinish = (values) => {
    const filtros = values.name ? values : {}
    setFiltros(filtros);
    consultaRoles(filtros);
  };

  const fetchData = useCallback(async () => {
    try {
      await Promise.all([
        consultaRoles(),
        consultaPermisos(),
      ]);
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  },[fetchData])
  return (
    <>
      {contextHolder}
      <BreadCrumbComponent
        titulo='Mantenimiento'
        modulo='Módulo de Roles y Permisos'
        items={ITEMS}
      />
      <Space style={{width:"100%"}} direction="vertical" size={"small"}>
        {/* filtros */}
        <Card className='card-filtros'>
          <Collapse
            defaultActiveKey={['1']}
            size='small'
            ghost
            items={[
              {
                key: '1',
                label: 'Filtros de búsqueda',
                children: (
                  <Form layout="vertical" form={form} onFinish={onFinish}>
                    <Row gutter={[2, 2]}>
                      <Col xs={24} md={6}>
                        <Form.Item label="Nombre" name="name">
                          <Input size="middle" placeholder="escriba un rol" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} style={{ textAlign: "end"}}>
                        <Tooltip title="Buscar">
                          <Button 
                            className='btn-buscar'
                            style={{marginRight:6}} 
                            shape="circle" 
                            type="primary"
                            htmlType="submit" 
                            icon={<SearchOutlined />}/>
                        </Tooltip>
                        <Tooltip title="Limpiar">
                          <Button 
                            className='btn-limpiar'
                            shape="circle" 
                            onClick={() => form.resetFields()}
                            icon={<ClearOutlined />}/>
                        </Tooltip>
                      </Col>
                    </Row>
                  </Form>
                ),
              },
            ]}
          />

        </Card>

        {/* componente tabla */}
        <Card  className='card-tablas'>
          
          <RolePermisoTable
            filtros={filtros}
          />
        </Card>

      </Space>


    </>
  )
}
