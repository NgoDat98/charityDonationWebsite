import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
// import "./Auth.css";
// import queryString from "query-string";
// import MessengerAPI from "../API/MessengerAPI";
import UserAPI from "../API/UserAPI";
import axios from "axios";
import { Button, Form, Input, Spin, Result } from "antd";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styled from "./Auth.module.css";

function SignUp(props) {
  // dùng để chuyển hình ảnh trong phần đăng ký
  const [taiKhoanVaEmail, setTaiKhoanVaEmail] = useState([]);

  const [maXacNhan, setMaXacNhan] = useState(false);
  const [ma, setMa] = useState("");
  const [load, setLoad] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  const history = useHistory();
  const locaton = useLocation();

  const [form] = Form.useForm();
  console.log(locaton);

  //thông báo tự đông chuyển trang
  const notify = () =>
    toast.success("Chuẩn bị chuyến đến màng hình đăng nhập!", {
      autoClose: 3000,
      onClose: () => {
        setCreateSuccess(false);
        history.push("/signin", { pathName: locaton.pathname });
      },
    });

  window.scrollTo(0, 143);
  // hook useEffect này dùng để gọi API và lấy giá trị của tên đăng nhập và email đã được đăng ký
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await UserAPI.getAllTenDangNhap();
        setTaiKhoanVaEmail(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [load]);
  //hàm dùng để kiểm tra value nhập có trùng với tên đăng nhập hay Email dữ liệu đã có trong hệ thống hay không
  const kiemTraTaiKhoan = (e) => {
    return taiKhoanVaEmail && taiKhoanVaEmail.find((x) => x.TenDangNhap === e);
  };
  const kiemTraEmail = (e) => {
    return taiKhoanVaEmail && taiKhoanVaEmail.find((x) => x.Email === e);
  };

  const onFinish = async (values) => {
    // console.log("Success:" /*, values*/);
    try {
      if (maXacNhan) {
        setLoad(true);
        const res = await UserAPI.postMaXacThucAndCreatedUser(values, ma);
        if (res.message === "Tạo tài khoản thành công!") {
          setLoad(false);
          setCreateSuccess(true);
          form.resetFields();
          // Swal.fire({
          //   position: "top-end",
          //   icon: "success",
          //   title: "tạo tài khoản thành công!",
          //   showConfirmButton: false,
          //   timer: 3000,
          // }).then(() => {
          notify();
          // });
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
        const res = await UserAPI.postSendEmail(values);
        if (res.message === "success") {
          setLoad(false);
          setMaXacNhan(true);
          setMa(res.token);
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
      <div className={styled.font_Sigup}>
        <Form
          style={{ display: !createSuccess ? "block" : "none" }}
          name="basic"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onKeyDown={(e) => (e.key === "Enter" ? e.preventDefault() : "")}
          layout="vertical"
        >
          <h1>Đăng Ký</h1>
          <div style={{ display: maXacNhan ? "none" : "block" }}>
            <Form.Item
              label="Tên đăng nhập"
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
                () => ({
                  validator(_, value) {
                    if (!value || !kiemTraTaiKhoan(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Tên tài khoản đã có người sử dụng!")
                    );
                  },
                }),
              ]}
            >
              <Input placeholder="Nhập tên đăng nhập" />
            </Form.Item>

            <Form.Item
              label="Họ và tên"
              name="HoVaTen"
              rules={[
                {
                  required: true,
                  message: "Họ và tên không được để trống!",
                },
                { max: 150, message: "Số ký tự không được vượt quá 150 ký tự" },
              ]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>

            <Form.Item
              label="Email"
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
                () => ({
                  validator(_, value) {
                    if (!value || !kiemTraEmail(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Email đã tồn tại trên hệ thông! hãy chọn email khác."
                      )
                    );
                  },
                }),
              ]}
            >
              <Input placeholder="Nhập Email" />
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

            <Form.Item
              label="Nhập lại mật khẩu"
              name="NhapLaiMatKhau"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập lại mật khẩu",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("MatKhau") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Hai mật khẩu bạn đã nhập không khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu" />
            </Form.Item>

            <Form.Item style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit">
                Đăng ký
              </Button>
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
              <Input placeholder="Nhập mã xác nhận" maxLength={6} />
            </Form.Item>
            <p>
              Vui lòng kiểm tra email đã nhập ở mục đăng ký để lấy mã xác thực!
            </p>
            <Form.Item style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit" style={{ width: "50%" }}>
                Xác nhận
              </Button>
            </Form.Item>
          </div>
        </Form>
        <Result
          style={{ display: !createSuccess ? "none" : "block" }}
          status="success"
          title="Bạn đã đăng ký tài khoản thành công!"
          subTitle="hệ thống chuẩn bị chuyển sang màn hình đăng nhập!"
          // extra={[
          //   <Button type="primary" key="console">
          //     Go Console
          //   </Button>,
          //   <Button key="buy">Buy Again</Button>,
          // ]}
        />
      </div>
    </Spin>
  );
}

export default SignUp;
