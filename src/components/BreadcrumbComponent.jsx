import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

export const BreadCrumbComponent = ({ titulo = '', modulo = '', items = [] }) => {
  
  const itemRender = (currentRoute, params, routes, paths) => {
    const isLast = currentRoute?.path === routes[routes.length - 1]?.path;
    
    // Si el path es vacío o es la raíz de admin, forzamos a 'ventas'
    let routePath = paths.join("/");
    if (routePath === "" || routePath === "admin") {
      routePath = "ventas";
    }

    // Aseguramos que siempre empiece con un solo slash
    const finalPath = routePath.startsWith('/') ? routePath : `/${routePath}`;

    return isLast ? (
      <span style={{ 
        color: '#1890ff', 
        fontWeight: 'bold', 
        borderBottom: '2px solid #1890ff', 
        paddingBottom: 2 
      }}>
        
        {currentRoute.title === "admin" ? "Ventas" : currentRoute.title}
      </span>
    ) : (
      <Link to={`/admin${finalPath}`}>
        {currentRoute.title}
      </Link>
    );
  };

  return (
    <>
      <h5 style={{ marginTop: window.innerWidth < 768 ? 0 : 10, marginBottom: window.innerWidth < 768 ? 1 : 2, color: "#8a8484ff" }}>{titulo}</h5>
      <h3 style={{ margin: 0, color: "#5f5c5cff" }}>{modulo}</h3>
      <Breadcrumb
        style={{ margin: "16px 0" }}
        itemRender={itemRender}
        items={items}
      />
    </>
  );
};
