import React from 'react';
import { List, Avatar, Typography, Badge, Space } from 'antd';
import { UserOutlined, TrophyTwoTone } from '@ant-design/icons';

const { Text } = Typography;

export const TopFiveChart = ({ data = [], title = "Top 5" }) => {
  
  // Función para definir el color del ranking (Oro, Plata, Bronce)
  const getBadgeColor = (index) => {
    switch (index) {
      case 0: return '#fadb14'; // Oro
      case 1: return '#bfbfbf'; // Plata
      case 2: return '#ffa940'; // Bronce
      default: return '#f0f0f0'; // Gris normal
    }
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item
          extra={
            <div style={{ textAlign: 'center', minWidth: '60px' }}>
              <div style={{ 
                backgroundColor: '#f0f5ff', 
                border: '1px solid #adc6ff',
                borderRadius: '4px',
                padding: '2px 8px'
              }}>
                <Text strong style={{ fontSize: '18px', color: '#1d39c4', display: 'block', lineHeight: '1.2' }}>
                  {item.total}
                </Text>
              </div>
              <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Cant.
              </Text>
            </div>
          }
        >
          <List.Item.Meta
            avatar={
              <Space size="middle">
                 {/* Número de ranking elegante */}
                <Badge 
                  count={index + 1} 
                  style={{ 
                    backgroundColor: getBadgeColor(index), 
                    color: index < 3 ? '#000' : '#8c8c8c',
                    fontWeight: 'bold'
                  }} 
                />
                <Avatar 
                  icon={index === 0 ? <TrophyTwoTone twoToneColor="#fadb14" /> : <UserOutlined />} 
                  style={{ backgroundColor: index === 0 ? '#fffbe6' : '#f5f5f5', border: index === 0 ? '1px solid #fadb14' : 'none' }}
                />
              </Space>
            }
            title={<Text strong>{item.nombre}</Text>}
            description={`ID: #${index + 100 + (item.id || 0)}`}
          />
        </List.Item>
      )}
    />
  );
};