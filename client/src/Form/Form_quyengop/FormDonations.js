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
  Result,
} from "antd";
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import DonationAPI from "../../API/DonationsAPI";
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

const FormDonations = (props) => {
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [success, setSuccess] = useState(false);

  const dataUser = useContext(valuesContext).data.data;
  const notifyError = useContext(valuesContext).notifyError;

  const [form] = Form.useForm();

  const { open, handlerOpen, data } = props;
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    handlerOpen(false);
    setSuccess(false);
  };

  const dateFormatList = "DD/MM/YYYY";

  const suffixSelector = (
    <Form.Item name="suffix" noStyle initialValue="VND">
      <Select style={{ width: 80 }}></Select>
    </Form.Item>
  );

  //thêm mới hoàn cảnh
  const onFinish = async (values) => {
    setLoad(true);
    setLoading(true);
    values.userId = dataUser?.userId;
    values.campaignId = data?._id;
    values.ThoiGianQuyenGop = new Date();
    try {
      const res = await DonationAPI.postNewDonation(values);
      if (
        res.message === "Tạo quyên góp thành công, vui lòng chờ admin phê duyệt"
      ) {
        setLoading(false);
        setLoad(false);
        setSuccess(true);
        form.resetFields();
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      setLoad(false);
      notifyError(err?.response?.data?.errors[0].msg);
    }
  };

  return (
    <Modal
      open={open}
      title={"Quyên Góp - " + data.MaHoanCanh}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        !success && (
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>
        ),
        !success && (
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Quyên Góp
          </Button>
        ),
      ]}
    >
      {!success && (
        <Spin tip="Loading..." size="large" spinning={load ? true : false}>
          <div>
            <Form
              form={form}
              layout="vertical"
              onKeyDown={(e) => (e.key === "Enter" ? e.preventDefault() : "")}
              onFinish={onFinish}
              initialValues={{
                NguoiQuyenGop: dataUser?.HoVaTen,
                HinhThucQuyenGop: "ChuyenTienOnline",
              }}
            >
              <Form.Item
                label="Người Quyên Góp"
                name="NguoiQuyenGop"
                rules={[{ max: 50, message: "Chị được nhập tối đa 50 ký tự" }]}
                style={{
                  maxWidth: "80%",
                  margin: "auto",
                }}
              >
                <Input placeholder="VD: Nguyên Văn A" />
              </Form.Item>
              <Form.Item
                label="Tên Công Khai"
                name="TenCongKhai"
                rules={[
                  {
                    required: true,
                    message: "Tên công khai không được để trống",
                  },
                  { max: 50, message: "Chị được nhập tối đa 50 ký tự" },
                ]}
                style={{
                  maxWidth: "80%",
                  margin: "auto",
                }}
              >
                <Input placeholder="VD: Nguyễn Văn A" />
              </Form.Item>
              <Form.Item
                label="Số Điện Thoại"
                name="SoDienThoai"
                rules={[
                  { max: 50, message: "Chỉ được nhập tối đa 50 ký tự" },
                  {
                    pattern: new RegExp(/^[0-9\b]+$/),
                    message: "Chỉ cho phép số số nguyên dương",
                  },
                ]}
                style={{
                  maxWidth: "80%",
                  margin: "auto",
                }}
              >
                <Input placeholder="VD: 0978123123" />
              </Form.Item>
              <Form.Item
                label="Hình Thức Quyên Góp"
                name="HinhThucQuyenGop"
                rules={[
                  {
                    required: true,
                    message: "Hình thức quyên góp không được để trống",
                  },
                ]}
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

              <Form.Item
                label="Số Tiền Quyên Góp"
                name="SoTienQuyenGop"
                rules={[
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
                ]}
                style={{
                  maxWidth: "80%",
                  margin: "auto",
                }}
              >
                <InputNumber
                  placeholder="Nhập số tiền quyên góp"
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
                label="Lời Nhắn"
                name="LoiNhan"
                style={{
                  maxWidth: "80%",
                  margin: "auto",
                }}
              >
                <TextArea rows={1} placeholder="Nhập lời nhắn" />
              </Form.Item>
            </Form>
            {!dataUser && (
              <Text type="warning">
                * Bạn nên đăng nhập và sử dụng tài khoản để có thể theo dõi chi
                tiết những lần mà bạn đã quyên góp!{" "}
                <Link to={"/signin"}>Đi đến đăng nhập!</Link>
              </Text>
            )}
          </div>
        </Spin>
      )}
      {success && (
        <Result
          status="success"
          title="Đã quyên góp thành công!"
          // subTitle="admin sẽ kiểm tra và duyệt đóng góp của ban! cảm ơn bạn đã đồng hành,chung tay góp sức cùng chúng tôi trên chặng đường giúp đỡ những hoàn cảnh khó khăn trên khắp miền tổ quốc"
          subTitle={
            <div>
              <p>
                Đóng góp của bạn đã được ghi nhận và sẽ được admin kiểm tra và
                phê duyệt sớm nhất có thể!
              </p>
              <p>
                cảm ơn bạn đã đồng hành,chung tay góp sức cùng chúng tôi trên
                chặng đường giúp đỡ những hoàn cảnh khó khăn trên khắp miền tổ
                quốc
              </p>
            </div>
          }
          extra={[
            <Button type="primary" key="cancel" onClick={handleCancel}>
              Cancel
            </Button>,
          ]}
        />
      )}
    </Modal>
  );
};
export default FormDonations;
