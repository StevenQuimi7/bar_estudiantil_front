// VentaDiarias.jsx
import React, { useContext, useEffect } from "react";
import { Row, Col, Space } from "antd";
import { BreadCrumbComponent } from "../../../../components/BreadCrumbComponent";
import { VentaDiariaContext } from "../context/VentaDiariaContextProvider";
import { ListaProductos } from "../components/ListaProductos";
import { DetalleVentaDiariaTable } from "../components/DetalleVentaDiariaTable";
import { ResumenVenta } from "../components/ResumenVenta";

export const VentaDiarias = () => {
  const { consultaProductos, contextHolder, getComboClientes } = useContext(VentaDiariaContext);

  const fetchData = async () => {
    try{
      await Promise.all([consultaProductos(), getComboClientes()]);
    }catch(error){
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {contextHolder}

      <BreadCrumbComponent
        titulo="Ventas"
        modulo="Módulo de Ventas"
        items={[
          { path: "", title: "Home" },
          { path: "ventas", title: "Ventas" },
          { path: "ventas-diarias", title: "Ventas Diarias" },
        ]}
      />

      <Space style={{width:"100%"}} direction="vertical" size={"small"}>

        <Row gutter={[6, 6]}>
          <Col xs={24} md={8}>
            <ListaProductos />
          </Col>

          <Col xs={24} md={16}>
            <DetalleVentaDiariaTable />
            <Row justify="end">
              <Col xs={24}>
                <ResumenVenta />
              </Col>
            </Row>
          </Col>
        </Row>
      </Space>

    </>
  );
};
