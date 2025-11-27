import React, { useState } from 'react'
import { Table, Empty, Row, Col, Space, Tooltip, Button, Dropdown } from 'antd'
import { useColumnSearch } from '../../../hooks/useColumnSearch';
import { MoreOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { CrearActualizarCategoriaModal } from '../modals/CrearActualizarCategoriaModal';
import { ModalConfirmarEliminar } from '../../../components/ModalConfirmarEliminar';
import { useFetchApi } from '../hooks/useFetchApi';

export const CategoriaTable = React.memo(({
    categorias=[], 
    isLoading, 
    filtros={},
    consultaCategorias = () => {}
}) => {
    const { getColumnSearchProps} = useColumnSearch();
    const [modalCrearActualizar, setModalCrearActulizar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [isDeleteMasivo, setIsDeleteMasivo] = useState(false);
    const [categoriaEdit, setCategoriaEdit] = useState({});
    const [categoriaDelete, setCategoriaDelete] = useState(0);
    const [isCreate, setIsCreate] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowValues, setSelectedRowValues] = useState([]);
    const { deleteCategoria, contextHolder, contextHolder2 } = useFetchApi();

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
                            setCategoriaEdit(record)
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
                            setCategoriaDelete(record.id)
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
        onChange: onSelectChange,
        // selections: [
        //     Table.SELECTION_ALL,
        //     Table.SELECTION_INVERT,
        //     Table.SELECTION_NONE,
        // ],
    };

    const eliminar = async()=>{
        let value = {};
        if(isDeleteMasivo){
            value = selectedRowValues
        }else{
            value = {ids:[categoriaDelete]}
        }
        const response = await deleteCategoria(value);
        if(response.ok){
            reiniciarVariables();
            await consultaCategorias();
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
        if (page !== categorias?.current_page || pageSize !== categorias?.per_page) {
            await consultaCategorias(values);
        }
    };
    const reiniciarVariables = () => {
        setIsCreate(true);
        setCategoriaEdit({});
        setCategoriaDelete(0);
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
                        setCategoriaEdit({})
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
                        dataSource={categorias?.data} 
                        size="small"
                        scroll={{
                            x: 500
                        }}
                        pagination={{
                            current: categorias?.current_page ?? 1,
                            pageSize: categorias?.per_page ?? 5,
                            total: categorias?.total ?? 0,
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
        <CrearActualizarCategoriaModal
            open={modalCrearActualizar}
            toggle={toggleModalCrearActualizar}
            categoria={categoriaEdit}
            isCreate={isCreate}
            titulo={isCreate ? 'Crear Categoría' : 'Modificar Categoría'}
            consultaCategorias={consultaCategorias}
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
