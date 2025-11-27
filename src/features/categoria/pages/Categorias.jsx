import React, { useEffect, useState } from 'react';
import { BreadCrumbComponent } from '../../../components/BreadCrumbComponent';
import { HomeOutlined, SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { Card, Button, Form, Input, Row, Col, Space, Collapse, Tooltip } from 'antd';
import { CategoriaTable } from '../components/CategoriaTable';
import { useFetchApi } from '../hooks/useFetchApi';

export const Categorias = () => {
  const [form] = Form.useForm();
  const { categorias, consultaCategorias, contextHolder, isLoading} = useFetchApi();
  const [filtros, setFiltros] = useState({});
  
  const ITEMS = [
    { path: '', title: <HomeOutlined /> },
    { path: 'categorias', title: 'Categorías' }
  ];

  const onFinish = (values) => {
    const filtros = values.nombre ?values : {}
    setFiltros(filtros);
    consultaCategorias(filtros);
  };

  useEffect(() => {
    consultaCategorias();
  },[])

  return (
    <>
      {contextHolder}
      <BreadCrumbComponent
        titulo='Mantenimiento'
        modulo='Módulo de Categorías'
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
                        <Form.Item label="Nombre" name="nombre">
                          <Input size="middle" placeholder="escriba una categoría" />
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
          
          <CategoriaTable
            categorias={categorias}
            isLoading={isLoading}
            consultaCategorias={consultaCategorias}
            filtros={filtros}
          />
        </Card>

      </Space>


    </>
  );
};
