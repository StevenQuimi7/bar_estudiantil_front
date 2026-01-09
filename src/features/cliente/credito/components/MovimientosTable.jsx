import React, { useState, useContext } from 'react'
import { Table, Empty, Row, Col, Space, Tooltip, Button, Dropdown } from 'antd'
import { useColumnSearch } from '../../../../hooks/useColumnSearch';
import { MoreOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined, RestOutlined } from '@ant-design/icons';

import { CreditoContext } from '../context/CreditoContextProvider';

export const MovimientosTable = React.memo(({
    filtros={},
}) => {
    const { getColumnSearchProps} = useColumnSearch();
    const { 
        contextHolder, contextHolder2, 
        isLoading, credito, consultaCredito,
        movimientos, consultaMovimientos} = useContext(CreditoContext);

    const columns = [
        {
            title: '#',
            dataIndex: 'numero',
            key: 'numero',
            align:"center"
        },
        {
            title: 'Tipo',
            dataIndex: 'tipo',
            key: 'tipo',
            align:"center",
            ...getColumnSearchProps('tipo'),
        },
        {
            title: 'Monto',
            dataIndex: 'monto',
            key: 'monto',
            align:"center",
            ...getColumnSearchProps('monto'),
        },
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
            key: 'descripcion',
            align:"center",
            ...getColumnSearchProps('descripcion'),
        },
        {
            title: 'Saldo Anterior',
            dataIndex: 'saldo_anterior',
            key: 'saldo_anterior',
            align:"center",
            ...getColumnSearchProps('saldo_anterior'),
        },
        {
            title: 'Saldo Actual',
            dataIndex: 'saldo_actual',
            key: 'saldo_actual',
            align:"center",
            ...getColumnSearchProps('saldo_actual'),
        },
        {
            title: 'Fecha Creación',
            dataIndex: 'created_at',
            key: 'created_at',
            align:"center",
        }
    ];

    

    const handlePageChange = async (page, pageSize) => {
        let values = {
            ...filtros,
            per_page:pageSize,
            page:page,
            id_credito_cliente: credito.id
        }
        if (page !== movimientos?.current_page || pageSize !== movimientos?.per_page) {
            await consultaMovimientos(values);
        }
    };

  return (
    <>
        {contextHolder}
        {contextHolder2}
        <Space style={{width:"100%"}} direction="vertical" size={"middle"}>

            {/* tabla */}
            <Row>
                <Col span={24}>
                    <Table 
                        loading={isLoading}
                        bordered
                        columns={columns} 
                        dataSource={movimientos?.data} 
                        size="small"
                        scroll={{
                            x: 500
                        }}
                        pagination={{
                            current: movimientos?.current_page ?? 1,
                            pageSize: movimientos?.per_page ?? 5,
                            total: movimientos?.total ?? 0,
                            pageSizeOptions: ['5', '10', '20', '50'],
                            showSizeChanger: true,
                            onChange: handlePageChange, 
                            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`,
                            position: ["bottomRight"],
                            size:'large'
                        }}
                        locale={{
                            emptyText: (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={
                                        <span style={{ color: "#858585" }}>No Existen Registros</span>
                                    }
                                />
                            ),
                        }}
                    />
                </Col>
            </Row>
        </Space>
        

    </>
  )
}
);
