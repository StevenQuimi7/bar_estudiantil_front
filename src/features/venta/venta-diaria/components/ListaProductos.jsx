import React, { useContext } from "react";
import { Card, Input, List, Button, Select, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { VentaDiariaContext } from "../context/VentaDiariaContextProvider";

export const ListaProductos = () => {
  const { busqueda, setBusqueda, productos, agregarProducto, clienteSeleccionado, setClienteSeleccionado, comboClientes } = useContext(VentaDiariaContext);

  return (
    <>
      <Space style={{width:"100%"}} direction="vertical" size={"small"}>

        <Card title="Cliente">
          <Select
            style={{ width: "100%" }}
            placeholder="Seleccione cliente"
            value={clienteSeleccionado}
            onChange={(value) => setClienteSeleccionado(value)}
            options={comboClientes}
          />
        </Card>
        <Card title="Productos">
          <Input
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ marginBottom: 10 }}
          />

          <div style={{ maxHeight: 320, overflowY: "auto" }}>
            <List
              dataSource={productos?.data}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      type="primary"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => agregarProducto(item)}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    title={item.nombre}
                    description={`$${item.precio.toFixed(2)}`}
                  />
                </List.Item>
              )}
            />
          </div>
        </Card>
      </Space>
    </>
  );
};
