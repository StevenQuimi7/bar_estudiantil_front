import React, { useState, useContext } from 'react'
import { Table, Empty, Row, Col, Space, Tooltip, Button, Dropdown } from 'antd'
import { useColumnSearch } from '../../../hooks/useColumnSearch';

import { AuditoriaContext } from '../context/AuditoriaContextProvider';

export const AuditoriaTable = React.memo(({
    filtros={},
}) => {
    const { getColumnSearchProps} = useColumnSearch();
    const { contextHolder, contextHolder2, isLoading, auditorias, consultaAuditorias} = useContext(AuditoriaContext);

    const columns = [
        {
            title: '#',
            dataIndex: 'numero',
            key: 'numero',
            align:"center"
        },
        {
            title: 'Acción',
            dataIndex: 'accion',
            key: 'accion',
            align:"center",
            ...getColumnSearchProps('accion'),
        },
        {
            title: 'Data Anterior',
            dataIndex: 'data_anterior',
            key: 'data_anterior',
            align:"center",
            ...getColumnSearchProps('data_anterior'),
        },
        {
            title: 'Data Actual',
            dataIndex: 'data_actual',
            key: 'data_actual',
            align:"center",
            ...getColumnSearchProps('data_actual'),
        },
        {
            title: 'Usuario Creación',
            dataIndex: 'usuario_creacion',
            key: 'usuario_creacion',
            align:"center",
        },
        {
            title: 'Fecha Creación',
            dataIndex: 'created_at',
            key: 'created_at',
            align:"center",
        },
    ];

    const handlePageChange = async (page, pageSize) => {
        let values = {
            ...filtros,
            per_page:pageSize,
            page:page
        }
        if (page !== auditorias?.current_page || pageSize !== auditorias?.per_page) {
            await consultaAuditorias(values);
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
                        dataSource={auditorias?.data} 
                        size="small"
                        scroll={{
                            x: 500
                        }}
                        pagination={{
                            current: auditorias?.current_page ?? 1,
                            pageSize: auditorias?.per_page ?? 5,
                            total: auditorias?.total ?? 0,
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
