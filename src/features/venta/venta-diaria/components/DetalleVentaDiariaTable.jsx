// components/DetalleVentaDiariaTable.jsx
import React, { useContext } from "react";
import { Card, Table, InputNumber, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { VentaDiariaContext } from "../context/VentaDiariaContextProvider";

export const DetalleVentaDiariaTable = () => {
  const { detalle, cambiarCantidad, eliminarItem } =
    useContext(VentaDiariaContext);

  const columns = [
    { title: "Producto", dataIndex: "nombre" },
    {
      title: "Precio",
      dataIndex: "precio",
      render: (v) => `$${v.toFixed(2)}`,
    },
    {
      title: "Cantidad",
      render: (_, r) => (
        <InputNumber
          min={1}
          value={r.cantidad}
          onChange={(v) => cambiarCantidad(r.id, v)}
        />
      ),
    },
    {
      title: "Total",
      render: (_, r) => `$${(r.precio * r.cantidad).toFixed(2)}`,
    },
    {
      title: "Acciones",
      render: (_, r) => (
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => eliminarItem(r.id)}
        />
      ),
    },
  ];

  return (
    <Card title="Detalle de Venta">
      <Table
        rowKey="id"
        columns={columns}
        dataSource={detalle}
        pagination={false}
        scroll={{ y: 320 }}
      />
    </Card>
  );
};
