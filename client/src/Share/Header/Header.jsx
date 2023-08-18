import {
  HomeOutlined,
  CalendarOutlined,
  HeartOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  UserSwitchOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Button, Menu, Collapse, Space, Breadcrumb } from "antd";
import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { valuesContext } from "../../App";
import Image from "../../Img/Image";
import styled from "./Header.module.css";
import "./Header.css";

const { Panel } = Collapse;
function getItem(label, key, icon, children, title, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
    title,
  };
}
const Header = () => {
  const [current, setCurrent] = useState("/");
  const [collapsed, setCollapsed] = useState(false);
  const [width, setWidth] = useState(0);

  const location = useLocation();
  const history = useHistory();

  // console.log(location);
  const data = useContext(valuesContext).data;
  const auth = useContext(valuesContext).loadAuth;

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const items = [
    getItem("Trang Chủ", "/", <HomeOutlined />),
    getItem("Chương Trình", "/ChuongTrinh", <CalendarOutlined />, [
      getItem(
        "Người Già Và Người Khuyết Tật",
        "/ChuongTrinh/nguoi-gia-va-nguoi-khuyet-tat/null",
        "",
        "",
        "Người Già Và Người Khuyết Tật"
      ),
      getItem(
        "Quỹ Vì Trẻ Em",
        "/ChuongTrinh/quy-vi-tre-em/null",
        "",
        "",
        "Trẻ Em"
      ),
      getItem(
        "Người Vùng Sâu,Vùng Xa",
        "/ChuongTrinh/nguoi-vung-sau-vung-xa/null",
        "",
        "",
        "Người Vùng Sâu,Vùng Xa"
      ),
      getItem(
        "Quỹ Bảo Vệ Động Vật",
        "/ChuongTrinh/quy-bao-ve-dong-vat/null",
        "",
        "",
        "Quỹ Bảo Vệ Động Vật"
      ),
    ]),
    getItem("Giới Thiệu", "/GioiThieu", <HeartOutlined />, [
      getItem("Tổ Chức", "/to-chuc"),
    ]),
    data?.mesaage === "Đăng nhập thành công" &&
      getItem("Người dùng", "/NguoiDung", <UserOutlined />, [
        getItem(
          "Thông Tin Tài Khoản",
          `/ThongTintaiKhoan/${data?.data?.userId}`
        ),
        getItem(
          "Cập Nhât Thông Tin Tài Khoản",
          `/CapNhatThongTinTaiKhoan/${data?.data?.userId}`
        ),
      ]),
    data?.data?.VaiTro === "admin" &&
      getItem("Quản Lý Webpage", "/QuanLyWebpage", <AppstoreOutlined />, [
        getItem("Danh sách Đợt Quyên Góp", "/table-campaign"),
        getItem("Thêm Mới Đợt Quyên Góp", "/create-campaign"),
        getItem("Danh sách Người Dùng", "/table-user"),
        getItem("Thêm Người Dùng", "/create-user"),
        getItem("Danh sách Quyên Góp", "/table-donation"),
      ]),
    width < 850 &&
      data?.mesaage !== "Đăng nhập thành công" &&
      getItem("Đăng Nhập", "/signin", <UserSwitchOutlined />),
    width < 850 &&
      data?.mesaage !== "Đăng nhập thành công" &&
      getItem("Đăng Ký", "/signup", <UserSwitchOutlined />),
    width < 850 &&
      data &&
      getItem(
        "Đăng Xuất",
        "DangXuat",
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={20}
          fill="#ffffffa6"
          viewBox="0 0 512 512"
        >
          <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
        </svg>
      ),
  ];

  useEffect(() => {
    if (
      location?.pathname?.split("/")[1] !== "ThongTintaiKhoan" &&
      location?.pathname?.split("/")[1] !== "CapNhatThongTinTaiKhoan" &&
      location?.pathname?.split("/")[1] !== "ChuongTrinh"
    ) {
      setCurrent("/" + location.pathname.split("/")[1]);
    } else if (location?.pathname?.split("/")[1] === "ChuongTrinh") {
      setCurrent(
        "/" +
          location.pathname.split("/")[1] +
          "/" +
          location.pathname.split("/")[2] +
          "/" +
          "null"
      );
    } else {
      setCurrent(
        "/" + location.pathname.split("/")[1] + "/" + data?.data?.userId
      );
    }
  }, [location.pathname]);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onClick2 = (e) => {
    if (e.key === "DangXuat") {
      auth(true);
      window.localStorage.removeItem("User");
      history.push("/signin");
    } else if (e.key === "/signin") {
      history.push("/signin", { pathName: location.pathname });
    } else {
      history.push(e.key, { title: e.item.props.title });
      setCurrent(e.key);
    }
    setCollapsed(false);
  };

  return (
    <div className={styled.header}>
      <div className={styled.font_header}>
        <div>
          <img src={Image.logo} alt="logo" />
        </div>
        {width > 850 && (
          <div className={styled.button_auth}>
            {data && (
              <Collapse ghost expandIconPosition="end">
                <Panel
                  className="panel-dangxuat"
                  header={`Hello ${data?.data?.HoVaTen}!`}
                >
                  <Link to="/signin">
                    <Button
                      type="ghost"
                      style={{ display: "flex", flexDirection: "row" }}
                      onClick={() => {
                        auth(true);
                        window.localStorage.removeItem("User");
                      }}
                    >
                      <Space style={{ padding: "0 3px 0 0" }}>
                        {
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={20}
                            fill="#0798db"
                            viewBox="0 0 512 512"
                          >
                            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                          </svg>
                        }
                      </Space>
                      Đăng Xuất
                    </Button>
                  </Link>
                </Panel>
              </Collapse>
            )}
            {!data && (
              <>
                {location.pathname !== "/signin" && (
                  <Button
                    type="ghost"
                    onClick={() =>
                      history.push("/signin", { pathName: location.pathname })
                    }
                  >
                    Đăng Nhập
                  </Button>
                )}
                {location.pathname !== "/signup" && (
                  <Link to="/signup">
                    <Button type="ghost">Đăng Ký</Button>
                  </Link>
                )}
              </>
            )}
          </div>
        )}
        {width < 850 && (
          <Button type="primary" onClick={toggleCollapsed}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        )}
      </div>
      {width > 850 && (
        <Menu
          className={styled.nav}
          style={{ fontSize: "100%", width: "80%", margin: "0 10% 20px 10%" }}
          // defaultSelectedKeys={"/"}
          // defaultOpenKeys={"Trang Chủ"}
          onClick={onClick2}
          mode="horizontal"
          theme="light"
          selectedKeys={[current]}
          items={items}
          // onSelect={(e) => {
          //   if (e.item.props.title) console.log(e.item.props.title);
          // }}
        />
      )}

      {width <= 850 && (
        <div className={collapsed ? styled.close : styled.font_nav}>
          <Menu
            // defaultSelectedKeys={"/"}
            // defaultOpenKeys={"Trang Chủ"}
            onClick={onClick2}
            mode="inline"
            inlineCollapsed={width <= 400 ? true : false}
            theme="dark"
            selectedKeys={[current]}
            items={items}
          />
          <img src={Image.logo} alt="anh_logo.jpg" />
        </div>
      )}
    </div>
  );
};
export default Header;
