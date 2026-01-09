import React, { useState, useEffect, useContext } from "react";
import {  UserOutlined, DollarOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Card,
  Button,
  Row,
  Col,
  Collapse,
  Tooltip,
} from "antd";
import { MovimientosTable } from "./MovimientosTable";
import { CrearActualizarCreditoModal } from "../modals/CrearActualizarCreditoModal";
import { CreditoContext } from "../context/CreditoContextProvider";

export const CreditoCollapse = ({filtros, id_cliente}) => {

  const { credito } = useContext(CreditoContext);
  const [modalCrearActualizar, setModalCrearActulizar] = useState(false);
  const toggleModalCrear  = ()=>{ setModalCrearActulizar(!modalCrearActualizar); }

  useEffect(() => {
    //consultaCreditos({ id: id });
  }, []);

  return (
    <>
      <Collapse
        defaultActiveKey={["1"]}
        size="small" 
        bordered={false} 
        items={[
          {
            key: "1",
            label: (
              <Row style={{ width: "100%" }}>

                <Col xs={6} >
                    <Card>
                        <Card.Grid
                            style={{
                                padding: "10px",
                                width: "100%",
                                height:"90px",
                                minHeight: "70px",
                                maxHeight: "90px",
                                cursor: "default",
                            }}
                        >
                        <div>
                            <span style={{ color: "#797979" }}>
                            <UserOutlined /> #. Identificación
                            </span>
                        </div>
                        <p className="m-0" style={{ fontSize: "13px", textAlign: "center" }}>
                            {credito?.cliente?.numero_identificacion}
                        </p>
                        </Card.Grid>
                    </Card>
                </Col>

                <Col xs={6}>
                    <Card>
                        <Card.Grid
                            style={{
                                padding: "10px",
                                width: "100%",
                                height:"90px",
                                minHeight: "70px",
                                maxHeight: "90px",
                                cursor: "default",
                            }}
                        >
                        <div>
                            <span style={{ color: "#797979" }}>
                            <UserOutlined /> Nombres
                            </span>
                        </div>
                        <p className="m-0" style={{ fontSize: "13px", textAlign: "center" }}>
                            {credito?.cliente?.nombres} {credito?.cliente?.apellidos}
                        </p>
                        </Card.Grid>
                    </Card>
                </Col>

                <Col xs={6}>
                    <Card>
                        <Card.Grid
                            style={{
                                padding: "10px",
                                width: "100%",
                                height:"90px",
                                minHeight: "70px",
                                maxHeight: "90px",
                                cursor: "default",
                            }}
                        >
                        <div>
                            <span style={{ color: "#797979" }}>
                            <DollarOutlined /> Saldo
                            </span>
                        </div>
                        <p className="m-0" style={{ fontSize: "13px", textAlign: "center" }}>
                            ${credito?.saldo}
                        </p>
                        </Card.Grid>
                    </Card>
                </Col>

                <Col xs={6}>
                    <Card>
                        <Card.Grid
                            style={{
                                padding: "10px",
                                width: "100%",
                                height:"90px",
                                minHeight: "70px",
                                maxHeight: "90px",
                                cursor: "default",
                            }}
                        >
                        <div>
                            <span style={{ color: "#797979" }}>
                            <DollarOutlined /> Reporte
                            </span>
                        </div>
                        <p className="m-0" style={{ fontSize: "7px", textAlign: "center" }}>
                            <Tooltip title="Buscar">
                                <Button 
                                    className='btn-buscar'
                                    style={{marginRight:6}} 
                                    shape="circle" 
                                    type="primary"
                                    onClick={ (e) => {
                                        e.stopPropagation()
                                        toggleModalCrear()
                                    }} 
                                    icon={<PlusOutlined />}
                                />
                            </Tooltip>
                        </p>
                        </Card.Grid>
                    </Card>
                </Col>

              </Row>
            ),
            children: (
              <Row>
                <Col xs={24}>
                  <MovimientosTable
                        filtros={filtros}
                    />
                </Col>
              </Row>
            ),
          },
        ]}
      />

      {/* componentes modales */}
        <CrearActualizarCreditoModal
            open={modalCrearActualizar}
            toggle={toggleModalCrear}
            titulo={'Crear Crédito'}
            id_cliente={id_cliente}
        />
    </>
  );
};
