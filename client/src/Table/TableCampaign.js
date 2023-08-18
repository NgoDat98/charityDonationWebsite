import { SearchOutlined } from "@ant-design/icons";
import {
  Input,
  Table,
  Select,
  Pagination,
  DatePicker,
  Tooltip,
  Spin,
  Popconfirm,
  Checkbox,
  Button,
  Tag,
} from "antd";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import CampaignAPI from "../API/CampaignAPI";
import convertMoney from "../convertMoney";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styped from "./table.module.css";
import "./table.css";

const CheckboxGroup = Checkbox.Group;

const TableCampaign = () => {
  const [data, setData] = useState([]);
  const [dataGoc, setDataGoc] = useState([]);
  const [valueMaHoanCanh, setValueMaHoanCanh] = useState("");
  const [valueTieuDe, setValueTieuDe] = useState("");
  const [valueDiaChi, setValueDiaChi] = useState("");
  const [valueDoiTuongQuyenGop, setValueDoiTuongQuyenGop] = useState("");
  const [valueNgayBatDau, setValueNgayBatDau] = useState("");
  const [valueNgayKetThuc, setValueNgayKetThuc] = useState("");
  const [valueSoTienHuyDong, setValueSoTienHuyDong] = useState("");
  const [valueSoTienDaNhan, setValueSoTienDaNhan] = useState("");
  const [valueLuotQuyenGop, setValueLuotQuyenGop] = useState("");
  const [page, setPage] = useState({ page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [checkedList, setCheckedList] = useState([]);

  const history = useHistory();

  //toastify thông báo thành công khi nhận được response chả về thành công
  const notify = (values) =>
    toast.success(values, {
      autoClose: 3000,
    });

  //toastify thông báo thát bại khi nhận được response chả về thất bại
  const notifyError = (values) =>
    toast.error(values, {
      autoClose: 3000,
    });

  // sự kiện chọn mục muốn xóa
  const onChange = (list) => {
    if (list.target.checked) {
      setCheckedList([...checkedList, list.target.options]);
    } else
      setCheckedList(checkedList?.filter((x) => x !== list.target.options));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await CampaignAPI.getAllCampaignPaging(page);
        if (res.message === "lấy dữ liệu thanh công") {
          setDataGoc(res);
          setData(res.data);
          setLoad(false);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        setLoad(false);
        setLoading(false);
      }
    };
    fetchData();
  }, [page, loading]);

  // xử lý phân trang
  //xử lý sự kiện onchang môi khi chuyển trang hoặc thêm mục hiện thì
  const onChangePageCampaign = (page, pageSize) => {
    setPage({ page: page, pageSize: pageSize });
    setLoad(true);
  };
  const item = data?.map((item, index) => {
    item.key = index;
    item.stt = index + 1;
    return item;
  });

  // lọc danh sách data gửi về theo value đang tìm kiếm
  useEffect(() => {
    const filterData = () => {
      const test = dataGoc?.data?.filter(
        (x) =>
          x.MaHoanCanh.toString()
            .toLowerCase()
            .includes(valueMaHoanCanh.toLowerCase()) &&
          x.TieuDe.toString()
            .toLowerCase()
            .includes(valueTieuDe.toLowerCase()) &&
          x.DiaChi.toString()
            .toLowerCase()
            .includes(valueDiaChi.toLowerCase()) &&
          x.DoiTuongQuyenGop.toString()
            .toLowerCase()
            .includes(valueDoiTuongQuyenGop.toLowerCase()) &&
          dinhDangNgay(x.NgayBatDau)
            .toString()
            .toLowerCase()
            .includes(valueNgayBatDau.toLowerCase()) &&
          dinhDangNgay(x.NgayKetThuc)
            .toString()
            .toLowerCase()
            .includes(valueNgayKetThuc.toLowerCase()) &&
          x.SoTienHuyDong?.toString()
            .toLowerCase()
            .includes(valueSoTienHuyDong.toLowerCase()) &&
          x.SoTienDaNhan?.toString()
            .toLowerCase()
            .includes(valueSoTienDaNhan.toLowerCase()) &&
          x.LuotQuyenGop?.toString()
            .toLowerCase()
            .includes(valueLuotQuyenGop.toLowerCase())
      );

      setData(test);
    };
    filterData();
  }, [
    valueMaHoanCanh,
    valueTieuDe,
    valueDiaChi,
    valueDoiTuongQuyenGop,
    valueNgayBatDau,
    valueNgayKetThuc,
    valueSoTienHuyDong,
    valueSoTienDaNhan,
    valueLuotQuyenGop,
  ]);
  // mẫu input nhập value tìm kiếm
  const inputSelecter = (title, value) => (
    <div className="ant-input-affix-wrapper custom-text-input">
      <span
        style={{ fontSize: "110%", margin: "0px 5px", alignSelf: "center" }}
      >
        <SearchOutlined style={{ color: "#a0aab3" }} />
      </span>
      <Input
        placeholder={`${title}`}
        onChange={(e) => {
          value(e.target.value);
        }}
        style={{ border: "none" }}
      />
    </div>
  );
  const Selected = (title, value) => (
    <Select
      labelInValue
      defaultValue={{
        value: "",
        label: "tất cả",
      }}
      style={{ width: 180 }}
      onChange={(e) => value(e.value)}
      options={[...title]}
    />
  );

  const DateInput = (title, value) => {
    const onChange = (date, dateString) => {
      value(dateString);
    };
    const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

    return (
      <DatePicker
        placeholder={title}
        format={dateFormatList}
        onChange={onChange}
      />
    );
  };

  //hàm sư lsy định dạng ngày dd/mm/yyyy
  const dinhDangNgay = (a) => {
    const day = new Date(a);
    return `${day.getDate().toString().padStart(2, "0")}/${(day.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${day.getFullYear()}`;
  };

  // kiểu hàng được tạo sẵn
  const columns = [
    {
      title: "",
      // (
      //   <Checkbox
      //     // indeterminate={indeterminate}
      //     onChange={onCheckAllChange}
      //     checked={checkAll}
      //   ></Checkbox>
      // )
      children: [
        {
          width: 40,
          dataIndex: "_id",
          fixed: "left",
          render: function a(_, data) {
            return (
              <Checkbox options={data?._id} onChange={onChange}></Checkbox>
            );
          },
        },
      ],
    },
    {
      title: "STT",
      children: [
        {
          title: "",
          dataIndex: "stt",
          width: 60,
          fixed: "left",
        },
      ],
    },
    {
      title: "Trạng Thái",
      children: [
        {
          width: 150,
          className: "tdcenter",
          render: (_, status) => {
            if (status?.TrangThai === "Đã hoàn thành") {
              return (
                <Tag className="tag" color={"#FAAD14"}>
                  {status?.TrangThai}
                </Tag>
              );
            }
            if (
              new Date(status?.NgayKetThuc) >= new Date() &&
              status?.TrangThai === "Chưa hoàn thành"
            ) {
              return (
                <Tag className="tag" color={"#6ABE39"}>
                  {status?.TrangThai}
                </Tag>
              );
            }
            if (
              new Date(status?.NgayKetThuc) < new Date() &&
              status?.TrangThai === "Chưa hoàn thành"
            ) {
              return (
                <Tag className="tag" color={"#638be8"}>
                  Hết thời gian
                </Tag>
              );
            }
          },
        },
      ],
    },
    {
      title: "Mã Hoàn Cảnh",
      children: [
        {
          title: inputSelecter("Tìm kiếm", setValueMaHoanCanh),
          dataIndex: "MaHoanCanh",
          width: 150,
        },
      ],
    },
    {
      title: "Tiêu Đề",
      children: [
        {
          title: inputSelecter("Tìm kiếm", setValueTieuDe),
          dataIndex: "TieuDe",
          width: 200,
          ellipsis: {
            showTitle: false,
          },
          render: (TieuDe) => (
            <Tooltip placement="topLeft" title={TieuDe} color="#0798db">
              {TieuDe}
            </Tooltip>
          ),
        },
      ],
    },
    {
      title: "Địa Chỉ",
      children: [
        {
          title: inputSelecter("Tìm kiếm", setValueDiaChi),
          dataIndex: "DiaChi",
          width: 200,
          ellipsis: {
            showTitle: false,
          },
          render: (DiaChi) => (
            <Tooltip placement="topLeft" title={DiaChi} color="#0798db">
              {DiaChi}
            </Tooltip>
          ),
        },
      ],
    },
    {
      title: "Đôi Tượng Quyên Góp",
      children: [
        {
          title: Selected(
            [
              {
                value: "",
                label: "tất cả",
              },
              {
                value: "Người Già Và Người Khuyết Tật",
                label: "Người Già Và Người Khuyết Tật",
              },
              {
                value: "Trẻ Em",
                label: "Trẻ Em",
              },
              {
                value: "Người Vùng Sâu,Vùng Xa",
                label: "Người Vùng Sâu,Vùng Xa",
              },
              {
                value: "Bảo Vệ Động Vật",
                label: "Bảo Vệ Động Vật",
              },
            ],
            setValueDoiTuongQuyenGop
          ),
          dataIndex: "DoiTuongQuyenGop",
          width: 200,
        },
      ],
    },
    {
      title: "Ngày Băt Đầu",
      children: [
        {
          title: DateInput("dd/mm/yyyy", setValueNgayBatDau),
          dataIndex: "NgayBatDau",
          width: 200,
          render: (NgayBatDau) => {
            return dinhDangNgay(NgayBatDau);
          },
        },
      ],
    },
    {
      title: "Ngày Kết Thúc",
      children: [
        {
          title: DateInput("dd/mm/yyyy", setValueNgayKetThuc),
          dataIndex: "NgayKetThuc",
          width: 200,
          render: (NgayKetThuc) => {
            return dinhDangNgay(NgayKetThuc);
          },
        },
      ],
    },
    {
      title: "Số Tiền Huy Động",
      children: [
        {
          title: inputSelecter("Tim kiếm", setValueSoTienHuyDong),
          dataIndex: "SoTienHuyDong",
          width: 200,
          render: (SoTienHuyDong) => {
            return convertMoney(SoTienHuyDong) + " " + "VND";
          },
        },
      ],
    },
    {
      title: "Số Tiền Đã Nhận",
      children: [
        {
          title: inputSelecter("Tim kiếm", setValueSoTienDaNhan),
          dataIndex: "SoTienDaNhan",
          width: 200,
          render: (SoTienDaNhan) => {
            return convertMoney(SoTienDaNhan) + " " + "VND";
          },
        },
      ],
    },
    {
      title: "Lượt Quyên Góp",
      children: [
        {
          title: inputSelecter("Tim kiếm", setValueLuotQuyenGop),
          dataIndex: "LuotQuyenGop",
          width: 150,
        },
      ],
    },
    {
      title: "Thao tác",
      children: [
        {
          title:
            checkedList.length > 0 ? (
              <Popconfirm
                placement="left"
                title="Bạn có chắc muốn xóa các đợt quyên góp này?"
                description="Sau khi xóa sẽ không thể hoàn tác được bạn vẫn muốn tiếp tục?"
                onConfirm={async () => {
                  setLoad(true);
                  try {
                    const res = await CampaignAPI.postRemoveManyCampaign({
                      arrCampaignId: checkedList,
                    });
                    if (res.message === "Đã xóa thành công!") {
                      setLoad(false);
                      setLoading(true);
                      setCheckedList([]);
                      notify(res.message);
                    }
                  } catch (err) {
                    console.log(err);
                    setLoad(false);
                    notifyError(err);
                  }
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button type="dashed" danger size="small">
                  Xóa mục đã chọn
                </Button>
              </Popconfirm>
            ) : (
              ""
            ),
          key: "operation",
          fixed: "right",
          width: 150,
          render: function a(_, data) {
            return (
              checkedList.length === 0 && (
                <div style={{ textAlign: "center", display: "flex" }}>
                  <Tooltip title="Xem" placement="top" color="#0000007a">
                    <button
                      className={styped.btnButtom}
                      onClick={() =>
                        history.push({
                          pathname: `/quyengop/${data._id}`,
                          state: data._id,
                        })
                      }
                    >
                      <svg
                        width="30"
                        height="36"
                        viewBox="0 0 37 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.4998 21.7524C19.6001 21.7524 20.5344 21.368 21.3027 20.599C22.0716 19.8307 22.4561 18.8964 22.4561 17.7961C22.4561 16.6958 22.0716 15.7615 21.3027 14.9932C20.5344 14.2243 19.6001 13.8398 18.4998 13.8398C17.3994 13.8398 16.4651 14.2243 15.6968 14.9932C14.9279 15.7615 14.5434 16.6958 14.5434 17.7961C14.5434 18.8964 14.9279 19.8307 15.6968 20.599C16.4651 21.368 17.3994 21.7524 18.4998 21.7524ZM18.4998 20.4175C17.7716 20.4175 17.1528 20.1625 16.6434 19.6524C16.1334 19.143 15.8784 18.5243 15.8784 17.7961C15.8784 17.068 16.1334 16.4489 16.6434 15.9388C17.1528 15.4295 17.7716 15.1748 18.4998 15.1748C19.2279 15.1748 19.847 15.4295 20.357 15.9388C20.8664 16.4489 21.1211 17.068 21.1211 17.7961C21.1211 18.5243 20.8664 19.143 20.357 19.6524C19.847 20.1625 19.2279 20.4175 18.4998 20.4175ZM18.4998 24.5922C16.38 24.5922 14.4341 24.034 12.6619 22.9175C10.8904 21.801 9.53535 20.288 8.59684 18.3786C8.56448 18.3139 8.54021 18.2288 8.52403 18.1233C8.50785 18.0184 8.49976 17.9094 8.49976 17.7961C8.49976 17.6828 8.50785 17.5735 8.52403 17.468C8.54021 17.3631 8.56448 17.2783 8.59684 17.2136C9.53535 15.3042 10.8904 13.7913 12.6619 12.6748C14.4341 11.5583 16.38 11 18.4998 11C20.6195 11 22.5651 11.5583 24.3366 12.6748C26.1088 13.7913 27.4642 15.3042 28.4027 17.2136C28.435 17.2783 28.4593 17.3631 28.4755 17.468C28.4917 17.5735 28.4998 17.6828 28.4998 17.7961C28.4998 17.9094 28.4917 18.0184 28.4755 18.1233C28.4593 18.2288 28.435 18.3139 28.4027 18.3786C27.4642 20.288 26.1088 21.801 24.3366 22.9175C22.5651 24.034 20.6195 24.5922 18.4998 24.5922ZM18.4998 23.1359C20.3282 23.1359 22.0072 22.6544 23.5366 21.6913C25.0655 20.7288 26.2344 19.4304 27.0434 17.7961C26.2344 16.1618 25.0655 14.8631 23.5366 13.9C22.0072 12.9375 20.3282 12.4563 18.4998 12.4563C16.6713 12.4563 14.9923 12.9375 13.4629 13.9C11.9341 14.8631 10.7651 16.1618 9.95607 17.7961C10.7651 19.4304 11.9341 20.7288 13.4629 21.6913C14.9923 22.6544 16.6713 23.1359 18.4998 23.1359Z"
                          fill="#212121"
                        ></path>
                      </svg>
                    </button>
                  </Tooltip>
                  <Tooltip title="Sửa" placement="top" color="#0000007a">
                    <button
                      className={styped.btnButtom}
                      onClick={() =>
                        history.push({
                          pathname: `/edit-campaign`,
                          state: data._id,
                        })
                      }
                    >
                      <svg
                        width="30"
                        height="36"
                        viewBox="0 0 37 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.65 25H12.9L22.15 15.75L20.925 14.5L11.65 23.775V25ZM25.35 14.65L21.975 11.3L23.3 9.99995C23.5834 9.71662 23.9377 9.57495 24.363 9.57495C24.7877 9.57495 25.1417 9.71662 25.425 9.99995L26.65 11.225C26.9334 11.525 27.0834 11.879 27.1 12.287C27.1167 12.6956 26.975 13.0416 26.675 13.325L25.35 14.65ZM11.05 26.5C10.8 26.5 10.5877 26.4126 10.413 26.238C10.2377 26.0626 10.15 25.85 10.15 25.6V23.5C10.15 23.3833 10.171 23.271 10.213 23.163C10.2544 23.0543 10.325 22.95 10.425 22.85L20.9 12.375L24.275 15.75L13.8 26.225C13.7 26.325 13.596 26.396 13.488 26.438C13.3794 26.4793 13.2667 26.5 13.15 26.5H11.05ZM21.525 15.125L20.925 14.5L22.15 15.75L21.525 15.125Z"
                          fill="#212121"
                        ></path>
                      </svg>
                    </button>
                  </Tooltip>
                  <Popconfirm
                    placement="left"
                    title="Bạn có chắc muốn xóa đợt quyên góp này?"
                    description="Sau khi xóa sẽ không thể hoàn tác được bạn vẫn muốn tiếp tục?"
                    onConfirm={async () => {
                      setLoad(true);
                      try {
                        const res = await CampaignAPI.postRemoveCampaign({
                          campaignId: data._id,
                        });
                        if (res.message === "Đã xóa campaign thành công!") {
                          setLoad(false);
                          setLoading(true);
                          notify(res.message);
                        }
                      } catch (err) {
                        console.log(err);
                        setLoad(false);
                        notifyError(err);
                      }
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <button className={styped.btnButtom}>
                      <Tooltip title="Xóa" placement="top" color="#ff0101a3">
                        <svg
                          width="15"
                          height="36"
                          viewBox="0 0 448 512"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"
                            fill="red"
                          ></path>
                        </svg>
                      </Tooltip>
                    </button>
                  </Popconfirm>
                </div>
              )
            );
          },
        },
      ],
    },
  ];

  return (
    <div>
      <ToastContainer />
      <h2 className="title-table">Danh Sách Đợt Quyên Góp</h2>
      <Spin tip="Loading..." spinning={load} size="large">
        <Table
          columns={columns}
          dataSource={item}
          scroll={{ x: 1300, y: 300 }}
          className={styped.tableMain}
          pagination={{ style: { display: "none" }, pageSize: page.pageSize }}
        />
      </Spin>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "2% 0",
        }}
      >
        <Pagination
          defaultCurrent={page.page}
          defaultPageSize={page.pageSize}
          current={page?.page}
          pageSizeOptions={[5, 10, 20, 50]}
          onChange={onChangePageCampaign}
          total={dataGoc?.total}
          showSizeChanger
        />
      </div>
    </div>
  );
};

export default TableCampaign;
