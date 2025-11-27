import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

export const BreadCrumbComponent = ({ titulo = '', modulo = '', items = [] }) => {
  
  const itemRender = (currentRoute, params, routes, paths) => {
    const isLast = currentRoute?.path === routes[routes.length - 1]?.path;

    return isLast ? (
       <span style={{ borderBottom: '2px solid #8baedfff', paddingBottom: 2 }}>
            {currentRoute.title}
        </span>
    ) : (
      <Link to={`/${paths.join("/")}`}>{currentRoute.title}</Link>
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
