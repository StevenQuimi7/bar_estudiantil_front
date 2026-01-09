import React, { useState, useContext } from 'react'
import { Table, Empty, Row, Col, Space, Tooltip, Button, Dropdown } from 'antd'
import { useColumnSearch } from '../../../hooks/useColumnSearch';
import { MoreOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined, DollarOutlined,FileExcelOutlined, DownOutlined } from '@ant-design/icons';
import { ModalConfirmarEliminar } from '../../../components/ModalConfirmarEliminar';

import { CrearActualizarEstudianteModal } from '../modals/CrearActualizarEstudianteModal';
import { EstudianteContext } from '../context/EstudianteContextProvider';

import { useNavigate } from "react-router-dom";
import { ModalCargaMasivaExcel } from '../../../components/ModalCargaMasivaExcel';

export const EstudianteTable = React.memo(({
    filtros={},
}) => {
    const { getColumnSearchProps} = useColumnSearch();
    const [modalCrearActualizar, setModalCrearActulizar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [modalImportar, setModalImportar] = useState(false);
    const [isDeleteMasivo, setIsDeleteMasivo] = useState(false);
    const [estudianteEdit, setEstudianteEdit] = useState({});
    const [estudianteDelete, setEstudianteDelete] = useState(0);
    const [isCreate, setIsCreate] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowValues, setSelectedRowValues] = useState([]);
    const { deleteEstudiante, contextHolder, contextHolder2, isLoading, estudiantes, consultaEstudiantes, cargaMasiva, exportar, exportarPlantilla} = useContext(EstudianteContext);
    const navigate = useNavigate();
    
    const columns = [
        {
            title: '#',
            dataIndex: 'numero',
            key: 'numero',
            align:"center"
        },
        {
            title: '# Identificación',
            dataIndex: 'numero_identificacion',
            key: 'numero_identificacion',
            align:"center",
            ...getColumnSearchProps('numero_identificacion'),
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
            title: 'Nivel',
            dataIndex: 'nivel',
            key: 'nivel',
            align:"center",
            ...getColumnSearchProps('nivel'),
        },
        {
            title: 'Grado',
            dataIndex: 'grado',
            key: 'grado',
            align:"center",
            ...getColumnSearchProps('grado'),
        },
        {
            title: 'Sección',
            dataIndex: 'seccion',
            key: 'seccion',
            align:"center",
            ...getColumnSearchProps('seccion'),
        },
        {
            title: 'Especialidad',
            dataIndex: 'especialidad',
            key: 'especialidad',
            align:"center",
            ...getColumnSearchProps('especialidad'),
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
                            key: 'credito',
                            label: (
                            <Tooltip title="Crédito" placement="left">
                                <DollarOutlined style={{ fontSize: 12, color:'green' }} />
                            </Tooltip>
                            ),
                            onClick: () => { 
                                navigate(`creditos/${record.id_cliente}`, { state: { cliente: record, tipo_cliente: 'estudiante' } });
                            }
                        },
                        {
                            key: 'edit',
                            label: (
                            <Tooltip title="Editar" placement="left">
                                <EditOutlined style={{ fontSize: 12, color:'green' }} />
                            </Tooltip>
                            ),
                            onClick: () => { 
                                setIsCreate(false)
                                setEstudianteEdit(record)
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
                                setEstudianteDelete(record.id)
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
            value = {ids:[estudianteDelete]}
        }
        const response = await deleteEstudiante(value);
        if(response.ok){
            reiniciarVariables();
            await consultaEstudiantes();
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
        if (page !== estudiantes?.current_page || pageSize !== estudiantes?.per_page) {
            await consultaEstudiantes(values);
        }
    };

    const cargaMasivaClientes = async(file)=>{
        file.append('tipo_cliente', "ESTUDIANTE");
        const response = await cargaMasiva(file);
        if(response.ok){
            await consultaEstudiantes();
            return true;
        }else{
            return false;
        }
    }

    const exportarClientes = async()=>{

        let values = {
            ...filtros,
            download: true,
            tipo_cliente: 'ESTUDIANTE'
        }
        await exportar(values);
    }

    const items = [
        {
            key: "exportar",
            label: "Exportar",
            onClick: () => exportarClientes(),
        },
        {
            key: "plantilla",
            label: "Descargar plantilla",
            onClick: () => exportarPlantilla({tipo_cliente: 'ESTUDIANTE'}),
        },
    ];


    const reiniciarVariables = () => {
        setIsCreate(true);
        setEstudianteEdit({});
        setEstudianteDelete(0);
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
                            setEstudianteEdit({})
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
                        dataSource={estudiantes?.data} 
                        size="small"
                        scroll={{
                            x: 500
                        }}
                        pagination={{
                            current: estudiantes?.current_page ?? 1,
                            pageSize: estudiantes?.per_page ?? 5,
                            total: estudiantes?.total ?? 0,
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
        <CrearActualizarEstudianteModal
            open={modalCrearActualizar}
            toggle={toggleModalCrearActualizar}
            estudiante={estudianteEdit}
            isCreate={isCreate}
            titulo={isCreate ? 'Crear Estudiante' : 'Modificar Estudiante'}
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
            titulo={'Carga Masiva de Estudiantes'}
            onSave={cargaMasivaClientes}
        />

    </>
  )
}
);
