import React, { useState, useContext } from 'react'
import { Table, Empty, Row, Col, Space, Tooltip, Button, Dropdown } from 'antd'
import { useColumnSearch } from '../../../hooks/useColumnSearch';
import { MoreOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined, RestOutlined } from '@ant-design/icons';
import { ModalConfirmarEliminar } from '../../../components/ModalConfirmarEliminar';

import { CrearActualizarUsuarioModal } from '../modals/CrearActualizarUsuarioModal';
import { UsuarioContext } from '../context/UsuarioContextProvider';

export const UsuarioTable = React.memo(({
    filtros={},
}) => {
    const { getColumnSearchProps} = useColumnSearch();
    const [modalCrearActualizar, setModalCrearActulizar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [modalReestore, setModalReestore] = useState(false);
    const [isDeleteMasivo, setIsDeleteMasivo] = useState(false);
    const [usuarioEdit, setUsuarioEdit] = useState({});
    const [usuarioDelete, setUsuarioDelete] = useState(0);
    const [isCreate, setIsCreate] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowValues, setSelectedRowValues] = useState([]);
    const { deleteUsuario,restoreUsuario, contextHolder, contextHolder2, isLoading, usuarios, consultaUsuarios} = useContext(UsuarioContext);

    const columns = [
        {
            title: '#',
            dataIndex: 'numero',
            key: 'numero',
            align:"center"
        },
        {
            title: 'User Name',
            dataIndex: 'username',
            key: 'username',
            align:"center",
            ...getColumnSearchProps('username'),
        },
        {
            title: 'Apellidos',
            dataIndex: 'apellidos',
            key: 'apellidos',
            align:"center",
            ...getColumnSearchProps('apellidos'),
        },
        {
            title: 'Nombres',
            dataIndex: 'nombres',
            key: 'nombres',
            align:"center",
            ...getColumnSearchProps('nombres'),
        },
        {
            title: 'Rol',
            dataIndex: 'rol',
            key: 'rol',
            align:"center",
            ...getColumnSearchProps('rol'),
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
                            key: 'edit',
                            label: (
                            <Tooltip title="Editar" placement="left">
                                <EditOutlined style={{ fontSize: 12, color:'green' }} />
                            </Tooltip>
                            ),
                            onClick: () => { 
                                setIsCreate(false)
                                setUsuarioEdit(record)
                                toggleModalCrearActualizar();
                            }
                        },
                        record.activo ? ({
                            key: 'delete',
                            label: (
                            <Tooltip title="Eliminar" placement="left">
                                <DeleteOutlined style={{ fontSize: 12, color:'red' }} />
                            </Tooltip>
                            ),
                            onClick: () => { 
                                setIsDeleteMasivo(false);
                                setUsuarioDelete(record.id)
                                toggleEliminar();
                            }
                        })
                        : ({
                            key: 'restore',
                            label: (
                            <Tooltip title="Restaurar" placement="left">
                                <RestOutlined style={{ fontSize: 12, color:'green' }} />
                            </Tooltip>
                            ),
                            onClick: () => { 
                                setUsuarioDelete(record.id)
                                toggleReestore();
                            }
                        })
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
    const onSelectChange = (newSelectedRowKeys, selectedRows) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRowValues({ ids: selectedRows.map(row => row.id) });

    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    const eliminar = async()=>{
        let value = {};
        if(isDeleteMasivo){
            value = selectedRowValues
        }else{
            value = {ids:[usuarioDelete]}
        }
        const response = await deleteUsuario(value);
        if(response.ok){
            reiniciarVariables();
            await consultaUsuarios();
        }
    }
    const restore = async()=>{
        const response = await restoreUsuario(usuarioDelete);
        if(response.ok){
            reiniciarVariables();
            await consultaUsuarios();
        }
    }
    const toggleModalCrearActualizar  = ()=>{ setModalCrearActulizar(!modalCrearActualizar); }
    const toggleEliminar  = ()=>{ setModalEliminar(!modalEliminar); }
    const toggleReestore  = ()=>{ setModalReestore(!modalReestore); }
    
    const handlePageChange = async (page, pageSize) => {
        let values = {
            ...filtros,
            per_page:pageSize,
            page:page
        }
        if (page !== usuarios?.current_page || pageSize !== usuarios?.per_page) {
            await consultaUsuarios(values);
        }
    };
    const reiniciarVariables = () => {
        setIsCreate(true);
        setUsuarioEdit({});
        setUsuarioDelete(0);
        setSelectedRowKeys([]);
        setSelectedRowValues([]);
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
                    ghost
                    className='btn-nuevo'
                    style={{marginRight:6}} 
                    type="primary"
                    onClick={ () => {
                        setIsCreate(true);
                        setUsuarioEdit({})
                        toggleModalCrearActualizar()
                    }} 
                    icon={<PlusCircleOutlined />}>
                    Nuevo
                </Button>
                <Button 
                    disabled={selectedRowKeys.length === 0 ? true:false}
                    size='middle'
                    onClick={()=>{
                        setIsDeleteMasivo(true);
                        toggleEliminar()
                    }}
                    className={selectedRowKeys.length === 0 ? '':'btn-eliminar'}
                    style={{marginRight:6}} 
                    type="primary"
                    icon={<DeleteOutlined />}>
                    Eliminar
                </Button>
                </Col>
            </Row>
            {/* tabla */}
            <Row>
                <Col span={24}>
                    <Table 
                        loading={isLoading}
                        bordered
                        rowSelection={rowSelection}
                        columns={columns} 
                        dataSource={usuarios?.data} 
                        size="small"
                        scroll={{
                            x: 500
                        }}
                        pagination={{
                            current: usuarios?.current_page ?? 1,
                            pageSize: usuarios?.per_page ?? 5,
                            total: usuarios?.total ?? 0,
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
        {/* componentes modales */}
        <CrearActualizarUsuarioModal
            open={modalCrearActualizar}
            toggle={toggleModalCrearActualizar}
            usuario={usuarioEdit}
            isCreate={isCreate}
            titulo={isCreate ? 'Crear Usuario' : 'Modificar Usuario'}
        />
        < ModalConfirmarEliminar
            modalEliminar={modalEliminar}
            Eliminar={eliminar}
            toggle={toggleEliminar}
            mensaje={isDeleteMasivo ? '¿Estás seguro de eliminar los registros seleccionados?' : '¿Está seguro de eliminar este registro?'}
            titulo={isDeleteMasivo ? 'Eliminación masiva' : 'Eliminar Registro'}

        />
        < ModalConfirmarEliminar
            modalEliminar={modalReestore}
            Eliminar={restore}
            tituloBtn='Reestablecer'
            toggle={toggleReestore}
            mensaje={'¿Está seguro de reestablecer este registro?'}
            titulo={'Restaurar Registro'}

        />

    </>
  )
}
);
