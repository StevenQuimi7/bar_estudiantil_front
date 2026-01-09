import React, {useContext, useEffect, useState } from 'react'
import { Modal, Button, Row, Col, Form, Input, Select } from 'antd'
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { CreditoContext } from '../context/CreditoContextProvider';
export const CrearActualizarCreditoModal = ({
  open=false,
  toggle=()=>{},
  titulo='',
  id_cliente=0
}) => {
  
  const { 
    storeCredito, 
    contextHolder, contextHolder2,
    consultaCredito,
    isLoading,
    credito
  } = useContext(CreditoContext);
  
  const [form] = Form.useForm();
  const [error, setError] = useState({});
  const onFinish = (values) =>{
    guardar(values) 
  }

  const guardar = async(values)=>{
    values.id_cliente = id_cliente
    values.credito_cliente = credito
    const response = await storeCredito(values);
    if(response.ok){
      consultaCredito({id_cliente: id_cliente});
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
      setError({});
      form.resetFields();
    }
  }, [ form, open]);

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
          md:'35%'
        }}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={[4, 4]}>
            
            {/* ID oculto */}
            <Form.Item hidden name="id">
              <Input type="hidden" />
            </Form.Item>

            {/* TIPO */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Tipo"
                name="tipo"
                rules={[
                  { required: true, message: "Por favor, selecciona un tipo" },
                ]}
                validateStatus={error?.tipo?.length ? "error" : ""}
                help={
                  error?.tipo?.length ? (
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {error?.tipo.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  ) : ""
                }
              >
                <Select
                  placeholder="Selecciona un tipo"
                  options={[
                    { label: "Reverso", value: "REVERSO" },
                    { label: "Abono", value: "ABONO" },
                  ]}
                  onChange={() => {
                    // limpiar descripción cuando cambia tipo
                    form.setFieldsValue({ descripcion: "" });
                  }}
                />
              </Form.Item>
            </Col>

            {/* MONTO */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Monto"
                name="monto"
                rules={[
                  { required: true, message: "Por favor, ingrese el monto" },
                ]}
                validateStatus={error?.monto?.length ? "error" : ""}
                help={
                  error?.monto?.length ? (
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {error?.monto.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  ) : ""
                }
              >
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Ingrese el monto"
                />
              </Form.Item>
            </Col>

            {/* DESCRIPCIÓN — solo si tipo = reverso */}
            <Col xs={24}>
              <Form.Item shouldUpdate={(prev, next) => prev.tipo !== next.tipo}>
                {() => {
                  const tipo = form.getFieldValue("tipo");
                  return (
                    <Form.Item
                      label="Descripción"
                      name="descripcion"
                      rules={
                        tipo === "REVERSO"
                          ? [{ required: true, message: "Por favor, escriba la descripción" }]
                          : []
                      }
                      validateStatus={error?.descripcion?.length ? "error" : ""}
                      help={
                        error?.descripcion?.length ? (
                          <ul style={{ margin: 0, paddingLeft: "20px" }}>
                            {error?.descripcion.map((err, index) => (
                              <li key={index}>{err}</li>
                            ))}
                          </ul>
                        ) : ""
                      }
                    >
                      <Input.TextArea
                        placeholder="Escriba la descripción"
                        disabled={tipo !== "REVERSO"}
                        rows={3}
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Col>

            {/* BOTONES */}
            <Col xs={24} style={{ textAlign: "end" }}>
              <Button
                ghost
                size="middle"
                className="btn-nuevo"
                style={{ marginRight: 6 }}
                onClick={toggle}
                type="primary"
                icon={<CloseOutlined />}
              >
                Cancelar
              </Button>

              <Button
                disabled={isLoading}
                size="middle"
                className="btn-buscar"
                style={{ marginRight: 6 }}
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
              >
                Guardar
              </Button>
            </Col>

          </Row>
        </Form>


      </Modal>
    </>
  )
}
