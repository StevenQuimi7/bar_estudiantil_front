// components/ResumenVenta.jsx
import React, { useContext } from "react";
import { Card, Row, Col, Button, Switch, Space } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { VentaDiariaContext } from "../context/VentaDiariaContextProvider";

export const ResumenVenta = () => {
  const { subtotal, setPagado, total, detalle, guardar } =
    useContext(VentaDiariaContext);

  return (
    <>
      <Row justify={"end"} style={{marginTop:"2px"}}>
        {/*
        <Col xs={24} md={8}>
          <Card>
            <Card.Grid style={{width:"100%", height:"80px", maxHeight:"80px"}}>
              <div style={{ color: "#888" }}>Subtotal</div>
              <strong>{subtotal.toFixed(2)}</strong>
            </Card.Grid>
          </Card>

        </Col>

        
        <Col xs={24} md={8}>
          <Card>
              <Card.Grid style={{width:"100%", height:"80px", maxHeight:"80px"}}>
                <div style={{ color: "#888" }}>IVA (12%)</div>
                <strong>${iva.toFixed(2)}</strong>
              </Card.Grid>

          </Card>
        
        </Col>
        */}

        <Col xs={24} md={8}>
          <Card>
              <Card.Grid style={{width:"100%", height:"80px", maxHeight:"80px"}}>
                <div style={{ color: "#888", marginBottom: 4 }}>Estado de Venta</div>
                <Space>
                  <Switch 
                    checkedChildren="PAGADO" 
                    unCheckedChildren="PENDIENTE" 
                    defaultChecked 
                    onChange={(checked) => setPagado(checked)}
                  />
                </Space>
              </Card.Grid>

          </Card>
        
        </Col>

        <Col xs={24} md={8}>
          <Card>

              <Card.Grid style={{width:"100%", height:"80px", maxHeight:"80px"}}>
                <div style={{ color: "#888" }}>Total</div>
                <strong style={{ fontSize: 20 }}>
                  ${total.toFixed(2)}
                </strong>
              </Card.Grid>
          </Card>
        
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Card.Grid 
              style={{
                width:"100%", height:"80px", maxHeight:"80px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                type="primary"
                icon={<SaveOutlined />}
                disabled={detalle.length === 0}
                onClick={() => guardar()}
              >
                Guardar Venta
              </Button>
            </Card.Grid>
          </Card>
        </Col>
      </Row>
    </>
  );
};
