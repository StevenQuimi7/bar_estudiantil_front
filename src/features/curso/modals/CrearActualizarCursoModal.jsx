import React, {useContext, useEffect, useState} from 'react'
import { Modal, Button, Row, Col, Form, Input, Select } from 'antd'
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { CursoContext } from '../context/CursoContextProvider';
export const CrearActualizarCursoModal = ({
  open=false,
  toggle=()=>{},
  curso={},
  isCreate=true,
  titulo='',
}) => {
  
  const { 
    storeCurso, 
    updateCurso,  
    contextHolder, contextHolder2,
    consultaCursos,
    isLoading,
    comboNiveles,comboGrados,comboEspecialidades
  } = useContext(CursoContext);
  
  const [form] = Form.useForm();
  const [error, setError] = useState({});
  const onFinish = (values) =>{
    isCreate ? guardar(values) : actualizar(values);
  }

  const guardar = async(values)=>{
    const response = await storeCurso(values);
    if(response.ok){
      consultaCursos();
      toggle();
    }else{
      if(response?.error?.validaciones !== null){
        toggle();
      }
      if(response?.error?.formulario !== null){
        setError(response.error.formulario);
      }
    }
  }
  const actualizar = async(values)=>{
    const response = await updateCurso(values);
    if(response.ok){
      consultaCursos();
      toggle();
    }else{
      if(response?.error?.validaciones !== null){
        toggle();
      }
      if(response?.error?.formulario !== null){
        setError(response.error.formulario);
      }
    }
  }

  useEffect(() => {
    if (open) { 
      setError({})
      if (!isCreate && curso) {
        form.setFieldsValue({ 
          id: curso?.id, 
          id_nivel: curso.id_nivel || undefined,
          id_grado: curso.id_grado || undefined,
          seccion: curso.seccion || undefined,
          id_especialidad: curso.id_especialidad || undefined,

        });
      } else {
        form.resetFields();
      }
    }
  }, [curso, isCreate, form, open]);

  return (
    <>
      {contextHolder2}
      {contextHolder}
      <Modal
        title={titulo}
        centered
        footer={false}
        open={open}
        onCancel={toggle}
        width={{
          xs:'90%',
          md:'40%'
        }}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={[6, 6]}>
            <Form.Item hidden name="id">  
              <Input type="hidden" name="id"/>
            </Form.Item>
            <Col xs={12}>
              <Form.Item 
                label="Nivel" 
                name="id_nivel"
                rules={[
                    {
                      required: true,
                      message: "Por favor, seleccione un nivel",
                    },
                  ]}
                validateStatus={error?.id_nivel?.length ? "error" : ""}
                help={
                  error?.id_nivel?.length ? (
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {error?.id_nivel.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  ) : ""
                }
                >
                <Select
                  style={{ width: '100%' }}
                  showSearch
                  placeholder="Selecciona un nivel"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={comboNiveles}
                />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item 
                label="Grado" 
                name="id_grado"
                rules={[
                    {
                      required: true,
                      message: "Por favor, seleccion un grado",
                    },
                  ]}
                validateStatus={error?.id_grado?.length ? "error" : ""}
                help={
                  error?.id_grado?.length ? (
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {error?.id_grado.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  ) : ""
                }
                >
                <Select
                  style={{ width: '100%' }}
                  showSearch
                  placeholder="Selecciona un grado"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={comboGrados}
                />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item 
                label="Sección" 
                name="seccion"
                rules={[
                    {
                      required: true,
                      message: "Por favor, escriba una sección",
                    },
                  ]}
                validateStatus={error?.seccion?.length ? "error" : ""}
                help={
                  error?.seccion?.length ? (
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {error?.seccion.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  ) : ""
                }
                >
                <Input size="middle" placeholder="escriba una curso" />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item 
                label="Especialidad" 
                name="id_especialidad"
                rules={[
                    {
                      required: false,
                      message: "Por favor, seleccion una especialidad",
                    },
                  ]}
                validateStatus={error?.id_especialidad?.length ? "error" : ""}
                help={
                  error?.id_especialidad?.length ? (
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {error?.id_especialidad.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  ) : ""
                }
                >
                <Select
                  style={{ width: '100%' }}
                  showSearch
                  placeholder="Selecciona una especialidad"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={comboEspecialidades}
                />
              </Form.Item>
            </Col>
            <Col xs={24} style={{ textAlign: "end"}}>
              <Button 
                ghost
                size='middle'
                className={'btn-nuevo'}
                style={{marginRight:6}} 
                onClick={toggle} 
                type="primary"
                icon={<CloseOutlined />}>
                  Cancelar
              </Button>
              <Button 
                disabled={isLoading}
                size='middle'
                className='btn-buscar'
                style={{marginRight:6}} 
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}>
                  {isCreate ? 'Guardar' : 'Actualizar'}
              </Button>
              
            </Col>
          </Row>
        </Form>

      </Modal>
    </>
  )
}
