import React, { useState, useContext } from 'react'
import { Table, Empty, Row, Col, Space, Tooltip, Button, Dropdown } from 'antd'
import { useColumnSearch } from '../../../hooks/useColumnSearch';
import { MoreOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { ModalConfirmarEliminar } from '../../../components/ModalConfirmarEliminar';

import { CrearActualizarRolePermisoModal } from '../modals/CrearActualizarRolesPermisosModal';
import { RolePermisoContext } from '../context/RolePermisoContextProvider';

export const RolePermisoTable = React.memo(({
    filtros={},
}) => {
    const { getColumnSearchProps} = useColumnSearch();
    const [modalCrearActualizar, setModalCrearActulizar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [isDeleteMasivo, setIsDeleteMasivo] = useState(false);
    const [rolePermisoEdit, setRolePermisoEdit] = useState({});
    const [rolePermisoDelete, setRolePermisoDelete] = useState(0);
    const [isCreate, setIsCreate] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowValues, setSelectedRowValues] = useState([]);
    const { deleteRolePermiso, contextHolder, contextHolder2, isLoading, roles_permisos, consultaRoles} = useContext(RolePermisoContext);

    const columns = [
        {
            title: '#',
            dataIndex: 'numero',
            key: 'numero',
            align:"center"
        },
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            align:"center",
            ...getColumnSearchProps('name'),
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
                            setRolePermisoEdit(record)
                            toggleModalCrearActualizar();
                        }
                    },
                    {
                        key: 'delete',
                        label: (
                        <Tooltip title="Eliminar" placement="left">
                            <DeleteOutlined style={{ fontSize: 12, color:'red' }} />
                        </Tooltip>
                        ),
                        onClick: () => { 
                            setIsDeleteMasivo(false);
                            setRolePermisoDelete(record.id)
                            toggleEliminar();
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
            value = {ids:[rolePermisoDelete]}
        }
        const response = await deleteRolePermiso(value);
        if(response.ok){
            reiniciarVariables();
            await consultaRoles();
        }
    }
    const toggleModalCrearActualizar  = ()=>{ setModalCrearActulizar(!modalCrearActualizar); }
    const toggleEliminar  = ()=>{ setModalEliminar(!modalEliminar); }
    
    const handlePageChange = async (page, pageSize) => {
        let values = {
            ...filtros,
            per_page:pageSize,
            page:page
        }
        if (page !== roles_permisos?.current_page || pageSize !== roles_permisos?.per_page) {
            await consultaRoles(values);
        }
    };
    const reiniciarVariables = () => {
        setIsCreate(true);
        setRolePermisoEdit({});
        setRolePermisoDelete(0);
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
                        setRolePermisoEdit({})
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
                        dataSource={roles_permisos?.data} 
                        size="small"
                        scroll={{
                            x: 500
                        }}
                        pagination={{
                            current: roles_permisos?.current_page ?? 1,
                            pageSize: roles_permisos?.per_page ?? 5,
                            total: roles_permisos?.total ?? 0,
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
        <CrearActualizarRolePermisoModal
            open={modalCrearActualizar}
            toggle={toggleModalCrearActualizar}
            role_permiso={rolePermisoEdit}
            isCreate={isCreate}
            titulo={isCreate ? 'Crear Roles y Permisos' : 'Modificar Roles y Permisos'}
        />
        < ModalConfirmarEliminar
            modalEliminar={modalEliminar}
            Eliminar={eliminar}
            toggle={toggleEliminar}
            mensaje={isDeleteMasivo ? '¿Estás seguro de eliminar los registros seleccionados?' : '¿Está seguro de eliminar este registro?'}
            titulo={isDeleteMasivo ? 'Eliminación masiva' : 'Eliminar Registro'}

        />

    </>
  )
}
);
