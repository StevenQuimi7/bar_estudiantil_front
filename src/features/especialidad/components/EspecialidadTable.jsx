import React, { useState, useContext } from 'react'
import { Table, Empty, Row, Col, Space, Tooltip, Button, Dropdown } from 'antd'
import { useColumnSearch } from '../../../hooks/useColumnSearch';
import { MoreOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { ModalConfirmarEliminar } from '../../../components/ModalConfirmarEliminar';

import { CrearActualizarEspecialidadModal } from '../modals/CrearActualizarEspecialidadModal';
import { EspecialidadContext } from '../context/EspecialidadContextProvider';

export const EspecialidadTable = React.memo(({
    filtros={},
}) => {
    const { getColumnSearchProps} = useColumnSearch();
    const [modalCrearActualizar, setModalCrearActulizar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [isDeleteMasivo, setIsDeleteMasivo] = useState(false);
    const [especialidadEdit, setEspecialidadEdit] = useState({});
    const [especialidadDelete, setEspecialidadDelete] = useState(0);
    const [isCreate, setIsCreate] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowValues, setSelectedRowValues] = useState([]);
    const { deleteEspecialidad, contextHolder, contextHolder2, isLoading, especialidades, consultaEspecialidades} = useContext(EspecialidadContext);

    const columns = [
        {
            title: '#',
            dataIndex: 'numero',
            key: 'numero',
            align:"center"
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
            align:"center",
            ...getColumnSearchProps('nombre'),
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
                        key: 'edit',
                        label: (
                        <Tooltip title="Editar" placement="left">
                            <EditOutlined style={{ fontSize: 12, color:'green' }} />
                        </Tooltip>
                        ),
                        onClick: () => { 
                            setIsCreate(false)
                            setEspecialidadEdit(record)
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
                            setEspecialidadDelete(record.id)
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
            value = {ids:[especialidadDelete]}
        }
        const response = await deleteEspecialidad(value);
        if(response.ok){
            reiniciarVariables();
            await consultaEspecialidades();
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
        if (page !== especialidades?.current_page || pageSize !== especialidades?.per_page) {
            await consultaEspecialidades(values);
        }
    };
    const reiniciarVariables = () => {
        setIsCreate(true);
        setEspecialidadEdit({});
        setEspecialidadDelete(0);
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
                        setEspecialidadEdit({})
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
                        dataSource={especialidades?.data} 
                        size="small"
                        scroll={{
                            x: 500
                        }}
                        pagination={{
                            current: especialidades?.current_page ?? 1,
                            pageSize: especialidades?.per_page ?? 5,
                            total: especialidades?.total ?? 0,
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
        <CrearActualizarEspecialidadModal
            open={modalCrearActualizar}
            toggle={toggleModalCrearActualizar}
            nivel={especialidadEdit}
            isCreate={isCreate}
            titulo={isCreate ? 'Crear Especialidad' : 'Modificar Especialidad'}
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
