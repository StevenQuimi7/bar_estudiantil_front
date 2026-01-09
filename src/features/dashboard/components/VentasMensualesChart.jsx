import React, { useContext } from 'react';
import { Column } from '@ant-design/charts';
import { DashboardContext } from '../context/DashboardContextProvider';

export const VentasMensualesChart = () => {
  const { ventasMeses } = useContext(DashboardContext);

  const config = {
    data: ventasMeses || [],
    xField: 'mes',
    yField: 'monto',
    color: '#1890ff',
    // Estilo de las barras
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    // Configuración de etiquetas sobre las barras
    label: {
      position: 'top',
      style: { 
        fill: '#8c8c8c',
        opacity: 0.6,
      },
      formatter: (datum) => datum.monto > 0 ? `$${datum.monto.toLocaleString()}` : '',
    },
    // Tooltip mejorado
    tooltip: {
      formatter: (datum) => {
        return { name: 'Ventas', value: `$ ${datum.monto.toLocaleString()}` };
      },
    },
  };

  return <Column {...config} />;
};