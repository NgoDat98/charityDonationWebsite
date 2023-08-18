import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useHistory, useLocation } from "react-router-dom";
import { valuesContext } from "../../App";
import {
  EditOutlined,
  LoadingOutlined,
  PhoneOutlined,
  UserOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import {
  Form,
  Input,
  Switch,
  Button,
  Tabs,
  Card,
  List,
  Row,
  Typography,
  Skeleton,
  Avatar,
  Space,
  Spin,
  Tooltip,
  Modal,
  Tag,
} from "antd";
import UserAPI from "../../API/UserAPI";
import DonationAPI from "../../API/DonationsAPI";
import convertMoney from "../../convertMoney";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styled from "./Detail_User.module.css";
import "./Detail._User.css";

const DetailUser = () => {
  const [data, setData] = useState("");
  const [dataDonationUser, setDataDonationUser] = useState("");
  const [loadUser, setLoadUser] = useState(false);
  const [loadDonation, setLoadDonation] = useState(false);
  const [key, setKey] = useState({ key1: "1", key2: "1" });
  const [checkUpdateEmail, setCheckUpadateEmail] = useState(true);
  const [taiKhoanVaEmail, setTaiKhoanVaEmail] = useState([]);
  const [load, setLoad] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [ma, setMa] = useState("");
  const [maXacNhan, setMaXacNhan] = useState(false);

  const { id } = useParams();
  const context = useContext(valuesContext);
  const history = useHistory();
  const location = useLocation();
  const { Meta } = Card;
  const { Text } = Typography;
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  //toastify thông báo thành công khi nhận được response chả về thành công
  const notify = (values) =>
    toast.success(values, {
      autoClose: 3000,
      onClose: () => {
        // if (location?.pathname?.split("/")[1] === "table-user") {
        setKey({ key1: "1", key2: "1" });
        setDisabled(false);
        setCheckUpadateEmail(true);
        // }
        // if (location?.pathname?.split("/")[1] === "CapNhatThongTinTaiKhoan") {
        //   history.replace(`/ThongTintaiKhoan/${id}`);
        //   setDisabled(false);
        //   setCheckUpadateEmail(true);
        // }
      },
    });

  // const notify2 = (values) =>
  //   toast.success(values, {
  //     autoClose: 3000,
  //     onClose: () => {
  //       setKey({ key1: "1", key2: "1" });
  //     },
  //   });

  //toastify thông báo thát bại khi nhận được response chả về thất bại
  const notifyError = (values) =>
    toast.error(values, {
      autoClose: 3000,
    });

  //hàm sử lý định dạng ngày DD/MM/YYYY
  const dinhDangDate = (day) => {
    const date = new Date(day);

    return (
      date.getHours().toString().padStart(2, "0") +
      ":" +
      date.getMinutes().toString().padStart(2, "0") +
      " " +
      date.getDate().toString().padStart(2, "0") +
      "/" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      date.getFullYear()
    );
  };

  //thông tin người dùng theo userId
  useEffect(() => {
    const fetchData = async () => {
      setLoadUser(true);
      try {
        if (location?.pathname?.split("/")[1] === "table-user") {
          const res = await UserAPI.getUserId(
            id,
            "Breare " + window.localStorage.getItem("User")
          );
          if (res.message === "lấy dữ liệu thành công") {
            setData(res);
            form.setFieldsValue({
              HoVaTen: res?.data?.HoVaTen,
              SoDienThoai: res?.data?.SoDienThoai,
              Email: res?.data?.Email,
            });
            setLoadUser(false);
          }
        } else if (
          location?.pathname?.split("/")[1] === "ThongTintaiKhoan" ||
          location?.pathname?.split("/")[1] === "CapNhatThongTinTaiKhoan"
        ) {
          const res = await UserAPI.getUserViewUserId(
            id,
            "Breare " + window.localStorage.getItem("User")
          );
          if (res.message === "lấy dữ liệu thành công") {
            setData(res);
            form.setFieldsValue({
              HoVaTen: res?.data?.HoVaTen,
              SoDienThoai: res?.data?.SoDienThoai,
              Email: res?.data?.Email,
            });
            setLoadUser(false);
          }
        } else {
          return;
        }
      } catch (err) {
        setLoadUser(false);
        console.log(err);
        notifyError(err?.response?.data?.errors[0].msg);
      }
    };
    fetchData();
  }, [id, load, loading, location?.pathname?.split("/")[1]]);

  //lấy dữ liệu donation theo userId
  useEffect(() => {
    const fetchData = async () => {
      setLoadDonation(true);
      try {
        if (location?.pathname?.split("/")[1] === "table-user") {
          const res = await DonationAPI.getDonationOfUserId(
            id,
            "Breare " + window.localStorage.getItem("User")
          );
          if (res.message === "lấy dữ liệu thành công") {
            setDataDonationUser(res);
            setLoadDonation(false);
          } else {
            setDataDonationUser(res);
            setLoadDonation(false);
          }
        } else if (
          location?.pathname?.split("/")[1] === "ThongTintaiKhoan" ||
          location?.pathname?.split("/")[1] === "CapNhatThongTinTaiKhoan"
        ) {
          const res = await DonationAPI.getUserDoanetionOfUserId(
            id,
            "Breare " + window.localStorage.getItem("User")
          );
          if (res.message === "lấy dữ liệu thành công") {
            setDataDonationUser(res);
            setLoadDonation(false);
          } else {
            setDataDonationUser(res);
            setLoadDonation(false);
          }
        } else {
          return;
        }
      } catch (err) {
        setLoadDonation(false);
        console.log(err);
        notifyError(err?.response?.data?.errors[0].msg);
      }
    };
    fetchData();
  }, [id, location?.pathname?.split("/")[1]]);

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
  const kiemTraEmail = (e) => {
    if (context.data.data.Email !== e) {
      return taiKhoanVaEmail && taiKhoanVaEmail.find((x) => x.Email === e);
    } else {
      return false;
    }
  };

  //sử lý thay đổi luồng xử lý để khớp với title trong thẻ Menu
  useEffect(() => {
    if (location?.pathname?.split("/")[1] === "CapNhatThongTinTaiKhoan") {
      setKey({ key1: "2", key2: "1" });
    } else if (location?.pathname?.split("/")[1] === "ThongTintaiKhoan") {
      setKey({ key1: "1", key2: "1" });
    } else {
      return;
    }
  }, [location?.pathname?.split("/")[1]]);

  //check người dùng có muôn thay đổi Email hay không!
  useEffect(() => {
    form.setFieldsValue({
      Email: data?.data?.Email,
    });
  }, [checkUpdateEmail]);

  const onChange = (k) => {
    setKey({ key1: k, key2: key.key2 });
  };
  const onChange2 = (k) => {
    setKey({ key1: key.key1, key2: k });
  };
  const EditPasswordHandler = () => {
    setKey({ key1: "2", key2: "2" });
  };
  const EditDetailHandler = () => {
    setKey({ key1: "2", key2: "1" });
  };

  const checkEditEmail = (checked) => {
    setCheckUpadateEmail(checked);
  };

  //hàm sử lý gửi requet không nếu không thay đổi Email
  const onFinish = async (values) => {
    console.log(values);
    setLoad(true);
    values.userId = id;
    try {
      const res = await UserAPI.postUserUpdateUserId(
        values,
        "Breare " + window.localStorage.getItem("User")
      );
      if (res.message === "cập nhật thông tin thành công!") {
        setLoad(false);
        setDisabled(true);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Cập nhật thành công!",
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          notify("Chuẩn bị chuyển qua màn hình thông tin người dùng!");
        });
      }
    } catch (err) {
      setLoad(false);
      console.log(err);
      notifyError(err?.response?.data?.errors[0]?.msg);
    }
  };

  //hàm sử lý gửi requet không nếu thay đổi Email mới
  const onFinishEmail = async (values) => {
    values.userId = id;
    try {
      if (maXacNhan) {
        setLoading(true);
        const res = await UserAPI.postXacNhanEmail(values, "Breare " + ma);
        if (res.message === "Cập nhật thông tìn và Email thành công!") {
          setLoading(false);
          setCheckUpadateEmail(true);
          setOpen(false);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Cập nhật thành công!",
            showConfirmButton: false,
            timer: 3000,
          }).then(() => {
            notify("Chuẩn bị chuyển qua màn hình thông tin người dùng!");
          });
        }
      } else {
        setLoad(true);
        const res = await UserAPI.postUserUpdateUserId(
          values,
          "Breare " + window.localStorage.getItem("User")
        );
        console.log(res);
        if (res.message === "success") {
          setLoad(false);
          setDisabled(true);
          setMaXacNhan(true);
          setMa(res.token);
          setOpen(true);
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
      console.log(err);
      notifyError(err?.response?.data?.errors[0]?.msg);
    }
  };
  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  // hàm sử lý requet có dư liệu người dùng muốn thay đổi mật khẩu
  const submitUpdatePassWord = async (values) => {
    setLoad(true);
    values.userId = id;
    try {
      const res = await UserAPI.postUserUpdatePassword(
        values,
        "Breare " + window.localStorage.getItem("User")
      );
      if (res.message === "thay đổi mật khẩu thành công!") {
        setLoad(false);
        form3.resetFields();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Cập nhật thành công!",
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          Swal.fire({
            title: "Bạn có muốn đăng nhập lại?",
            text: "Đã thay đổi mật khẩu thành công , bạn có muốn đăng nhập lại hay vẫn ở lại phiên đăng nhập này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#26bc2c",
            cancelButtonColor: "#3372ddf0",
            cancelButtonText: "Ở lại phiên đăng nhập!",
            confirmButtonText: "Đăng nhập lại!",
          }).then((result) => {
            if (result.isConfirmed) {
              window.localStorage.removeItem("User");
              context.loadAuth(true);
              history.replace("/signin");
            } else {
              notify("Chuẩn bị chuyển qua màn hình thông tin người dùng!");
            }
          });
        });
      }
    } catch (err) {
      setLoad(false);
      console.log(err);
      notifyError(err?.response?.data?.errors[0]?.msg);
    }
  };

  const items = [
    {
      key: "1",
      label: `Chi Tiết`,
      children: (
        <>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <Card
              style={{
                width: 300,
                height: 200,
              }}
              actions={
                context?.data?.data?.userId === id && [
                  <Tooltip
                    title="Thay đổi mật khẩu"
                    placement="bottom"
                    color="#1677ff"
                  >
                    <div
                      className={styled.Buttom_edit_password}
                      onClick={EditPasswordHandler}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="1em"
                        viewBox="0 0 448 512"
                      >
                        <path
                          fill="#00000073"
                          d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"
                        />
                      </svg>
                    </div>
                  </Tooltip>,
                  <Tooltip
                    title="Cập nhật thông tin"
                    placement="bottom"
                    color="#1677ff"
                  >
                    <EditOutlined key="edit" onClick={EditDetailHandler} />
                  </Tooltip>,
                ]
              }
            >
              <Skeleton loading={loadUser} avatar active>
                <Meta
                  avatar={
                    <Avatar src="https://taimienphi.vn/tmp/cf/aut/mAKI-top-anh-dai-dien-dep-chat-1.jpg" />
                  }
                  title={data?.data?.HoVaTen}
                  description={
                    <span>
                      {data?.data?.TrangThai === "hoạt động" && (
                        <LoadingOutlined style={{ color: "green" }} />
                      )}
                      {data?.data?.TrangThai === "không hoạt động" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="1em"
                          viewBox="0 0 448 512"
                        >
                          <path
                            fill="red"
                            d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"
                          />
                        </svg>
                      )}{" "}
                      {data?.data?.TrangThai}
                    </span>
                  }
                />
                <div style={{ marginTop: "20px" }}>
                  <Row>
                    <Space>
                      <Text type="secondary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="15"
                          viewBox="0 -100 512 512"
                        >
                          <path
                            height="100%"
                            fill="#00000073"
                            d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                          />
                        </svg>{" "}
                        email :
                      </Text>
                      <Text type="secondary">{data?.data?.Email}</Text>
                    </Space>
                  </Row>
                  {data?.data?.SoDienThoai && (
                    <Row>
                      <Space>
                        <Text type="secondary">
                          <PhoneOutlined /> sđt :
                        </Text>
                        <Text type="secondary">{data?.data?.SoDienThoai}</Text>
                      </Space>
                    </Row>
                  )}
                  <Row>
                    <Space>
                      <Text type="secondary">
                        <UserOutlined /> vai trò :
                      </Text>
                      <Text type="secondary">
                        {data?.data?.VaiTro === "người dùng"
                          ? "thành viên"
                          : "quản trị viên"}
                      </Text>
                    </Space>
                  </Row>
                </div>
              </Skeleton>
            </Card>
            <Spin tip="Loading..." spinning={loadDonation} size="large">
              <List
                style={{ fontFamily: "serif" }}
                itemLayout="vertical"
                size="small"
                header={
                  <h3>
                    {dataDonationUser?.data
                      ? "Những đợt quyên góp đã tham giá"
                      : dataDonationUser?.message}
                  </h3>
                }
                pagination={{
                  onChange: (page) => {
                    console.log(page);
                  },
                  pageSize: 3,
                }}
                bordered
                dataSource={dataDonationUser?.data}
                renderItem={(item, index) => {
                  return (
                    <List.Item
                      key={index}
                      extra={
                        <img
                          width={272}
                          alt="img1"
                          src={item?.campaign?.HinhAnh[0].url}
                        />
                      }
                    >
                      <List.Item.Meta
                        title={
                          <Link to={`/quyengop/${item?.campaign?._id}`}>
                            Mã đợt quyên góp: {item.campaign.MaHoanCanh}
                          </Link>
                        }
                        description={
                          "Thời gian quyên góp : " +
                          dinhDangDate(item.ThoiGianQuyenGop)
                        }
                      />
                      <Row>
                        <Space>
                          <Text type="secondary">
                            <ScheduleOutlined /> trang thái quyên góp :
                          </Text>
                          <Text type="secondary">
                            <Tag
                              className="tag"
                              color={
                                item?.TrangThaiQuyenGop ? "#6ABE39" : "#FAAD14"
                              }
                            >
                              {item?.TrangThaiQuyenGop
                                ? "Đã duyệt"
                                : "Chờ Duyệt"}
                            </Tag>
                          </Text>
                        </Space>
                      </Row>
                      <Row>
                        <Space>
                          <Text type="secondary">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="1em"
                              viewBox="0 0 320 512"
                            >
                              <path
                                fill="#00000073"
                                d="M160 0c17.7 0 32 14.3 32 32V67.7c1.6 .2 3.1 .4 4.7 .7c.4 .1 .7 .1 1.1 .2l48 8.8c17.4 3.2 28.9 19.9 25.7 37.2s-19.9 28.9-37.2 25.7l-47.5-8.7c-31.3-4.6-58.9-1.5-78.3 6.2s-27.2 18.3-29 28.1c-2 10.7-.5 16.7 1.2 20.4c1.8 3.9 5.5 8.3 12.8 13.2c16.3 10.7 41.3 17.7 73.7 26.3l2.9 .8c28.6 7.6 63.6 16.8 89.6 33.8c14.2 9.3 27.6 21.9 35.9 39.5c8.5 17.9 10.3 37.9 6.4 59.2c-6.9 38-33.1 63.4-65.6 76.7c-13.7 5.6-28.6 9.2-44.4 11V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V445.1c-.4-.1-.9-.1-1.3-.2l-.2 0 0 0c-24.4-3.8-64.5-14.3-91.5-26.3c-16.1-7.2-23.4-26.1-16.2-42.2s26.1-23.4 42.2-16.2c20.9 9.3 55.3 18.5 75.2 21.6c31.9 4.7 58.2 2 76-5.3c16.9-6.9 24.6-16.9 26.8-28.9c1.9-10.6 .4-16.7-1.3-20.4c-1.9-4-5.6-8.4-13-13.3c-16.4-10.7-41.5-17.7-74-26.3l-2.8-.7 0 0C119.4 279.3 84.4 270 58.4 253c-14.2-9.3-27.5-22-35.8-39.6c-8.4-17.9-10.1-37.9-6.1-59.2C23.7 116 52.3 91.2 84.8 78.3c13.3-5.3 27.9-8.9 43.2-11V32c0-17.7 14.3-32 32-32z"
                              />
                            </svg>{" "}
                            số tiền quyên góp :
                          </Text>
                          <Text type="secondary">
                            {convertMoney(item?.SoTienQuyenGop) + " " + "VND"}
                          </Text>
                        </Space>
                      </Row>
                      <Row>
                        <Space>
                          <Text type="secondary">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="1em"
                              viewBox="0 0 640 512"
                            >
                              <path
                                fill="#00000073"
                                d="M535 41c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l64 64c4.5 4.5 7 10.6 7 17s-2.5 12.5-7 17l-64 64c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l23-23L384 112c-13.3 0-24-10.7-24-24s10.7-24 24-24l174.1 0L535 41zM105 377l-23 23L256 400c13.3 0 24 10.7 24 24s-10.7 24-24 24L81.9 448l23 23c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L7 441c-4.5-4.5-7-10.6-7-17s2.5-12.5 7-17l64-64c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM96 64H337.9c-3.7 7.2-5.9 15.3-5.9 24c0 28.7 23.3 52 52 52l117.4 0c-4 17 .6 35.5 13.8 48.8c20.3 20.3 53.2 20.3 73.5 0L608 169.5V384c0 35.3-28.7 64-64 64H302.1c3.7-7.2 5.9-15.3 5.9-24c0-28.7-23.3-52-52-52l-117.4 0c4-17-.6-35.5-13.8-48.8c-20.3-20.3-53.2-20.3-73.5 0L32 342.5V128c0-35.3 28.7-64 64-64zm64 64H96v64c35.3 0 64-28.7 64-64zM544 320c-35.3 0-64 28.7-64 64h64V320zM320 352a96 96 0 1 0 0-192 96 96 0 1 0 0 192z"
                              />
                            </svg>{" "}
                            Hình thức quyên góp :
                          </Text>
                          <Text type="secondary">
                            {item?.HinhThucQuyenGop === "ChuyenTienOnline"
                              ? "Chuyển Tiền Online"
                              : ""}
                          </Text>
                        </Space>
                      </Row>
                    </List.Item>
                  );
                }}
              />
            </Spin>
          </div>
        </>
      ),
    },
    context?.data?.data?.userId === id && {
      key: "2",
      label: `Thay đổi thông tin`,
      children: (
        <>
          <div
            style={{
              marginTop: "20px",
            }}
          >
            <Tabs
              tabPosition={"left"}
              activeKey={key.key2}
              items={[
                {
                  key: "1",
                  label: "Cập nhật thông tin",
                  children: (
                    <>
                      <Spin tip="Loading" spinning={load} size="large">
                        <Form
                          disabled={disabled}
                          {...layout}
                          name="nest-messages"
                          form={form}
                          // initialValues={{
                          //   HoVaTen: data?.data?.HoVaTen,
                          //   SoDienThoai: data?.data?.SoDienThoai,
                          // }}
                          onFinish={checkUpdateEmail ? onFinish : onFinishEmail}
                        >
                          <Form.Item
                            name="HoVaTen"
                            label="Họ Và Tên"
                            rules={[
                              {
                                required: true,
                                message: "Họ và tên không được để trống!",
                              },
                              {
                                max: 150,
                                message:
                                  "Số ký tự không được vượt quá 150 ký tự",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item label="Không cập nhập email">
                            <Switch
                              defaultChecked={checkUpdateEmail}
                              onChange={checkEditEmail}
                            />
                          </Form.Item>

                          <Form.Item
                            name={checkUpdateEmail ? "" : "Email"}
                            label="Email"
                            rules={
                              !checkUpdateEmail && [
                                {
                                  required: true,
                                  message: "Email không được để trống!",
                                },
                                {
                                  max: 50,
                                  message:
                                    "Số ký tự không được vượt quá 50 ký tự",
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
                              ]
                            }
                          >
                            <Input disabled={checkUpdateEmail || disabled} />
                          </Form.Item>
                          <Form.Item
                            name="SoDienThoai"
                            label="Số Điện Thoại"
                            rules={[
                              {
                                required: true,
                                message: "Số điện thoại không được để trống!",
                              },
                              {
                                pattern: new RegExp(
                                  /^(0|\+84)(3[2-9]|5[689]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/
                                ),
                                message: "Số điện thoại không đúng định dạng",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>

                          <Form.Item
                            wrapperCol={{
                              ...layout.wrapperCol,
                              offset: 8,
                            }}
                          >
                            <Button type="primary" htmlType="submit">
                              Cập nhật
                            </Button>
                          </Form.Item>
                        </Form>
                        {disabled && !checkUpdateEmail && (
                          <Row justify="end">
                            <Button type="primary" onClick={showModal}>
                              Nhập mã xác thực
                            </Button>
                          </Row>
                        )}
                      </Spin>
                      <Modal
                        open={open}
                        title="Xác nhận mã thay đổi thông tin và Email"
                        // onOk={handleOk}
                        onCancel={handleCancel}
                        footer={[
                          <Button key="back" onClick={handleCancel}>
                            Đóng
                          </Button>,
                          <Button
                            key="submit"
                            type="primary"
                            loading={loading}
                            onClick={() => form2.submit()}
                          >
                            Gửi mã
                          </Button>,
                        ]}
                      >
                        <Form form={form2} onFinish={onFinishEmail}>
                          <Form.Item
                            label="Mã xác nhận"
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
                            />
                          </Form.Item>
                          <p>
                            Vui lòng kiểm tra email đã nhập ở mục đăng ký để lấy
                            mã xác thực!
                          </p>
                        </Form>
                      </Modal>
                    </>
                  ),
                },
                {
                  key: "2",
                  label: "Thay đổi mật khẩu",
                  children: (
                    <>
                      <Spin tip="Loading" spinning={load} size="large">
                        <Form
                          {...layout}
                          name="nest-messages2"
                          form={form3}
                          onFinish={submitUpdatePassWord}
                        >
                          <Form.Item
                            name="MatKhauCu"
                            label="Mật khẩu cũ"
                            rules={[
                              {
                                required: true,
                                message: "mật khẩu cũ không được để trống!",
                              },
                              {
                                max: 50,
                                message:
                                  "Số ký tự không được vượt quá 50 ký tự",
                              },
                              {
                                min: 8,
                                message: "Số ký tự it nhất là 8 ký tự",
                              },
                            ]}
                          >
                            <Input.Password placeholder="Nhập mật khâu cũ" />
                          </Form.Item>
                          <Form.Item
                            name="MatKhauMoi"
                            label="Mật khẩu mới"
                            rules={[
                              {
                                required: true,
                                message: "Mật khẩu mới không được để trống!",
                              },
                              {
                                max: 50,
                                message:
                                  "Số ký tự không được vượt quá 50 ký tự",
                              },
                              {
                                min: 8,
                                message: "Số ký tự it nhất là 8 ký tự",
                              },
                            ]}
                          >
                            <Input.Password placeholder="Nhập mật khâu mới" />
                          </Form.Item>
                          <Form.Item
                            name="NhapLaiMatKhauMoi"
                            label="Nhập lại mật khẩu mới"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập lại mật khẩu",
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (
                                    !value ||
                                    getFieldValue("MatKhauMoi") === value
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      "Hai mật khẩu mới bạn đã nhập không khớp!"
                                    )
                                  );
                                },
                              }),
                            ]}
                          >
                            <Input.Password placeholder="Nhập mật khâu cũ" />
                          </Form.Item>
                          <Form.Item
                            wrapperCol={{
                              ...layout.wrapperCol,
                              offset: 8,
                            }}
                          >
                            <Button type="primary" htmlType="submit">
                              Thay đổi mật khẩu
                            </Button>
                          </Form.Item>
                        </Form>
                      </Spin>
                    </>
                  ),
                },
              ]}
              onChange={onChange2}
            ></Tabs>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="container">
      <ToastContainer />
      <Tabs activeKey={key.key1} items={items} onChange={onChange} />
    </div>
  );
};

export default DetailUser;
