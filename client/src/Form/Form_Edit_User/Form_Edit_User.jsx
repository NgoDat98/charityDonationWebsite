import {
  UploadOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Upload,
  Modal,
  Spin,
} from "antd";
import { useEffect, useState, useContext } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { valuesContext } from "../../App";
import UserAPI from "../../API/UserAPI";

import styled from "./Form_Edit_User.module.css";
import "./Form_Edit_User.css";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormEditUser = () => {
  const [maXacNhan, setMaXacNhan] = useState(false);
  const [ma, setMa] = useState("");
  const [noEdit, setNoEdit] = useState(false);
  const [load, setLoad] = useState(false);
  const [loadResetPassword, setLoadResetPassword] = useState(false);
  const [taiKhoanVaEmail, setTaiKhoanVaEmail] = useState([]);

  const [form] = Form.useForm();

  const location = useLocation();
  const context = useContext(valuesContext);
  const history = useHistory();
  const params = useParams();

  //toastify thông báo thành công khi nhận được response chả về thành công
  const notify = (values) =>
    toast.success(values, {
      autoClose: 3000,
      onClose: () => history.push("/table-user"),
    });

  //toastify thông báo thát bại khi nhận được response chả về thất bại
  const notifyError = (values) =>
    toast.error(values, {
      autoClose: 3000,
    });

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

  //lấy dữ liệu người dùng và tự động thêm vào form edit
  useEffect(() => {
    if (params.type === "edit" && params.id) {
      try {
        const fetchData = async () => {
          const res = await UserAPI.getUserId(
            params.id,
            "Breare " + window.localStorage.getItem("User")
          );
          form.setFieldsValue({
            TenDangNhap: res.data.TenDangNhap,
            HoVaTen: res.data.HoVaTen,
            Email: res.data.Email,
            SoDienThoai: res.data.SoDienThoai,
            VaiTro: res.data.VaiTro,
            TrangThai: res.data.TrangThai,
          });
        };
        fetchData();
      } catch (err) {
        console.log(err);
        notifyError(err?.response?.data?.errors[0].msg);
      }
    }
  }, [params.type, params.id]);

  //admin giúp người dùng tạo một tài khoản mới
  const onFinishCreateUser = async (values) => {
    try {
      setLoad(true);
      const res = await UserAPI.postAdminCreateUser(
        values,
        "Breare " + window.localStorage.getItem("User")
      );
      if (res.message === "Thêm tài khoản mới thành công!") {
        setLoad(false);
        form.resetFields();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: res.message,
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          notify("Chuẩn bị chuyển qua màn hình danh sách người dùng!");
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
        // }
      }
    } catch (err) {
      setLoad(false);
      notifyError(err?.response?.data?.errors[0].msg);
    }
  };

  //Update lại thông tin user
  const onFinishEdit = async (values) => {
    setLoad(true);
    values.userId = params.id;
    try {
      console.log(values);
      const res = await UserAPI.postAdminUpdateUser(
        values,
        "Breare " + window.localStorage.getItem("User")
      );
      if (res.message === "Cập nhật người dùng thành công") {
        setLoad(false);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Cập nhật người dùng thành công!",
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          notify("Chuẩn bị chuyển qua màn hình danh sách người dùng!");
        });
        setNoEdit(true);
        form.resetFields();
      }
    } catch (err) {
      setLoad(false);
      notifyError(err?.response?.data?.errors[0].msg);
    }
  };
  //Reset Password user yêu cầu quyên admin
  const resetPasswordHandler = async () => {
    setLoadResetPassword(true);
    try {
      const res = await UserAPI.postAdminResetPasswordUserId(
        { userId: params.id },
        "Breare " + window.localStorage.getItem("User")
      );
      console.log(res);
      if (res.message === "đặt lại mật khẩu thành công!") {
        notify(res.message);
        setLoadResetPassword(false);
      }
    } catch (err) {
      setLoadResetPassword(false);
      console.log(err);
    }
  };

  return (
    <>
      <ToastContainer />
      <h2 className="title-form">
        Form {params?.type === "edit" ? "cập nhật" : "thêm mới"} tài khoản
      </h2>
      <Spin tip="Loading..." size="large" spinning={load ? true : false}>
        <div className={styled.font_Form}>
          {params?.type === "edit" && params.id !== "null" && (
            <Button
              type="dashed"
              danger
              className="ResetPassword"
              loading={loadResetPassword}
              onClick={() =>
                Swal.fire({
                  title:
                    "Bạn có chắc muốn đặt lại mật khẩu của người dùng này?",
                  text: "Điều sẽ khiến chủ của tài khoản không hài lòng về trang web! bạn vẫn muốn tiếp tục chứ? ",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Xác nhận đặt lại mật khẩu",
                }).then((result) => {
                  if (result.isConfirmed) {
                    resetPasswordHandler();
                  }
                })
              }
            >
              Đặt lại mật khâu của người dùng
            </Button>
          )}
          <Button
            danger
            className="huyEdit"
            onClick={() => history.push("/table-user")}
          >
            {params?.type === "edit" && params.id !== "null"
              ? "Hủy Cập Nhật"
              : "Hủy thêm mới"}
          </Button>
          <Form
            form={form}
            disabled={noEdit}
            layout="vertical"
            onKeyDown={(e) => (e.key === "Enter" ? e.preventDefault() : "")}
            onFinish={
              params?.type === "edit" && params.id !== "null"
                ? onFinishEdit
                : onFinishCreateUser
            }
          >
            <div>
              <Row>
                <Form.Item
                  label="Tên đăng nhập"
                  name="TenDangNhap"
                  rules={
                    params?.type === "edit" && params.id !== "null"
                      ? [
                          {
                            required: true,
                            message: "Tên đăng nhập không được để trống",
                          },
                        ]
                      : [
                          {
                            required: true,
                            message: "Tên đăng nhập không được để trống!",
                          },
                          {
                            max: 100,
                            message: "Số ký tự không được vượt quá 100 ký tự",
                          },
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
                        ]
                  }
                  style={{
                    maxWidth: "40%",
                    margin: "auto",
                  }}
                >
                  <Input
                    disabled={
                      params?.type === "edit" && params.id !== "null"
                        ? true
                        : false
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Họ và tên"
                  name="HoVaTen"
                  rules={[
                    {
                      required: true,
                      message: "Họ và tên không được để trống",
                    },
                  ]}
                  style={{
                    maxWidth: "40%",
                    margin: "auto",
                  }}
                >
                  <Input placeholder="Nhập họ và tên mới" />
                </Form.Item>
              </Row>
              <Row>
                <Form.Item
                  label="Email"
                  name="Email"
                  rules={[
                    {
                      required: true,
                      message: "Email không được để trống!",
                    },
                    {
                      max: 50,
                      message: "Số ký tự không được vượt quá 50 ký tự",
                    },
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
                    location?.pathname?.split("/")[1] === "create-user" &&
                      (() => ({
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
                      })),
                  ]}
                  style={{
                    maxWidth: "40%",
                    margin: "auto",
                  }}
                >
                  <Input placeholder="Nhập Email" />
                </Form.Item>
                <Form.Item
                  label="Số Điện Thoại"
                  name="SoDienThoai"
                  rules={[
                    {
                      required: true,
                      message: "Số điện thoại không được để trống",
                    },
                    {
                      pattern: new RegExp(
                        /^(0|\+84)(3[2-9]|5[689]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/
                      ),
                      message: "Số điện thoại không đúng định dạng",
                    },
                  ]}
                  style={{
                    maxWidth: "40%",
                    margin: "auto",
                  }}
                >
                  <Input
                    style={{ width: "100%" }}
                    placeholder="Nhập số điện thoại"
                  />
                </Form.Item>
              </Row>
              <Row style={{ marginBottom: "50px" }}>
                <Form.Item
                  label="Vai Trò"
                  name="VaiTro"
                  rules={[
                    {
                      required: true,
                      message: "Vai trò không được để trống",
                    },
                  ]}
                  style={{
                    maxWidth: "40%",
                    margin: "auto",
                  }}
                >
                  <Select placeholder="Chọn vai trò">
                    <Select.Option value="người dùng">Người dùng</Select.Option>
                    <Select.Option value="admin">Admin</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Trạng Thái"
                  name="TrangThai"
                  rules={[
                    {
                      required: true,
                      message: "Trạng Thái không được để trống",
                    },
                  ]}
                  style={{
                    maxWidth: "40%",
                    margin: "auto",
                  }}
                >
                  <Select placeholder="Chọn trạng thái">
                    <Select.Option value="hoạt động">Hoạt Động</Select.Option>
                    <Select.Option value="không hoạt động">
                      Không Hoạt Động
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Row>
              <div style={{ textAlign: "center" }}>
                <Button type="primary" htmlType="submit">
                  {params?.type === "edit" && params.id !== "null"
                    ? "Cập nhật"
                    : "Thêm mới"}
                </Button>
              </div>
            </div>
            {/* <div style={{ display: maXacNhan ? "block" : "none" }}>
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
                Vui lòng kiểm tra email đã nhập ở mục đăng ký để lấy mã xác
                thực!
              </p>
              <Form.Item style={{ textAlign: "center" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "30%" }}
                >
                  Xác nhận
                </Button>
              </Form.Item>
            </div> */}
          </Form>
        </div>
      </Spin>
    </>
  );
};
export default FormEditUser;
