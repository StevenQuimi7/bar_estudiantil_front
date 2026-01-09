import React, { useState, useEffect, useContext, useCallback } from 'react'
import { AuditoriaContext } from '../context/AuditoriaContextProvider'
import { BreadCrumbComponent } from '../../../components/BreadCrumbComponent';
import { HomeOutlined, SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { Card, Button, Form, Select, Row, Col, Space, Collapse, Tooltip } from 'antd';
import { AuditoriaTable } from '../components/AuditoriaTable';
export const Auditorias = () => {
  const { 
    consultaAuditorias, contextHolder,
    getComboModulos, getComboAcciones,
    comboModulos, comboAcciones
  } = useContext(AuditoriaContext);
  const [form] = Form.useForm();
  const [filtros, setFiltros] = useState({});
  
  const ITEMS = [
    { path: '', title: <HomeOutlined /> },
    { path: 'auditorias', title: 'Auditorias' }
  ];

  const onFinish = (values) => {
    const filtros = Object.entries(values).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    setFiltros(filtros);
    consultaAuditorias(filtros);
  };


  const fetchData = useCallback(async () => {
    try {
      await Promise.all([
        consultaAuditorias(),
        getComboModulos(),
        getComboAcciones(),
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
        titulo='Auditoria'
        modulo='Módulo de Auditorias'
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
                        <Form.Item label="Módulos" name="modulo">

                          <Select
                            style={{ width: '100%' }}
                            showSearch
                            placeholder="Selecciona un módulo"
                            filterOption={(input, option) =>
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={comboModulos}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={4}>
                        <Form.Item label="Acciones" name="accion">

                          <Select
                            style={{ width: '100%' }}
                            showSearch
                            placeholder="Selecciona una acción"
                            filterOption={(input, option) =>
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={comboAcciones}
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
          
          <AuditoriaTable
            filtros={filtros}
          />
        </Card>

      </Space>


    </>
  )
}
