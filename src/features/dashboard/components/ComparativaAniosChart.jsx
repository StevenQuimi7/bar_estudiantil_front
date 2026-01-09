import { Line } from '@ant-design/charts';
import { useContext } from 'react';
import { DashboardContext } from '../context/DashboardContextProvider';

export const ComparativaAnosChart = () => {
  const { comparativaAnios } = useContext(DashboardContext);

  const config = {
    data: comparativaAnios || [],
    xField: 'mes',
    yField: 'monto',
    seriesField: 'anio', // Laravel devuelve "2024" o "2025"
    smooth: true,
    color: ['#1890ff', '#f5222d'],
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: { fill: '#aaa' },
    },
    tooltip: {
      shared: true,
      showMarkers: true,
    },
    // Esto hace que la leyenda sea interactiva (puedes ocultar un año haciendo clic)
    legend: {
      position: 'top',
    },
  };

  return <Line {...config} />;
};