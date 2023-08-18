import React, { useEffect, useState, useContext } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import UserAPI from "../API/UserAPI";
import { Button, Form, Input, Spin } from "antd";
import Swal from "sweetalert2";
import { valuesContext } from "../App";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styled from "./Auth.module.css";

function ForgotPassword(props) {
  const [load, setLoad] = useState(false);
  const [form] = Form.useForm();
  const [maXacNhan, setMaXacNhan] = useState(false);
  const [ma, setMa] = useState("");

  const history = useHistory();
  const location = useLocation();

  //thông báo tự đông chuyển trang
  const notify = () =>
    toast.success("Chuẩn bị chuyến đến màng hình đăng nhập!", {
      autoClose: 3000,
      onClose: () => history.push("/signin", { pathName: location.pathname }),
    });

  window.scrollTo(0, 143);

  const onFinish = async (values) => {
    // console.log("Success:" /*, values*/);
    try {
      if (maXacNhan) {
        values.userId = ma?.userId;
        setLoad(true);
        const res = await UserAPI.postUserResetPassword(
          values,
          "Breare " + ma?.token
        );
        if (
          res.message ===
          "đặt lại mật khẩu thành công thành công! Vui lòng kiếm tra hòm thư của bạn"
        ) {
          setLoad(false);
          form.resetFields();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: res.message,
            showConfirmButton: false,
            timer: 3000,
          }).then(() => {
            notify();
          });
        } else {
          setLoad(false);
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "tạo tài khoản thất bại!",
            showConfirmButton: false,
            timer: 4000,
          });
        }
        setMaXacNhan(false);
      } else {
        setLoad(true);
        const res = await UserAPI.postEmailSendMaXacThuc(values);
        if (res.message === "success") {
          setLoad(false);
          setMaXacNhan(true);
          setMa(res);
        } else {
          setLoad(false);
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "tạo tài khoản thất bại!",
            showConfirmButton: false,
            timer: 4000,
          });
        }
      }
    } catch (err) {
      setLoad(false);
      console.log(err.response);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: err.response?.data.errors[0].msg,
        showConfirmButton: false,
        timer: 4000,
      });
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
          <h1>Thay Đổi Mật Khẩu</h1>
          <div style={{ display: !maXacNhan ? "block" : "none" }}>
            {/* <Form.Item
              label="Tên tài khoản sử dụng để đăng nhập"
              name="TenDangNhap"
              rules={[
                {
                  required: true,
                  message: "Tên đăng nhập không được để trống!",
                },
                { max: 100, message: "Số ký tự không được vượt quá 100 ký tự" },
                {
                  pattern: new RegExp(/^[a-zA-Z0-9]+$/i),
                  message:
                    "Tên đăng nhập chỉ cho phép các chữ cái (a-z,A-Z) số (0-9)",
                },
              ]}
            >
              <Input placeholder="Nhập tên tài khoản" />
            </Form.Item> */}
            <Form.Item
              label="Email đã đăng ký"
              name="Email"
              rules={[
                {
                  required: true,
                  message: "Email không được để trống!",
                },
                { max: 50, message: "Số ký tự không được vượt quá 50 ký tự" },
                {
                  pattern: new RegExp(
                    /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.(com|vn)$/g
                  ),
                  message: "Email không hợp lệ",
                },
                {
                  pattern: new RegExp(/^[a-zA-Z0-9@.]+$/i),
                  message:
                    "Email chỉ cho phép các chữ cái (a-z,A-Z) số (0-9) và dấu chấm (.)",
                },
              ]}
            >
              <Input placeholder="Nhập Email" />
            </Form.Item>
          </div>
          <div style={{ display: maXacNhan ? "block" : "none" }}>
            <Form.Item
              label="Xác nhận mã"
              name="XacNhanMa"
              rules={[
                () => ({
                  validator(_, value) {
                    if (!value || (value && value.length === 6)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Số ký tự it nhất là 6 ký tự")
                    );
                  },
                }),
              ]}
            >
              <Input
                placeholder="Nhập mã xác nhận"
                maxLength={6}
                style={{ width: "50%" }}
              />
            </Form.Item>
            <p>
              Vui lòng kiểm tra email đã nhập ở mục đăng ký để lấy mã xác thực!
            </p>
            {/* <Form.Item style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit" style={{ width: "30%" }}>
                Xác nhận
              </Button>
            </Form.Item> */}
          </div>
          <Form.Item style={{ textAlign: "center" }}>
            <Button htmlType="submit" style={{ width: "50%" }}>
              {!maXacNhan ? "Gửi mã" : "Xác nhận"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
}

export default ForgotPassword;
