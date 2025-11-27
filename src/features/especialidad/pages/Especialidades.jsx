import React, { useState, useEffect, useContext } from 'react'
import { EspecialidadContext } from '../context/EspecialidadContextProvider'
import { BreadCrumbComponent } from '../../../components/BreadCrumbComponent';
import { HomeOutlined, SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { Card, Button, Form, Input, Row, Col, Space, Collapse, Tooltip } from 'antd';
import { EspecialidadTable } from '../components/EspecialidadTable';
export const Especialidades = () => {
  const { consultaEspecialidades, contextHolder} = useContext(EspecialidadContext);
  const [form] = Form.useForm();
  const [filtros, setFiltros] = useState({});
  
  const ITEMS = [
    { path: '', title: <HomeOutlined /> },
    { path: 'especialidades', title: 'Especialidades' }
  ];

  const onFinish = (values) => {
    const filtros = values.nombre ? values : {}
    setFiltros(filtros);
    consultaEspecialidades(filtros);
  };

  useEffect(() => {
    consultaEspecialidades();
  },[])
  return (
    <>
      {contextHolder}
      <BreadCrumbComponent
        titulo='Mantenimiento'
        modulo='Módulo de Especialidades'
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
                          <Input size="middle" placeholder="escriba una especialidad" />
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
          
          <EspecialidadTable
            filtros={filtros}
          />
        </Card>

      </Space>


    </>
  )
}
