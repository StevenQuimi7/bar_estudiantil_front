import React, { useState, useEffect, useContext, useCallback } from 'react'
import { CursoContext } from '../context/CursoContextProvider'
import { BreadCrumbComponent } from '../../../components/BreadCrumbComponent';
import { HomeOutlined, SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { Card, Button, Form, Select, Row, Col, Space, Collapse, Tooltip } from 'antd';
import { CursoTable } from '../components/CursoTable';
export const Cursos = () => {
  const { 
    consultaCursos, contextHolder,
    getComboNiveles, comboNiveles,
    getComboGrados, comboGrados,
    getComboEspecialidades
  } = useContext(CursoContext);
  const [form] = Form.useForm();
  const [filtros, setFiltros] = useState({});
  
  const ITEMS = [
    { path: '', title: <HomeOutlined /> },
    { path: 'cursos', title: 'Cursos' }
  ];

  const onFinish = (values) => {
    const filtros = Object.entries(values).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    setFiltros(filtros);
    consultaCursos(filtros);
  };


  const fetchData = useCallback(async () => {
    try {
      await Promise.all([
        consultaCursos(),
        getComboNiveles(),
        getComboGrados(),
        getComboEspecialidades()
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
        modulo='Módulo de Cursos'
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
                        <Form.Item label="Niveles" name="id_nivel">

                          <Select
                            style={{ width: '100%' }}
                            showSearch
                            placeholder="Selecciona un nivel"
                            filterOption={(input, option) =>
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={comboNiveles}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={4}>
                        <Form.Item label="Grados" name="id_grado">

                          <Select
                            style={{ width: '100%' }}
                            showSearch
                            placeholder="Selecciona un grado"
                            filterOption={(input, option) =>
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={comboGrados}
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
          
          <CursoTable
            filtros={filtros}
          />
        </Card>

      </Space>


    </>
  )
}
