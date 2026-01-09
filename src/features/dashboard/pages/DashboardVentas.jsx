import { useCallback, useContext, useEffect, useState } from 'react';
import { Row, Col, Card, Select, Space, Typography, DatePicker } from 'antd';
import { TopFiveChart } from '../components/TopFiveChart';
import { VentasMensualesChart } from '../components/VentasMensualesChart';
import { ComparativaAnosChart } from '../components/ComparativaAniosChart';
import { BreadCrumbComponent } from '../../../components/BreadCrumbComponent';
import { DashboardContext } from '../context/DashboardContextProvider';
import { HomeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export const DashboardVentas = () => {

  const { isLoading, consultaTopFive, consultaVentasMeses, consultaComparativaAnios, topFive, contextHolder } = useContext(DashboardContext);

  const ITEMS = [
    { path: '', title: <HomeOutlined /> },
    { path: 'dashboards', title: 'Dashboard' }
  ];

  const { Text } = Typography;
  const [anioFiltro, setAnioFiltro] = useState(dayjs());
  // Estados iniciales con dayjs para que el DatePicker los entienda
  const [anioInicio, setAnioInicio] = useState(dayjs().subtract(1, 'year'));
  const [anioFin, setAnioFin] = useState(dayjs());

  const fetchData = useCallback (async() => {
    try {
      await Promise.all([
        consultaTopFive(), 
        consultaVentasMeses(), 
        consultaComparativaAnios()
      ]);
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
    }
  },[]);


  
  useEffect(() => {
    // Al cargar o cambiar el año, llamamos a la API
    // .year() extrae el entero (ej: 2025)
    consultaVentasMeses({anio:anioFiltro.year()});
  }, [anioFiltro]);

  
  useEffect(() => {
    // Extraemos solo el número del año (.year()) para enviarlo a Laravel
    const VALUES = { anioInicio: anioInicio.year(), anioFin: anioFin.year() };
    consultaComparativaAnios(VALUES);
  }, [anioInicio, anioFin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {contextHolder}
      <BreadCrumbComponent
        titulo='Auditoria'
        modulo='Módulo de Auditorias'
        items={ITEMS}
      />
      <Space style={{width:"100%"}} direction="vertical" size={"small"}>
        <Row gutter={[16, 16]}>
          {/* Fila de Top 5 */}
          <Col xs={24} lg={8}>
            <Card title={`Top 5 Clientes - ${dayjs().year()}`} loading={isLoading}>
              <TopFiveChart data={topFive?.clientes} color="#52c41a" />
            </Card>
          </Col>
          
          <Col xs={24} lg={8}>
            <Card title={`Top 5 Productos - ${dayjs().year()}`} loading={isLoading}>
              <TopFiveChart data={topFive?.productos} color="#faad14" />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title={`Top 5 Vendedores - ${dayjs().year()}`} loading={isLoading}>
              <TopFiveChart data={topFive?.usuarios} color="#13c2c2" />
            </Card>
          </Col>

          {/* Fila de Ventas Mensuales */}
          <Col xs={24}>
            <Card 
              title="Ventas Mensuales" 
              loading={isLoading} // El card muestra un skeleton mientras carga
              extra={
                <Space>
                  <span>Año:</span>
                  <DatePicker 
                    picker="year" 
                    value={anioFiltro}
                    onChange={(date) => {
                      if (date) setAnioFiltro(date);
                    }}
                    allowClear={false} // Evita que quede vacío
                    style={{ width: 120 }}
                  />
                </Space>
              }
            >
              <VentasMensualesChart />
            </Card>
          </Col>

          {/* Fila de Comparación */}
          <Col xs={24}>
            <Card 
              title="Comparativa de Ventas Interanual" 
              loading={isLoading}
              extra={
                <Space wrap>
                  <Space>
                    <Text type="secondary">Año A:</Text>
                    <DatePicker 
                      picker="year" 
                      value={anioInicio}
                      onChange={(date) => date && setAnioInicio(date)}
                      allowClear={false}
                      style={{ width: 110 }}
                    />
                  </Space>
                  
                  <Text strong style={{ color: '#bfbfbf' }}>vs</Text>
                  
                  <Space>
                    <Text type="secondary">Año B:</Text>
                    <DatePicker 
                      picker="year" 
                      value={anioFin}
                      onChange={(date) => date && setAnioFin(date)}
                      allowClear={false}
                      style={{ width: 110 }}
                    />
                  </Space>
                </Space>
              }
            >
              <div style={{ height: 400 }}>
                <ComparativaAnosChart />
              </div>
            </Card>
          </Col>
        </Row>
      </Space>
    </>
  );
};