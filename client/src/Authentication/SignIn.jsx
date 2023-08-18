import React, { useEffect, useState, useContext } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import UserAPI from "../API/UserAPI";
import { Button, Form, Input, Spin } from "antd";
import Swal from "sweetalert2";
import { valuesContext } from "../App";
import styled from "./Auth.module.css";

function SignIn(props) {
  const [load, setLoad] = useState(false);
  const [form] = Form.useForm();
  const [err, seterr] = useState([]);

  const history = useHistory();
  const location = useLocation();
  console.log(location);

  const auth = useContext(valuesContext).loadAuth;
  window.scrollTo(0, 143);
  const onFinish = async (values) => {
    try {
      seterr([]);
      setLoad(true);
      const res = await UserAPI.postSignIn(values);
      if (res.message === "Đăng nhập thành công") {
        localStorage.setItem("User", res.token);
        auth(true);
        if (
          location?.state?.pathName === "/signup" ||
          location?.state?.pathName === "/forgot-password"
        ) {
          history.replace("/");
        } else {
          history.goBack(-1);
        }
      }
    } catch (err) {
      setLoad(false);
      console.log(err.response);
      if (err.response) seterr(err.response.data.errors);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const checkErr = (items) => {
    const test = err?.find((x) => x.path === items);
    return test;
  };

  return (
    <Spin
      tip="...Loading"
      size="large"
      spinning={load ? true : false}
      style={{ top: 100 }}
    >
      <div className={styled.font_Signin}>
        <Form
          name="basic"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <h1>Đăng Nhập</h1>
          <p style={{ visibility: err.length > 0 ? "" : "hidden" }}>
            <i> {err.length > 0 && err[0].msg}</i>
          </p>
          <Form.Item
            label="Tên đăng nhập"
            name="TenDangNhap"
            rules={[
              {
                required: true,
                message: "Tên đăng nhập không được để trống!",
              },
              { max: 100, message: "Số ký tự không được vượt quá 100 ký tự" },
              () => ({
                validator(_, value) {
                  if (form.getFieldValue("TenDangNhap").includes("@")) {
                    if (
                      !value ||
                      new RegExp(
                        /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.(com|vn)$/g
                      ).test(value)
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Email không hợp lệ"));
                  } else {
                    if (!value || new RegExp(/^[a-zA-Z0-9]+$/i).test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Tên đăng nhập chỉ cho phép các chữ cái (a-z,A-Z) số (0-9)"
                      )
                    );
                  }
                },
              }),
            ]}
          >
            <Input placeholder="Nhập tên đăng nhập hoặc email" />
          </Form.Item>

          <Form.Item
            label="Mật Khẩu"
            name="MatKhau"
            rules={[
              {
                required: true,
                message: "Mật khẩu không được để trống!",
              },
              { max: 50, message: "Số ký tự không được vượt quá 50 ký tự" },
              { min: 8, message: "Số ký tự it nhất là 8 ký tự" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khâu" />
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
            <Button htmlType="submit" style={{ width: "50%" }}>
              Đăng Nhập
            </Button>
          </Form.Item>
          <p>
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </p>
          <p>
            nếu chưa có tài khoản hãy click <Link to="/signup">Đăng Ký!</Link>
          </p>
        </Form>
      </div>
    </Spin>
  );
}

export default SignIn;
