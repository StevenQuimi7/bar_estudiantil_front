import React, { useState, useContext } from 'react'
import { Table, Empty, Row, Col, Space, Tooltip, Button, Dropdown, Image } from 'antd'
import { useColumnSearch } from '../../../hooks/useColumnSearch';
import { MoreOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined, FileExcelOutlined, DownOutlined, EyeOutlined  } from '@ant-design/icons';
import { ModalConfirmarEliminar } from '../../../components/ModalConfirmarEliminar';

import { ProductoContext } from '../context/ProductoContextProvider';
import { CrearActualizarProductoModal} from '../modals/CrearActualizarProductoModal';
import { ModalCargaMasivaExcel } from '../../../components/ModalCargaMasivaExcel';
import { constants } from '../../../config/constants';


export const ProductoTable = React.memo(({
    filtros={},
}) => {
    const { getColumnSearchProps} = useColumnSearch();
    const [modalCrearActualizar, setModalCrearActulizar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [modalImportar, setModalImportar] = useState(false);
    const [isDeleteMasivo, setIsDeleteMasivo] = useState(false);
    const [productoEdit, setProductoEdit] = useState({});
    const [productoDelete, setProductoDelete] = useState(0);
    const [isCreate, setIsCreate] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowValues, setSelectedRowValues] = useState([]);
    const { deleteProducto, contextHolder, contextHolder2, isLoading, productos, consultaProductos, cargaMasiva, exportar, exportarPlantilla} = useContext(ProductoContext);
    
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    const columns = [
        {
            title: '#',
            dataIndex: 'numero',
            key: 'numero',
            align:"center"
        },
        {
            title: 'Código',
            dataIndex: 'codigo',
            key: 'codigo',
            align:"center",
            ...getColumnSearchProps('codigo'),
        },
        {
            title: 'Categoría',
            dataIndex: 'categoria',
            key: 'categoria',
            align:"center",
            ...getColumnSearchProps('categoria'),
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
            align: "center",
            ...getColumnSearchProps('nombre'),
            render: (text, record) => {
                const imagePath = record?.image?.path;

                return (
                <>
                    <span>{text}</span>

                    {imagePath && (
                    <EyeOutlined
                        style={{
                        marginLeft: 8,
                        color: "#1677ff",
                        cursor: "pointer",
                        }}
                        onClick={() => {
                        setPreviewImage(getImageUrl(imagePath));
                        setPreviewOpen(true);
                        }}
                    />
                    )}
                </>
                );
            },
        },

        {
            title: 'Precio',
            dataIndex: 'precio',
            key: 'precio',
            align:"center",
            ...getColumnSearchProps('precio'),
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
                                setProductoEdit(record)
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
                                setProductoDelete(record.id)
                                toggleEliminar();
                            }
                        }
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
    const getImageUrl = (path) => {
    return `${constants.URL_IMAGE}productos/${path}`;
    };

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
            value = {ids:[productoDelete]}
        }
        const response = await deleteProducto(value);
        if(response.ok){
            reiniciarVariables();
            await consultaProductos();
        }
    }

    const toggleModalCrearActualizar  = ()=>{ setModalCrearActulizar(!modalCrearActualizar); }
    const toggleEliminar  = ()=>{ setModalEliminar(!modalEliminar); }
    const toggleImportar  = ()=>{ setModalImportar(!modalImportar); }
    
    const handlePageChange = async (page, pageSize) => {
        let values = {
            ...filtros,
            per_page:pageSize,
            page:page
        }
        if (page !== productos?.current_page || pageSize !== productos?.per_page) {
            await consultaProductos(values);
        }
    };

    const cargaMasivaProductos = async(file)=>{
        const response = await cargaMasiva(file);
        if(response.ok){
            await consultaProductos();
            return true;
        }else{
            return false;
        }
    }

    const exportarProductos = async()=>{

        let values = {
            ...filtros,
            download: true
        }
        await exportar(values);
    }

    const items = [
        {
            key: "exportar",
            label: "Exportar",
            onClick: () => exportarProductos(),
        },
        {
            key: "plantilla",
            label: "Descargar plantilla",
            onClick: () => exportarPlantilla(),
        },
    ];

    const reiniciarVariables = () => {
        setIsCreate(true);
        setProductoEdit({});
        setProductoDelete(0);
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
                            setProductoEdit({})
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
                    <Button 
                        size='middle'
                        onClick={()=>{
                            toggleImportar()
                        }}
                        className="btn-importar"
                        style={{marginRight:6}} 
                        icon={<FileExcelOutlined />}>
                        Importar
                    </Button>
                    <Dropdown
                        menu={{ items }}
                        trigger={["click"]}
                    >
                        <Button
                            size="middle"
                            disabled={isLoading}
                            className="btn-exportar"
                            style={{ marginRight: 6 }}
                            icon={<FileExcelOutlined />}
                        >
                            Exportar <DownOutlined />
                        </Button>
                    </Dropdown>
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
                        dataSource={productos?.data} 
                        size="small"
                        scroll={{
                            x: 500
                        }}
                        pagination={{
                            current: productos?.current_page ?? 1,
                            pageSize: productos?.per_page ?? 5,
                            total: productos?.total ?? 0,
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
        <CrearActualizarProductoModal
            open={modalCrearActualizar}
            toggle={toggleModalCrearActualizar}
            producto={productoEdit}
            isCreate={isCreate}
            titulo={isCreate ? 'Crear Producto' : 'Modificar Producto'}
        />
        < ModalConfirmarEliminar
            modalEliminar={modalEliminar}
            Eliminar={eliminar}
            toggle={toggleEliminar}
            mensaje={isDeleteMasivo ? '¿Estás seguro de eliminar los registros seleccionados?' : '¿Está seguro de eliminar este registro?'}
            titulo={isDeleteMasivo ? 'Eliminación masiva' : 'Eliminar Registro'}

        />

        < ModalCargaMasivaExcel
            open={modalImportar}
            toggle={toggleImportar}
            titulo={'Carga Masiva de Productos'}
            onSave={cargaMasivaProductos}
        />

        <Image
        wrapperStyle={{ display: "none" }}
        preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => {
            if (!visible) setPreviewImage("");
            },
        }}
        src={previewImage}
        />


    </>
  )
}
);
