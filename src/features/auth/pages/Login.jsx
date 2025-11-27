import React, { useState } from "react";
import { Card, Space, Button, Form, Input, Row, Col, Alert } from "antd";
import { LockOutlined, UserOutlined, LoginOutlined } from "@ant-design/icons";
import {AuthService} from "../../../services/auth/AuthService"; 
import { useDispatch } from 'react-redux';
import { setCredentials } from '../authSlice';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  const login = async (values) => {
    try {
      setIsLoading(true);
      setError({});
      const response = await AuthService.login(values)
      if(response.ok){
        const {data, token} = response
        dispatch(setCredentials({ user: data, token: token }));
        navigate('/admin/ventas'); 
        form.resetFields();
      }
    } catch (error) {
      setError({
        formulario: error?.errors ?? {},
        validaciones : error?.msj ?? null
      });
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Space direction="vertical" size={"small"}>
        <Card style={{ width: 500 }}>
          <Form layout="vertical" form={form} onFinish={login}>
            <Row gutter={[4, 4]}>
              <Col xs={24}>
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, escriba un nombre de usuario",
                    },
                  ]}
                  validateStatus={error?.formulario?.username?.length ? "error" : ""}
                  help={
                    error?.formulario?.username?.length ? (
                      <ul style={{ margin: 0, paddingLeft: "20px" }}>
                        {error?.formulario?.username.map((err, index) => (
                          <li key={index}>{err}</li>
                        ))}
                      </ul>
                    ) : ""
                  }
                >
                  <Input size="large" prefix={<UserOutlined />} placeholder="username" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Contraseña"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, escriba su contraseña",
                    },
                  ]}
                  validateStatus={error?.formulario?.password?.length ? "error" : ""}
                  help={
                    error?.formulario?.password?.length ? (
                      <ul style={{ margin: 0, paddingLeft: "20px" }}>
                        {error?.formulario?.password.map((err, index) => (
                          <li key={index}>{err}</li>
                        ))}
                      </ul>
                    ) : ""
                  }
                >
                  <Input.Password size="large" prefix={<LockOutlined />} placeholder="contraseña" />
                </Form.Item>
              </Col>
              {error?.validaciones != null && (
                  <Alert showIcon  style={{ marginBottom: 16, width: "100%" }} message={error?.validaciones} type="error" />
                )}


              <Col xs={24} style={{ textAlign: "end" }}>
                <Button  loading={isLoading} type="primary" htmlType="submit" icon={<LoginOutlined />}>
                  Iniciar Sesión
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Space>
    </div>
  );
};