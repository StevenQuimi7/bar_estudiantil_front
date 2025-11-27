import React, { useState, useEffect, Suspense, Children } from "react";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DropboxOutlined,
  UsergroupAddOutlined,
  TeamOutlined,
  ProductOutlined,
  InsertRowBelowOutlined,
  OrderedListOutlined,
  BookOutlined,
  HolderOutlined,
  SafetyCertificateOutlined,
  AuditOutlined,
  SettingOutlined,
  LogoutOutlined,
  UnlockOutlined
} from "@ant-design/icons";
import { Layout, Menu, Drawer, Button, Spin } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import logo from "../assets/images/edubar-logo.png";
import { AuthService } from "../services/auth/AuthService";
import { useDispatch } from 'react-redux';
import { logout } from "../features/auth/authSlice";

const { Content, Footer, Sider } = Layout;

const items = [
  { key: "ventas", icon: <ShoppingCartOutlined />, label: "Ventas", route: "/admin/ventas" },
  { key: "productos", icon: <DropboxOutlined />, label: "Productos", route: "/admin/productos" },
  { key: "clientes", icon: <UsergroupAddOutlined />, label: "Clientes", route: "/admin/clientes" },
  { key: "estudiantes", icon: <TeamOutlined />, label: "Estudiantes", route: "/admin/estudiantes" },
  { key: "categorias", icon: <ProductOutlined />, label: "Categorías", route: "/admin/categorias" },
  { key: "cursos", icon: <InsertRowBelowOutlined />, label: "Cursos", route: "/admin/cursos" },
  { key: "niveles", icon: <HolderOutlined />, label: "Niveles", route: "/admin/niveles" },
  { key: "grados", icon: <OrderedListOutlined />, label: "Grados", route: "/admin/grados" },
  { key: "especialidades", icon: <BookOutlined />, label: "Especialidades", route: "/admin/especialidades" },
  { key: "roles_permisos", icon: <SafetyCertificateOutlined />, label: "Roles y permisos", route: "/admin/roles_permisos" },
  { key: "usuarios", icon: <UserOutlined />, label: "Usuarios", route: "/admin/usuarios" },
  { key: "auditorias", icon: <AuditOutlined />, label: "Auditorias", route: "/admin/auditorias" },
  { key: "configuracion", icon: <SettingOutlined />, label: "Configuración", route: "/admin/configuracion", children: [
    { key: "mi_perfil", icon: < UnlockOutlined/>, label: "Mi perfil", route: "/admin/mi_perfil"},
    { key: "logout", icon: <LogoutOutlined />, label: "Cerrar sesión"},
  ]},
];

export const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const selectedKey = items.find(item => location.pathname.startsWith(item.route))?.key;

  // Detectar cambio de tamaño de ventana
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await AuthService.logout();
      if(response.ok){
        dispatch(logout()); 
        setTimeout(() => {
          navigate('/login');
        }, 100);
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleMenuClick = ({ key }) => {

    if(key === 'logout'){
      handleLogout()
    }

    const selectedItem = items.find(item => item.key === key);
    if (selectedItem) {
      navigate(selectedItem.route);
      if (isMobile) setDrawerVisible(false); // cerrar drawer en móvil
    }
  };

  const siderStyle = {
    overflow: "auto",
    height: "100dvh",
    position: "sticky",
    top: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: 'stable',
  };

  return (
    <Layout hasSider>
      {!isMobile && (
        <Sider
          style={siderStyle}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
        >
          <div style={{ width: "100%", padding: "15px 0 20px 25px" }}>
            <img src={logo} style={{ width: 40, height: 40 }} alt="Logo" />
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            items={items}
          />
        </Sider>
      )}

      <Layout>
        {isMobile && (
          <>
            <Button
              type="primary"
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
              style={{ margin: 16 }}
            />
            <Drawer
              title={<img src={logo} style={{ width: 65, height: 65 }} alt="Logo" />}
              placement="left"
              closable
              onClose={() => setDrawerVisible(false)}
              open={drawerVisible}
              width={280}
            >
              <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                onClick={handleMenuClick}
                items={items}
              />
            </Drawer>
          </>
        )}

        <Content style={{ margin: "0 12px" }}>
          <Suspense
            fallback={
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  zIndex: 9999,
                }}
              >
                <Spin size="large" tip="Cargando..." />
              </div>
            }
          >
            <div style={{ padding: 4, minHeight: 360 }}>
              <Outlet />
            </div>
          </Suspense>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          {new Date().getFullYear()} Created by JQP
        </Footer>
      </Layout>
    </Layout>
  );
};
