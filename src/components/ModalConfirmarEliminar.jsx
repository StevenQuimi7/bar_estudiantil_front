import React from 'react';
import { Modal, Button, Space, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const ModalConfirmarEliminar = ({
  modalEliminar = false,
  toggle = () => {},
  Eliminar = () => {},
  mensaje = '¿Está seguro de eliminar este registro?',
  titulo = 'Eliminar Registro',
  tituloBtn = 'Eliminar',
}) => {
  return (
    <Modal
      open={modalEliminar}
      onCancel={toggle}
      centered
      footer={null}
      closable={false}
      width={400}
    >
      <Space direction="horizontal" size={12} style={{ alignItems: 'center', marginBottom: 16 }}>
        <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 24, marginRight: 8 }} />
        <Text strong style={{ fontSize: 16 }}>{titulo}</Text>
      </Space>
      <br/>
      <Text style={{textAlign:"center"}}>{mensaje}</Text>
      <div style={{ marginTop: 24, textAlign: 'right' }}>
        <Button onClick={toggle} style={{ marginRight: 8 }}>
          Cancelar
        </Button>
        <Button
          type="primary"
          danger
          onClick={() => {
            Eliminar();
            toggle();
          }}
        >
          {tituloBtn}
        </Button>
      </div>
    </Modal>
  );
};
