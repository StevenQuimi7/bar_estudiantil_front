import React, { useState, useEffect, useContext } from "react";
import { PerfilContext } from "../context/PerfilContextProvider";
import { BreadCrumbComponent } from "../../../components/BreadCrumbComponent";
import {
  HomeOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Card,
  Button,
  Form,
  Input,
  Row,
  Col,
  Space,
  Switch,
} from "antd";

import { useSelector } from 'react-redux';


export const Perfils = () => {
  const {
    consultaMiPerfil,
    miPerfil,
    updateUsuario,
    isLoading,
    contextHolder,
  } = useContext(PerfilContext);

  const user = useSelector((state) => state.auth.user);


  const [form] = Form.useForm();
  const [error, setError] = useState({});
  const [cambiarPassword, setCambiarPassword] = useState(false);

  const ITEMS = [
    { path: "", title: <HomeOutlined /> },
    { path: "perfil", title: "Mi Perfil" },
  ];

  useEffect(() => {
    consultaMiPerfil({ id_usuario: user.id });
  }, []);

  useEffect(() => {
    if (miPerfil) {
      form.setFieldsValue({
        nombres: miPerfil.nombres,
        apellidos: miPerfil.apellidos,
        email: miPerfil.email,
      });
    }
  }, [miPerfil]);

  const onFinish = async (values) => {
    const payload = {
      id: miPerfil.id,
      nombres: values.nombres,
      apellidos: values.apellidos,
      email: values.email,
    };

    if (cambiarPassword) {
      payload.password = values.password;
      payload.password_confirmation = values.password_confirmation;
    }

    const response = await updateUsuario(payload);

    if(response.ok){
      form.setFieldsValue({
        password: "",
        password_confirmation: "",
      })
      setCambiarPassword(false);
    }else{
      if(response?.error?.formulario !== null){
        setError(response.error.formulario);
      }
    }
  };
  

  return (
    <>
      {contextHolder}

      <BreadCrumbComponent
        titulo="Mantenimiento"
        modulo="Módulo de Perfil"
        items={ITEMS}
      />

      <Space style={{ width: "100%" }} direction="vertical" size="small">
        <Card title="Mi Información">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Nombres"
                  name="nombres"
                  rules={[{ required: true, message: "Ingrese nombres" }]}
                  validateStatus={error?.nombres?.length ? "error" : ""}
                  help={
                    error?.nombres?.length ? (
                      <ul style={{ margin: 0, paddingLeft: "20px" }}>
                        {error?.nombres.map((err, index) => (
                          <li key={index}>{err}</li>
                        ))}
                      </ul>
                    ) : ""
                  }
                >
                  <Input placeholder="Nombres" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Apellidos"
                  name="apellidos"
                  rules={[{ required: true, message: "Ingrese apellidos" }]}
                  validateStatus={error?.apellidos?.length ? "error" : ""}
                  help={
                    error?.apellidos?.length ? (
                      <ul style={{ margin: 0, paddingLeft: "20px" }}>
                        {error?.apellidos.map((err, index) => (
                          <li key={index}>{err}</li>
                        ))}
                      </ul>
                    ) : ""
                  }
                >
                  <Input placeholder="Apellidos" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Email" name="email">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Cambiar contraseña">
                  <Switch
                    checked={cambiarPassword}
                    onChange={setCambiarPassword}
                  />
                </Form.Item>
              </Col>

              {cambiarPassword && (
                <>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Nueva contraseña"
                      name="password"
                      rules={[
                        { required: true, message: "Ingrese la contraseña" },
                        { min: 6, message: "Mínimo 6 caracteres" },
                      ]}
                      validateStatus={error?.password?.length ? "error" : ""}
                      help={
                        error?.password?.length ? (
                          <ul style={{ margin: 0, paddingLeft: "20px" }}>
                            {error?.password.map((err, index) => (
                              <li key={index}>{err}</li>
                            ))}
                          </ul>
                        ) : ""
                      }
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Confirmar contraseña"
                      name="password_confirmation"
                      dependencies={["password"]}
                      rules={[
                        { required: true, message: "Confirme la contraseña" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              !value ||
                              getFieldValue("password") === value
                            ) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Las contraseñas no coinciden")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                </>
              )}
            </Row>

            <Row justify="end">
              <Button
                disabled={isLoading}
                size="middle"
                className="btn-buscar"
                style={{ marginRight: 6 }}
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
              >
                Actualizar
              </Button>
            </Row>
          </Form>
        </Card>
      </Space>
    </>
  );
};
