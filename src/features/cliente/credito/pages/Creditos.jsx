import React, { useState, useEffect, useContext } from 'react'
import { CreditoContext } from '../context/CreditoContextProvider'
import { BreadCrumbComponent } from '../../../../components/BreadCrumbComponent';
import { HomeOutlined, SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { Card, Button, Form, Input, Row, Col, Space, Collapse, Tooltip, DatePicker } from 'antd';

import { useParams, useLocation } from "react-router-dom";
import { CreditoCollapse } from '../components/CreditoCollapse';

export const Creditos = () => {

  const { id } = useParams();
  const { state } = useLocation();
  const tipoCliente = state?.tipo_cliente;
  const { RangePicker } = DatePicker;

  const { consultaCredito,credito,consultaMovimientos, contextHolder } = useContext(CreditoContext);
  const [form] = Form.useForm();
  const [filtros, setFiltros] = useState({});
  
  const ITEMS = [
    { path: '', title: <HomeOutlined /> },

    ...(tipoCliente === 'estudiante'
      ? [{ path: 'estudiantes', title: 'Estudiantes' }]
      : tipoCliente === 'cliente'
      ? [{ path: 'clientes', title: 'Clientes' }]
      : []),

    { path: 'creditos', title: 'Créditos' }
  ];


  const onFinish = (values) => {

    // Convertir fechas si existen
    if (values.fechas && Array.isArray(values.fechas)) {
      values.fechas = [
        values.fechas[0].format("YYYY-MM-DD"),
        values.fechas[1].format("YYYY-MM-DD"),
      ];
    }

    values.id_credito_cliente = credito.id;

    setFiltros(values);
    consultaMovimientos(values);
  };


  useEffect(() => {
    consultaCredito({id_cliente: id});
  }, [])

  return (
    <>
      {contextHolder}
      <BreadCrumbComponent
        titulo='Mantenimiento'
        modulo='Módulo de Creditos'
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

                      {/* Botones */}
                      <Col xs={24} style={{ textAlign: "end" }}>
                        <Tooltip title="Buscar">
                          <Button
                            disabled = {credito && credito.id ? false : true}
                            className="btn-buscar"
                            style={{ marginRight: 6 }}
                            shape="circle"
                            type="primary"
                            htmlType="submit"
                            icon={<SearchOutlined />}
                          />
                        </Tooltip>

                        <Tooltip title="Limpiar">
                          <Button
                            disabled = {credito && credito.id ? false : true}
                            className="btn-limpiar"
                            shape="circle"
                            onClick={() => form.resetFields()}
                            icon={<ClearOutlined />}
                          />
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
          
          <CreditoCollapse filtros={filtros} id_cliente={id}/>

        </Card>

      </Space>


    </>
  )
}
