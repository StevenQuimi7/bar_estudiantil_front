import { Row } from "antd";
import { DollarOutlined, BarChartOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { MenuGridCard } from "../../../components/MenuGridCard";
import { BreadCrumbComponent } from "../../../components/BreadCrumbComponent";

export const Ventas = () => {
  const navigate = useNavigate();

  const ITEMS = [
    { path: '', title: <HomeOutlined /> },
    { path: "ventas", title: "Ventas" }
  ];

  const menuItems = [
    {
      label: "Ventas diarias",
      icon: <DollarOutlined />,
      onClick: () => navigate("ventas-diarias"),
    },
    {
      label: "Control de ventas",
      icon: <BarChartOutlined />,
      onClick: () => navigate("control-ventas"),
    },
  ];

  return (
    <>
      <BreadCrumbComponent
        titulo="Ventas"
        modulo="Módulo de Ventas"
        items={ITEMS}
      />

      <Row gutter={[16, 16]}>
        <MenuGridCard items={menuItems} />
      </Row>
    </>
  );
};
