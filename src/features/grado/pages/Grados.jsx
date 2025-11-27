import React, { useState, useEffect, useContext } from 'react'
import { GradoContext } from '../context/GradoContextProvider'
import { BreadCrumbComponent } from '../../../components/BreadCrumbComponent';
import { HomeOutlined, SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { Card, Button, Form, Input, Row, Col, Space, Collapse, Tooltip } from 'antd';
import { GradoTable } from '../components/GradoTable';
export const Grados = () => {
  const { consultaGrados, contextHolder} = useContext(GradoContext);
  const [form] = Form.useForm();
  const [filtros, setFiltros] = useState({});
  
  const ITEMS = [
    { path: '', title: <HomeOutlined /> },
    { path: 'grados', title: 'Grados' }
  ];

  const onFinish = (values) => {
    const filtros = values.grado ? values : {}
    setFiltros(filtros);
    consultaGrados(filtros);
  };

  useEffect(() => {
    consultaGrados();
  },[])
  return (
    <>
      {contextHolder}
      <BreadCrumbComponent
        titulo='Mantenimiento'
        modulo='Módulo de Grados'
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
                        <Form.Item label="Grado" name="grado">
                          <Input size="middle" placeholder="escriba un grado" />
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
          
          <GradoTable
            filtros={filtros}
          />
        </Card>

      </Space>


    </>
  )
}
