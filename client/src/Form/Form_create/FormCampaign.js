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
import configApp from "../../configApp";
import { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import CampaignAPI from "../../API/CampaignAPI";

import styled from "./FormCampaogn.module.css";
import "./FormCampaogn.css";
import dayjs from "dayjs";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
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

const FormCampaign = () => {
  const [data, setData] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [noEdit, setNoEdit] = useState(false);
  const [load, setLoad] = useState(false);
  const [isUpload, setIsUpload] = useState(false);

  const [form] = Form.useForm();

  const location = useLocation();
  const history = useHistory();

  const dateFormatList = "DD/MM/YYYY";
  //toastify thông báo thành công khi nhận được response chả về thành công
  const notify = (values) =>
    toast.success(values, {
      autoClose: 3000,
      onClose: () => history.push("/table-campaign"),
    });

  //toastify thông báo thát bại khi nhận được response chả về thất bại
  const notifyError = (values) =>
    toast.error(values, {
      autoClose: 3000,
    });

  useEffect(() => {
    if (location.pathname === "/create-campaign") {
      form.resetFields();
      setFileList([]);
    }
  }, [location.pathname]);
  useEffect(() => {
    if (location.pathname === "/edit-campaign") {
      try {
        const fetchData = async () => {
          const res = await CampaignAPI.getFindCampaign(location.state);
          console.log(res);
          setData(res);
          setFileList(res.HinhAnh);
          form.setFieldsValue({
            TieuDe: res.TieuDe,
            DiaChi: res.DiaChi,
            DoiTuongQuyenGop: res.DoiTuongQuyenGop,
            ThoiGianHoatDong: [dayjs(res.NgayBatDau), dayjs(res.NgayKetThuc)],
            SoTienHuyDong: res.SoTienHuyDong,
            MoTaHoanCanh: res.MoTaHoanCanh.map((item, index) => ({
              NoiDung: item.NoiDung,
            })),
          });
        };
        fetchData();
      } catch (err) {
        console.log(err);
      }
    }
  }, [location.state?._id]);

  const suffixSelector = (
    <Form.Item name="suffix" noStyle initialValue="VND">
      <Select style={{ width: 80 }}></Select>
    </Form.Item>
  );

  const handleCancel = () => setPreviewOpen(false);
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
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.find((x) => x.status && x.status !== "done")) {
      setIsUpload(true);
    } else {
      setIsUpload(false);
    }
  };

  //thêm mới hoàn cảnh
  const onFinish = async (values) => {
    setLoad(true);
    try {
      const res = await CampaignAPI.postCreatedCampaign(values);
      if (res.data === "Tạo hoàn cảnh thành công!") {
        setLoad(false);
        // Swal.fire({
        //   position: "top-end",
        //   icon: "success",
        //   title: "Thêm mới hoàn cảnh thành công!",
        //   showConfirmButton: false,
        //   timer: 3000,
        // });
        setNoEdit(true);
        notify(
          "Thêm mới hoàn cảnh thành công!chuẩn bị chuyển qua màn hình danh sách"
        );
        form.resetFields();
        setFileList([]);
      } else {
        notifyError("Thêm mới hoàn cảnh thất bại!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  //thay đổi thông tin hoàn cảnh
  const UpdateCampaign = async (values) => {
    values.id = location.state;
    console.log(values);
    try {
      const res = await CampaignAPI.postUpdateCampaign(values);
      if (res.message === "Cập nhật hoàn cảnh thành Công!") {
        setNoEdit(true);
        notify(
          "Cập nhật đợt quyên góp thành công! chuẩn bị chuyển về màn hình danh sách"
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <ToastContainer />
      <h2 className="title-form">
        Form{" "}
        {location.pathname !== "/edit-campaign"
          ? "thêm mới hoàn cảnh"
          : "cập nhật thông tin hoàn cảnh"}
      </h2>
      <Spin tip="Loading..." size="large" spinning={load ? true : false}>
        <div className={styled.font_Form}>
          <Button
            className="huyEdit"
            danger
            onClick={() => history.push("/table-campaign")}
          >
            {location.pathname === "/edit-campaign"
              ? "Hủy Cập Nhật"
              : "Hủy Thêm"}
          </Button>
          <Form
            form={form}
            disabled={noEdit}
            layout="vertical"
            onKeyDown={(e) => (e.key === "Enter" ? e.preventDefault() : "")}
            onFinish={
              location.pathname !== "/edit-campaign" ? onFinish : UpdateCampaign
            }
          >
            <Form.Item
              label="Tiêu Đề Hoàn Cảnh"
              name="TieuDe"
              rules={[
                { required: true, message: "Tiêu đề không được để trống" },
              ]}
              style={{
                maxWidth: "80%",
                margin: "auto",
              }}
            >
              <Input placeholder="Nhập tiêu đề hoàn cảnh" />
            </Form.Item>
            <Form.Item
              label="Địa Chỉ"
              name="DiaChi"
              rules={[
                { required: true, message: "Địa chỉ không được để trống" },
              ]}
              style={{
                maxWidth: "80%",
                margin: "auto",
              }}
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
            <Form.Item
              label="Đối Tượng Quyên Góp"
              name="DoiTuongQuyenGop"
              rules={[
                {
                  required: true,
                  message: "Đối tượng quyên góp không được để trống",
                },
              ]}
              style={{
                maxWidth: "80%",
                margin: "auto",
              }}
            >
              <Select placeholder="Chọn hoàn cảnh quyên góp">
                <Select.Option value="Người Già Và Người Khuyết Tật">
                  Người Già Và Người Khuyết Tật
                </Select.Option>
                <Select.Option value="Trẻ Em">Trẻ Em</Select.Option>
                <Select.Option value="Người Vùng Sâu,Vùng Xa">
                  Người Vùng Sâu,Vùng Xa
                </Select.Option>
                <Select.Option value="Người Bệnh Hiểm Nghèo">
                  Người Bệnh Hiểm Nghèo
                </Select.Option>
                <Select.Option value="Quỹ Bảo Vệ Động Vật">
                  Quỹ Bảo Vệ Động Vật
                </Select.Option>
              </Select>
            </Form.Item>
            <Row
              style={{
                maxWidth: "80%",
                margin: "auto",
              }}
            >
              <Form.Item
                label="Thời Gian Hoạt Động"
                name="ThoiGianHoatDong"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thời gian",
                  },
                ]}
                style={{
                  width: "47.5%",
                  marginRight: "2.5%",
                }}
              >
                <RangePicker
                  format={dateFormatList}
                  disabledDate={(current) =>
                    current.isBefore(moment().subtract(1, "day"))
                  }
                />
              </Form.Item>
              <Form.Item
                label="Số Tiền Huy Động"
                name="SoTienHuyDong"
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
                  width: "47.5%",
                  marginLeft: "2.5%",
                }}
              >
                <InputNumber
                  placeholder="Nhập số tiền huy dộng"
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
            </Row>
            <label
              htmlFor="MoTaHoanCanh"
              style={{
                width: "80%",
                margin: "0 10%",
              }}
            >
              Mô Tả Hoàn Cảnh
            </label>
            <Form.List
              id="MoTaHoanCanh"
              name="MoTaHoanCanh"
              style={{
                maxWidth: "80%",
                margin: "auto",
              }}
              initialValue={[{ NoiDung: "" }]}
            >
              {/* <TextArea rows={4} /> */}
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        maxWidth: "80%",
                        margin: "auto",
                        marginBottom: 8,
                      }}
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "NoiDung"]}
                        rules={[
                          {
                            required: true,
                            message: "mô tả hoàn cảnh không được để trống",
                          },
                        ]}
                        noStyle
                      >
                        <TextArea rows={3} />
                      </Form.Item>
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        span={4}
                      />
                    </div>
                  ))}
                  <Form.Item
                    style={{
                      maxWidth: "40%",
                      margin: "auto",
                    }}
                  >
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm nội dung mô tả
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <div className={styled.upload}>
              <Form.Item
                label={`Hình Ảnh (số lượng : ${fileList.length})`}
                name="HinhAnh"
                getValueProps={normFile}
                rules={[
                  {
                    required: location.pathname === "/create-HC" ? true : false,
                    message: "Hình ảnh không được để trống",
                  },
                  () => ({
                    validator(_, value) {
                      if (!value || fileList.length >= 3) {
                        if (fileList.length <= 10) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Số lượng ảnh tối đa là 10.")
                        );
                      }
                      return Promise.reject(
                        new Error("Số lượng ảnh it nhất là 3.")
                      );
                    },
                  }),
                ]}
              >
                <Upload.Dragger
                  className={styled.parent}
                  name="HinhAnh"
                  action={configApp.apiGateWay + "/upload"}
                  listType="picture"
                  multiple={true}
                  fileList={fileList}
                  maxCount={10}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Thêm hình ảnh của bạn vào đây <br />
                    (số lượng it nhát là 5 và nhiều nhất là 10)
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </div>
            <Modal
              open={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img
                alt="example"
                style={{
                  width: "100%",
                }}
                src={previewImage}
              />
            </Modal>
            <Form.Item wrapperCol={{ span: 1, offset: 10 }}>
              <Button type="primary" htmlType="submit" disabled={isUpload}>
                {location.pathname !== "/edit-campaign"
                  ? "Thêm Hoàn Cảnh"
                  : "Sửa thông tin hoàn cảnh"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </>
  );
};
export default FormCampaign;
