import React, { useState, useContext } from 'react'
import { Table, Empty, Row, Col, Space, Tooltip, Button, Dropdown } from 'antd'
import { MoreOutlined, DeleteOutlined, FileExcelOutlined, EditOutlined } from '@ant-design/icons';

import { ControlVentaContext } from '../context/ControlVentaContextProvider';
import { useColumnSearch } from '../../../../hooks/useColumnSearch';
import { ActualizarEstadoVentaModal } from '../modals/ActualizarEstadoVentaModal';

export const ControlVentaTable = React.memo(({
    filtros={},
}) => {
    const { getColumnSearchProps} = useColumnSearch();
    const [modalEstadoGestion, setModalEstadoGestion] = useState(false);
    const [ventaEdit, setVenta] = useState({});
    const { contextHolder, contextHolder2, isLoading, ventas, consultaVentas, exportar} = useContext(ControlVentaContext);

    const columns = [
        {
            title: '#',
            dataIndex: 'numero',
            key: 'numero',
            align:"center"
        },
        {
            title: 'Identificacion',
            dataIndex: 'identificacion',
            key: 'identificacion',
            align:"center",
            ...getColumnSearchProps('identificacion'),
        },
        {
            title: 'Cliente',
            dataIndex: 'cliente',
            key: 'cliente',
            align:"center",
            ...getColumnSearchProps('cliente'),
        },
        {
            title: 'Tipo Cliente',
            dataIndex: 'tipo_cliente',
            key: 'tipo_cliente',
            align:"center",
            ...getColumnSearchProps('tipo_cliente'),
        },
        {
            title: 'Total Venta',
            dataIndex: 'total_venta',
            key: 'total_venta',
            align:"center",
            ...getColumnSearchProps('total_venta'),
        },
        {
            title: 'Descuento Credito',
            dataIndex: 'descuento_credito',
            key: 'descuento_credito',
            align:"center",
            ...getColumnSearchProps('descuento_credito'),
        },
        {
            title: 'Total',
            dataIndex: 'total_pagar',
            key: 'total_pagar',
            align:"center",
            ...getColumnSearchProps('total_pagar'),
        },
        {
            title: 'Estado',
            dataIndex: 'estado_gestion',
            key: 'estado_gestion',
            align:"center",
            ...getColumnSearchProps('estado_gestion'),
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
        {
            title: 'Acciones',
            dataIndex: 'acciones',
            key: 'acciones',
            align:"center",
            render: (_, record) => {
                const menu = {
                    items: [
                    {
                        key: 'delete',
                        label: (
                        <Tooltip title="Editar" placement="left">
                            <EditOutlined style={{ fontSize: 12, color:'green' }} />
                        </Tooltip>
                        ),
                        onClick: () => { 
                            setModalEstadoGestion(false);
                            setVenta(record)
                            toggleEstadoGestion();
                        }
                    },
                    ],
                };

                return (
                    <Dropdown menu={menu} trigger={['hover']}>
                        <Button className='btn-acciones' type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                );
            }
        },
    ];

    const toggleEstadoGestion  = ()=>{ setModalEstadoGestion(!modalEstadoGestion); }
    
    const handlePageChange = async (page, pageSize) => {
        let values = {
            ...filtros,
            per_page:pageSize,
            page:page
        }
        if (page !== ventas?.current_page || pageSize !== ventas?.per_page) {
            await consultaVentas(values);
        }
    };
    const reiniciarVariables = () => {
        setVenta(0);
        setSelectedRowKeys([]);
        setSelectedRowValues([]);
    }
    const expandedRowRender = (table1) => {
        const data = table1?.detalles_venta?.map((x, key) => {

            return {
                key: key,
                numero: key + 1,
                id_venta: x?.id_venta,
                id_producto: x?.id_producto,
                cantidad: x?.cantidad,
                subtotal: x?.subtotal,
                nombre_producto: x?.producto?.nombre,
                codigo_producto: x?.producto?.codigo,
                precio: x?.producto?.precio
            }
        });

        const columnas = [
            {
                dataIndex: 'numero',
                key: 'numero',
                title: '#',
                width: 30,
                align: "center",
                // fixed: window.innerWidth >= 768 ? "left" : undefined,
            },
            {
                title: "Código",
                dataIndex: "codigo_producto",
                key: 'codigo_producto',
                width: 20,
                align: "center",

            },

            {
                title: "Producto",
                dataIndex: "nombre_producto",
                key: 'nombre_producto',
                width: 100,
                align: "center"
            },
            {
                title: 'Precio',
                dataIndex: 'precio',
                key: 'precio',
                width: 30,
                align: "center"
            },
            {
                title: "Cantidad",
                dataIndex: "cantidad",
                key: 'cantidad',
                width: 60,
                align: "center"

            },
            {
                title: 'Subtotal',
                dataIndex: 'subtotal',
                key: 'subtotal',
                width: 30,
                align: "center"
            },
            

        ];
        return <Table
            className='custom-table-header-expandible-material'
            style={{ margin: "10px" }}
            columns={columnas}
            dataSource={data}
            pagination={false}
            
            bordered
            scroll={{
                x: 500
            }}
            locale={{
                emptyText: (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <span style={{ color: "#858585" }}>No existen sustitutos para el material principal</span>
                        }
                    />
                ),
            }}
        />;
    };

    const exportarVentas = async()=>{

        let values = {
            ...filtros,
            download: true
        }
        await exportar(values);
    }

  return (
    <>
        {contextHolder}
        {contextHolder2}
        <Space style={{width:"100%"}} direction="vertical" size={"middle"}>

            {/* botones nuevo y eliminar masivo */}
            <Row>
                <Col span={24}>
                    <Button 
                        size='middle'
                        onClick={()=>{
                            exportarVentas()
                        }}
                        disabled={isLoading}
                        className="btn-exportar"
                        style={{marginRight:6}} 
                        icon={<FileExcelOutlined />}>
                        Exportar
                    </Button>
                </Col>
            </Row>
            {/* tabla */}
            <Row>
                <Col span={24}>
                    <Table 
                        loading={isLoading}
                        bordered
                        columns={columns} 
                        dataSource={ventas?.data} 
                        size="small"
                        scroll={{
                            x: 500
                        }}
                        expandable={{
                                    expandedRowRender: (record) => expandedRowRender(record),
                                    columnWidth: 20,
                                    expandRowByClick: false,
                                }}
                        pagination={{
                            current: ventas?.current_page ?? 1,
                            pageSize: ventas?.per_page ?? 5,
                            total: ventas?.total ?? 0,
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


        <ActualizarEstadoVentaModal
            open={modalEstadoGestion}
            toggle={toggleEstadoGestion}
            venta={ventaEdit}
            titulo={'Gestionar Estado de Venta'}
        />

    </>
  )
}
);
