import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Form, Input, Select } from 'antd';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { ControlVentaContext } from '../context/ControlVentaContextProvider';


export const ActualizarEstadoVentaModal = ({
  open = false,
  toggle = () => {},
  venta = {},
  titulo = 'Gestionar Estado de Venta',
}) => {
  const { updateEstadoGestion, isLoading, contextHolder, contextHolder2, consultaVentas } = useContext(ControlVentaContext);
  const [form] = Form.useForm();
  const [error, setError] = useState({});

  // Observa el valor del campo 'estado_gestion' en tiempo real
  const estadoActual = Form.useWatch('estado_gestion', form);

  const opcionesEstado = [
    { label: 'PAGADO', value: 'PAGADO' },
    { label: 'PENDIENTE', value: 'PENDIENTE' },
    { label: 'ANULADO', value: 'ANULADO' },
  ];


  const onFinish = async (values) => {
    const response = await updateEstadoGestion(values);
    if (response.ok) {
      consultaVentas(); // Refrescar la tabla
      toggle();
    } else {
      if (response?.error?.formulario) {
        setError(response.error.formulario);
      }
    }
  };

  useEffect(() => {
    if (open) {
      setError({});
      if (venta) {
        form.setFieldsValue({
          id: venta.id,
          estado_gestion: venta.estado_gestion,
          motivo: venta?.motivo || '',
        });
      }
    }
  }, [venta, open, form]);

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
        width={{ xs: '90%', md: '30%' }}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={[12, 12]}>
            <Form.Item hidden name="id">
              <Input type="hidden" />
            </Form.Item>

            <Col xs={24}>
              <Form.Item
                label="Estado de la Venta"
                name="estado_gestion"
                rules={[{ required: true, message: 'Seleccione un estado' }]}
              >
                <Select 
                  placeholder="Selecciona un estado"
                  options={opcionesEstado} />
              </Form.Item>
            </Col>

            {/* Renderizado condicional: Solo si es ANULADO */}
            {estadoActual === 'ANULADO' && (
              <Col xs={24}>
                <Form.Item
                  label="Motivo de Anulación"
                  name="motivo"
                  rules={[{ required: true, message: 'El motivo es obligatorio para anular' }]}
                  validateStatus={error?.motivo ? "error" : ""}
                  help={error?.motivo?.[0]}
                >
                  <Input.TextArea 
                    rows={4} 
                    placeholder="Escriba el motivo por el cual anula esta venta..." 
                  />
                </Form.Item>
              </Col>
            )}

            <Col xs={24} style={{ textAlign: "end", marginTop: 10 }}>
              <Button 
                style={{ marginRight: 8 }} 
                onClick={toggle} 
                icon={<CloseOutlined />}
              >
                Cancelar
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isLoading} 
                icon={<SaveOutlined />}
              >
                Actualizar
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};