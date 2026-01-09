// components/MenuGridCard.jsx
import { Card, Col } from "antd";

export const MenuGridCard = ({ items }) => {
  return (
    <>
      {items.map((item, index) => (
        <Col xs={24} sm={12} md={8} lg={8} key={index}>
          <Card>
            <Card.Grid
              onClick={item.onClick}
              style={{
                padding: "12px",
                width: "100%",
                height: "90px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center", // centra verticalmente
              }}
            >
              {/* Icono + título */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: 23, color: "#797979" }}>
                  {item.icon}
                </span>

                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#797979",
                  }}
                >
                  {item.label}
                </span>
              </div>

              {/* Extra opcional */}
              {item.extra && (
                <p
                  className="m-0"
                  style={{
                    fontSize: "9px",
                    textAlign: "center",
                    marginTop: 6,
                  }}
                >
                  {item.extra}
                </p>
              )}
            </Card.Grid>
          </Card>
        </Col>
      ))}
    </>
  );
};
