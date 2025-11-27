import React, { useState, useEffect, useContext, useCallback } from 'react'
import { UsuarioContext } from '../context/UsuarioContextProvider'
import { BreadCrumbComponent } from '../../../components/BreadCrumbComponent';
import { HomeOutlined, SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { Card, Button, Form, Input, Row, Col, Space, Collapse, Tooltip, Select } from 'antd';
import { UsuarioTable } from '../components/UsuarioTable';
export const Usuarios = () => {
  const { consultaUsuarios, contextHolder, consultaRoles} = useContext(UsuarioContext);
  const [form] = Form.useForm();
  const [filtros, setFiltros] = useState({});
  const estados = [
    { value: 1, label: 'Activo' },
    { value: 0, label: 'Inactivo' },
  ];
  
  const ITEMS = [
    { path: '', title: <HomeOutlined /> },
    { path: 'usuarios', title: 'Usuarios' }
  ];

  const onFinish = (values) => {
    const filtros = Object.entries(values).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    setFiltros(filtros);
    consultaUsuarios(filtros);
  };

  const fetchData = useCallback(async () => {
    try {
      await Promise.all([
        consultaUsuarios(),
        consultaRoles(),
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
        modulo='Módulo de Usuarios'
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
                    <Row gutter={[6, 6]}>
                      <Col xs={24} md={4}>
                        <Form.Item label="Nombre" name="username">
                          <Input size="middle" placeholder="escriba un usuario" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={4}>
                        <Form.Item label="Estado" name="estado">

                          <Select
                            style={{ width: '100%' }}
                            showSearch
                            placeholder="Selecciona un estado"
                            filterOption={(input, option) =>
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={estados}
                          />
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
          
          <UsuarioTable
            filtros={filtros}
          />
        </Card>

      </Space>


    </>
  )
}
