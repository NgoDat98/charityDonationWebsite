import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Modal,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Typography,
  TreeSelect,
  Row,
  Upload,
} from "antd";
import configApp from "../../configApp";
import React, { useState, useContext, useEffect } from "react";
import DonationAPI from "../../API/DonationsAPI";
import CampaignAPI from "../../API/CampaignAPI";
import UserAPI from "../../API/UserAPI";
import { valuesContext } from "../../App";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Text } = Typography;
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const FormAdminCreateDonations = (props) => {
  const [loading, setLoading] = useState(false);

  const [load, setLoad] = useState(false);
  const [dataCampaign, setDataCampaign] = useState([]);
  const [value, setValue] = useState("");
  const [dataUserArr, setDataUserArr] = useState([]);
  const [value2, setValue2] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const dataUser = useContext(valuesContext).data.data;

  const [form] = Form.useForm();

  const { open, handlerOpen, type, loadCreateDonation, notifyError, notify } =
    props;
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    handlerOpen(false);
  };

  const dateFormatList = "DD/MM/YYYY";

  const suffixSelector = (
    <Form.Item name="suffix" noStyle initialValue="VND">
      <Select style={{ width: 80 }}></Select>
    </Form.Item>
  );

  //lấy danh sách tất cả campaign
  useEffect(() => {
    const fetchDate = async () => {
      try {
        const res = await CampaignAPI.getAllCampaign();
        if (res.message === "lấy dữ liệu thanh công") {
          setDataCampaign(res.data);
        }
      } catch (err) {
        console.log(err);
        notifyError(err?.response?.data?.errors[0].msg);
      }
    };
    fetchDate();
  }, []);
  //Lấy danh sách tất cả các user
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await UserAPI.AdminGetAllData(
          "Breare " + window.localStorage.getItem("User")
        );
        if (res.message === "Lấy dữ liệu người dùng thành công") {
          setDataUserArr(res.data);
        }
      } catch (err) {
        console.log(err);
        notifyError(err?.response?.data?.errors[0].msg);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    form.setFieldsValue({
      SoDienThoai: value2.split(" - ")[3] ?? "",
      TenCongKhai: value2.split(" - ")[0] ?? "",
    });
  }, [value2]);
  //xóa tất cả giá trị cũ khi thêm mới form donation
  useEffect(() => {
    if (type?.type === "create") {
      form.resetFields();
      setFileList([]);
      setValue("");
      setValue2("");
    }
  }, [type]);

  //admin lấy dữ liệu donation theo donationId để xem chi tiết
  useEffect(() => {
    if (type?.type === "view" || type?.type === "approve") {
      form.resetFields();
      setFileList([]);
      setValue("");
      setValue2("");
      const fetchData = async () => {
        try {
          const res = await DonationAPI.getAdminFindByIdDonation(
            type?.donationId,
            "Breare " + window.localStorage.getItem("User")
          );
          if (res.message === "Lấy dữ liệu thành công!") {
            form.setFieldsValue({
              MaDotQuyenGop: res.data?.campaignId?.MaHoanCanh,
              NguoiQuyenGop: res.data?.NguoiQuyenGop,
              TenCongKhai: res.data?.TenCongKhai,
              SoDienThoai: res.data?.SoDienThoai,
              HinhThucQuyenGop: res.data.HinhThucQuyenGop,
              SoTienQuyenGop: res.data?.SoTienQuyenGop,
              LoiNhan: res.data?.LoiNhan,
            });
            setFileList(res.data?.HinhAnhQuyenGop);
          }
        } catch (err) {
          console.log(err);
          notifyError(err?.response?.data?.errors[0].msg);
        }
      };
      fetchData();
    }
  }, [type]);

  //admin lấy dữ liệu donation theo donationId để xem chi tiết
  useEffect(() => {
    if (type?.type === "update") {
      form.resetFields();
      setFileList([]);
      setValue("");
      setValue2("");
      const fetchData = async () => {
        try {
          const res = await DonationAPI.getAdminFindByIdDonation(
            type?.donationId,
            "Breare " + window.localStorage.getItem("User")
          );
          console.log(res);
          if (res.message === "Lấy dữ liệu thành công!") {
            form.setFieldsValue({
              MaDotQuyenGop: res.data?.campaignId?.MaHoanCanh,
              NguoiQuyenGop: res.data?.NguoiQuyenGop,
              TenCongKhai: res.data?.TenCongKhai,
              SoDienThoai: res.data?.SoDienThoai,
              HinhThucQuyenGop: res.data.HinhThucQuyenGop,
              SoTienQuyenGop: res.data?.SoTienQuyenGop,
              LoiNhan: res.data?.LoiNhan,
            });
            setFileList(res.data?.HinhAnhQuyenGop);
          }
        } catch (err) {
          console.log(err);
          notifyError(err?.response?.data?.errors[0].msg);
        }
      };
      fetchData();
    }
  }, [type]);

  //thêm mới donation
  const onFinish = async (values) => {
    setLoad(true);
    values.userId = values.NguoiQuyenGop?.split(" - ")[2];
    values.NguoiQuyenGop = values.NguoiQuyenGop?.split(" - ")[0];
    values.campaignId = values.MaDotQuyenGop?.split(" - ")[2];
    values.ThoiGianQuyenGop = new Date();
    try {
      const res = await DonationAPI.postAdminCreateDonation(
        values,
        "Breare " + window.localStorage.getItem("User")
      );
      if (res.message === "Quyên góp thành công!") {
        loadCreateDonation(true);
        setLoad(false);
        handlerOpen(false);
        notify(res.message);
        setValue("");
        setValue2("");
        setFileList([]);
        form.resetFields();
      }
      console.log(res);
    } catch (err) {
      setLoad(false);
      notifyError(err?.response?.data?.errors[0].msg);
      console.log(err);
    }
  };

  //cập nhật donation
  const updateHandler = async (values) => {
    setLoad(true);
    values.donationId = type?.donationId;
    values.userId = values.NguoiQuyenGop?.split(" - ")[2] ?? "";
    values.NguoiQuyenGop = values.NguoiQuyenGop?.split(" - ")[0] ?? "";
    values.campaignId = values.MaDotQuyenGop?.split(" - ")[2] ?? "";
    try {
      const res = await DonationAPI.postAdminUpdateDonation(
        values,
        "Breare " + window.localStorage.getItem("User")
      );
      if (res.message === "Cập nhật donation thành công!") {
        loadCreateDonation(true);
        setLoad(false);
        handlerOpen(false);
        notify(res.message);
        setValue("");
        setValue2("");
        setFileList([]);
        form.resetFields();
      }
      console.log(res);
    } catch (err) {
      setLoad(false);
      notifyError(err?.response?.data?.errors[0].msg);
      console.log(err);
    }
    console.log(values);
  };

  //hàm sử lý phê duyệt donation
  const approveHandler = async () => {
    setLoad(true);
    const donationId = type?.donationId;
    try {
      const res = await DonationAPI.postAdminApproveDonationId(
        { donationId },
        "Breare " + window.localStorage.getItem("User")
      );
      if (res?.message === "Phê duyệt thành công!") {
        loadCreateDonation(true);
        setLoad(false);
        handlerOpen(false);
        notify(res.message);
      }
      console.log(res);
    } catch (err) {
      setLoad(false);
      notifyError(err?.response?.data?.errors[0].msg);
      console.log(err);
    }
  };

  //mảng hiển thị ra thông tìn Mã hoàn cảnh và tiêu để hoàn cảnh trong treeSelect
  const treeCampaignData = dataCampaign?.map((item, index) => ({
    title: value ? item.MaHoanCanh : item.MaHoanCanh + " - " + item.TieuDe,
    value: item.MaHoanCanh + " - " + item.TieuDe + " - " + item._id,
  }));
  const onChangeCampaign = (newValue) => {
    setValue(newValue);
  };

  //mảng dùng để hiển thì ra tên người dùng , email và số điện thoại(nếu có) của các tài khoản
  const treeUserData = dataUserArr?.map((item, index) => ({
    title: value2
      ? item.HoVaTen
      : item.HoVaTen +
        " - " +
        item.Email +
        (item.SoDienThoai ? " - " + item.SoDienThoai : ""),
    value:
      item.HoVaTen +
      " - " +
      item.Email +
      " - " +
      item._id +
      (item.SoDienThoai ? " - " + item.SoDienThoai : ""),
  }));
  const onChangeUser = (newValue) => {
    setValue2(newValue);
  };

  const handleCancel2 = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 4,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <Modal
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        (type?.type === "update" || type?.type === "create") && [
          <Button key="back" onClick={handleCancel} disabled={loading}>
            {type?.type === "create" ? "Hủy Thêm" : "Hủy Cập Nhật"}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            {type?.type === "create" ? "Quyên Góp" : "Cập Nhật"}
          </Button>,
        ]
      }
    >
      <Spin tip="Loading..." size="large" spinning={load ? true : false}>
        <div>
          <Form
            form={form}
            layout="vertical"
            disabled={
              type?.type === "update" || type?.type === "create" ? false : true
            }
            onKeyDown={(e) => (e.key === "Enter" ? e.preventDefault() : "")}
            onFinish={
              type?.type === "create"
                ? onFinish
                : type?.type === "update"
                ? updateHandler
                : ""
            }
            initialValues={{
              HinhThucQuyenGop: "ChuyenTienOnline",
            }}
          >
            <Form.Item
              label="Mã Đợt Quyên Góp"
              name="MaDotQuyenGop"
              rules={
                type?.type === "update" && [
                  {
                    required: true,
                    message: "Mã hoàn cảnh không được để trống!",
                  },
                ]
              }
              style={{
                maxWidth: "80%",
                margin: "auto",
              }}
            >
              <TreeSelect
                onMouseDown={(e) => setValue("")}
                showSearch
                dropdownStyle={{
                  maxHeight: 400,
                  overflow: "auto",
                  minWidth: 300,
                }}
                placeholder={
                  type?.type === "update" ? "Chọn đợt quyên góp" : ""
                }
                dropdownMatchSelectWidth={false}
                allowClear
                treeDefaultExpandAll
                treeData={treeCampaignData}
                onChange={onChangeCampaign}
              />
            </Form.Item>
            <Form.Item
              label="Người Quyên Góp"
              name="NguoiQuyenGop"
              rules={
                type?.type === "update" && [
                  {
                    required: true,
                    message: "Người quyên góp không được để trống!",
                  },
                ]
              }
              style={{
                maxWidth: "80%",
                margin: "auto",
              }}
            >
              <TreeSelect
                onMouseDown={(e) => setValue2("")}
                showSearch
                dropdownStyle={{
                  maxHeight: 400,
                  overflow: "auto",
                  minWidth: 300,
                }}
                placeholder={type?.type === "update" ? "VD: Nguyễn Văn A" : ""}
                dropdownMatchSelectWidth={false}
                allowClear
                treeDefaultExpandAll
                treeData={treeUserData}
                onChange={onChangeUser}
              />
            </Form.Item>
            <Form.Item
              label="Tên Công Khai"
              name="TenCongKhai"
              rules={
                type?.type === "update" && [
                  {
                    required: true,
                    message: "Tên công khai không được để trống",
                  },
                  { max: 50, message: "Chị được nhập tối đa 50 ký tự" },
                ]
              }
              style={{
                maxWidth: "80%",
                margin: "auto",
              }}
            >
              <Input
                placeholder={type?.type === "update" ? "VD: Nguyễn Văn A" : ""}
              />
            </Form.Item>
            <Form.Item
              label="Số Điện Thoại"
              name="SoDienThoai"
              rules={
                type?.type === "update" && [
                  {
                    pattern: new RegExp(/^[0-9\b]+$/),
                    message: "Chỉ cho phép số số nguyên dương",
                  },
                ]
              }
              style={{
                maxWidth: "80%",
                margin: "auto",
              }}
            >
              <Input
                placeholder={type?.type === "update" ? "VD: 0978123123" : ""}
              />
            </Form.Item>
            <Form.Item
              label="Hình Thức Quyên Góp"
              name="HinhThucQuyenGop"
              rules={
                type?.type === "update" && [
                  {
                    required: true,
                    message: "Hình thức quyên góp không được để trống",
                  },
                ]
              }
              style={{
                maxWidth: "80%",
                margin: "auto",
              }}
            >
              <Select>
                <Select.Option value="ChuyenTienOnline">
                  Chuyển Tiền Online
                </Select.Option>
              </Select>
            </Form.Item>
            <Row>
              <Form.Item
                label="Số Tiền Quyên Góp"
                name="SoTienQuyenGop"
                rules={
                  type?.type === "update" && [
                    {
                      required: true,
                      message: "Số tiền huy động không được để trống",
                    },
                    {
                      pattern: new RegExp(/^[0-9\b]+$/),
                      message: "Chỉ cho phép số số nguyên dương",
                    },
                    () => ({
                      validator(_, value) {
                        if (!value || (value !== 0 && value >= 1000)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "Số tiền khuyên góp không được nhỏ hơn 1000đ."
                          )
                        );
                      },
                    }),
                  ]
                }
                style={{
                  maxWidth: "40%",
                  margin: "0 0 0 10%",
                }}
              >
                <InputNumber
                  placeholder={
                    type?.type === "update" ? "Nhập số tiền quyên góp" : ""
                  }
                  addonAfter={suffixSelector}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  min={1000}
                  step={1}
                  maxLength={14}
                />
              </Form.Item>
              <Form.Item
                label="Hình ảnh Quyên Góp"
                name="HinhAnhQuyenGop"
                style={{
                  maxWidth: "40%",
                  margin: "0 10% 0 0 ",
                  textAlign: "center",
                }}
              >
                <Upload
                  action={configApp.apiGateWay + "/upload"}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Row>
            <Form.Item
              label="Lời Nhắn"
              name="LoiNhan"
              style={{
                maxWidth: "80%",
                margin: "auto",
              }}
            >
              <TextArea
                placeholder={type?.type === "update" ? "Nhập lời nhắn" : ""}
              />
            </Form.Item>
          </Form>
          {type?.type === "approve" && (
            <div style={{ margin: "10px", textAlign: "center" }}>
              <Button type="primary" onClick={approveHandler}>
                Phê duyệt
              </Button>
            </div>
          )}
        </div>
      </Spin>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel2}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </Modal>
  );
};
export default FormAdminCreateDonations;
