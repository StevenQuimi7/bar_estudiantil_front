import React, { useState, useEffect, useContext } from 'react'
import { ControlVentaContext } from '../context/ControlVentaContextProvider'
import { BreadCrumbComponent } from '../../../../components/BreadCrumbComponent';
import { HomeOutlined, SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { Card, Button, Form, Input, Row, Col, Space, Collapse, Tooltip, DatePicker, Select } from 'antd';
import { ControlVentaTable } from '../components/ControlVentaTable';
export const ControlVentas = () => {
  const { consultaVentas, contextHolder} = useContext(ControlVentaContext);
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const [filtros, setFiltros] = useState({});
  
  const ITEMS = [
    { path: '', title: <HomeOutlined /> },
    { path: "ventas", title: "Ventas" },
    { path: "control-ventas", title: "control de Ventas" },
  ];

  const onFinish = (values) => {
    
    const filtros = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value != null && value !== "")
    );

    // Convertir fechas si existen
    if (filtros.fechas && Array.isArray(filtros.fechas)) {
      filtros.fechas = [
        filtros.fechas[0].format("YYYY-MM-DD"),
        filtros.fechas[1].format("YYYY-MM-DD"),
      ];
    }

    setFiltros(filtros);
    consultaVentas(filtros);
  };

  useEffect(() => {
    consultaVentas();
  },[])
  return (
    <>
      {contextHolder}
      <BreadCrumbComponent
        titulo='Ventas'
        modulo='Control de Ventas'
        items={ITEMS}
      />
      <Space style={{width:"100%"}} direction="vertical" size={"small"}>
        {/* filtros */}
        <Card className='card-filtros'>
          <Collapse
            defaultActiveKey={['1']}
            size='small'
            //collapsible="icon"
            ghost
            items={[
              {
                key: '1',
                label: 'Filtros de búsqueda',
                children: (
                  <Form layout="vertical" form={form} onFinish={onFinish}>
                    <Row gutter={[2, 2]}>
                      <Col xs={24} md={6}>
                        <Form.Item label="Cliente" name="descripcion">
                          <Input size="middle" placeholder="escriba un cliente" />
                        </Form.Item>
                      </Col>

                      {/* Rango de fechas */}
                      <Col xs={24} md={6}>
                        <Form.Item 
                          label="Rango de fechas" 
                          name="fechas"
                        >
                          <RangePicker 
                            size="middle" 
                            style={{ width: "100%" }}
                            format="YYYY-MM-DD"
                            placeholder={["Fecha inicio", "Fecha fin"]}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={6}>
                        <Form.Item label="Estado" name="estado_gestion">
                          <Select
                            placeholder="Todos los estados"
                            allowClear
                            options={[
                              { label: 'TODOS', value: '' },
                              { label: 'PAGADO', value: 'PAGADO' },
                              { label: 'PENDIENTE', value: 'PENDIENTE' },
                              { label: 'ANULADO', value: 'ANULADO' },
                            ]}
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
          
          <ControlVentaTable
            filtros={filtros}
          />
        </Card>

      </Space>


    </>
  )
}
