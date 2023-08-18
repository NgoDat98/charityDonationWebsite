import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Button,
  Progress,
  Typography,
  Pagination,
  Tooltip,
  Spin,
  Empty,
} from "antd";
import { valuesContext } from "../App";
import convertMoney from "../convertMoney";
import { Link, useHistory, useParams } from "react-router-dom";
import Image from "../Img/Image";
import CampaignAPI from "../API/CampaignAPI";
import styled from "./Programme.module.css";

const { Meta } = Card;
const { Text } = Typography;

function Programme(props) {
  const [products, setProducts] = useState([]);
  const [data, setData] = useState([]);
  const [pageUnfCampaign, setPageUnfCampaign] = useState({
    page: 1,
    pageSize: 6,
  });
  const [dataUnfCamapaign, setDataUnfCamapaign] = useState([]);
  const [unfLoad, setUnfLoad] = useState(false);

  const [pageCmpCampaign, setPageCmpCampaign] = useState({
    page: 1,
    pageSize: 6,
  });
  const [dataCmpCamapaign, setDataCmpCamapaign] = useState([]);
  const [CmpLoad, setCmpLoad] = useState(false);

  const notifyError = useContext(valuesContext).notifyError;
  const { programme, id } = useParams();

  const history = useHistory();
  //xử lý sự kiện onchang môi khi chuyển trang hoặc thêm mục hiện thì trong đợt quyên góp chưa hoàn thành
  const onChangePageUnfCampaign = (page, pageSize) => {
    setPageUnfCampaign({ page: page, pageSize: pageSize });
    setUnfLoad(true);
  };
  //xử lý sự kiện onchang môi khi chuyển trang hoặc thêm mục hiện thì trong đợt quyên góp đã hoàn thành
  const onChangePageCmpCampaign = (page, pageSize) => {
    setPageCmpCampaign({ page: page, pageSize: pageSize });
    setCmpLoad(true);
  };

  //Get dữ liệu campaign chưa hoàn thành cà đã phân trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await CampaignAPI.postUnfCampaignType({
          type: history.location.state?.title,
          page: pageUnfCampaign.page,
          pageSize: pageUnfCampaign.pageSize,
        });
        if (res.message === "lấy dữ liệu thanh công") {
          setDataUnfCamapaign(res);
          setUnfLoad(false);
        }
      } catch (err) {
        console.log(err);
        setUnfLoad(false);
        notifyError(err?.response?.data?.errors[0].msg);
      }
    };

    fetchData();
  }, [pageUnfCampaign, history.location.state?.title]);

  // Get dữ liệu campaign đã hoàn thành cà đã phân trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await CampaignAPI.postCmpCampaignType({
          type: history.location.state?.title,
          page: pageUnfCampaign.page,
          pageSize: pageUnfCampaign.pageSize,
        });
        if (res.message === "lấy dữ liệu thanh công") {
          setDataCmpCamapaign(res);
          setCmpLoad(false);
        }
      } catch (err) {
        console.log(err);
        setCmpLoad(false);
        notifyError(err?.response?.data?.errors[0].msg);
      }
    };

    fetchData();
  }, [pageCmpCampaign, history.location.state?.title]);

  const title = history.location.state?.title;

  return (
    <div className="page-holder" style={{ margin: "0 0 20px 0" }}>
      <header className="header bg-white">
        <div className="container">
          <section
            className="hero pb-3 bg-cover bg-center d-flex align-items-center"
            style={{
              backgroundImage: `url(${Image.img5})`,
              minHeight: "450px",
            }}
          >
            <div className="container py-5">
              <div className="row px-4 px-lg-5">
                <div className={styled.banner}>
                  {/* <p className="text-muted small text-uppercase mb-2">
                    New Inspiration 2020
                  </p> */}
                  <h1 className="h2  mb-3" style={{ color: "#ff00c3" }}>
                    {title === "Trẻ Em"
                      ? "Vì Trẻ Em"
                      : title === "Người Già Và Người Khuyết Tật"
                      ? "Người Già, Người Khuyết Tật"
                      : title === "Người Vùng Sâu,Vùng Xa"
                      ? "Người Vùng Sâu,Vùng Xa"
                      : "Cứu Trợ Động Vật"}
                  </h1>
                  <p
                    style={{
                      color: "#ff00c3",
                      fontWeight: "600",
                      fontSize: "larger",
                    }}
                  >
                    {title === "Trẻ Em"
                      ? "Giúp đỡ trẻ em vùng cao, trẻ em nghèo, mồ côi, có hoàn cảnh khó khăn"
                      : title === "Người Già Và Người Khuyết Tật"
                      ? "Giúp đỡ người già neo đơn, người vô gia cư, không nơi nương tựa"
                      : title === "Người Vùng Sâu,Vùng Xa"
                      ? "Giúp đỡ vùng sâu, người vung cao, người có hoàn cảnh khó khăn"
                      : "Cứu trợ động vật, chó mèo bị bỏ rơi hoặc bị thương cần được chữa trị và chăm sóc phục hồi"}
                  </p>
                </div>
              </div>
            </div>
          </section>
          {dataUnfCamapaign.data?.length > 0 && (
            <section className="pt-5">
              <header className="text-center">
                {/* <p className="small text-muted small text-uppercase mb-1">
                Carefully created collections
              </p> */}
                <h2
                  className="h5 text-uppercase mb-4"
                  style={{ color: "#0798db" }}
                >
                  Những đợt quyên góp đang được tiến hành
                </h2>
              </header>
              <Spin tip="Loading..." spinning={unfLoad} size="large">
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {dataUnfCamapaign?.data?.length > 0 &&
                    dataUnfCamapaign?.data?.map((item, index) => (
                      <Card
                        key={index}
                        hoverable
                        style={{ width: "31%", margin: "1% 1% 1% 1%" }}
                        cover={
                          <img
                            alt="example"
                            src={item.HinhAnh.length > 0 && item.HinhAnh[0].url}
                          />
                        }
                        actions={[
                          <Button
                            type="primary"
                            onClick={() =>
                              history.push({
                                pathname: `/quyengop/${item._id}`,
                                state: item,
                              })
                            }
                          >
                            Đóng Góp
                          </Button>,
                        ]}
                      >
                        <Tooltip
                          title={item.TieuDe}
                          placement="bottom"
                          color="#0798db"
                        >
                          <div>
                            <Meta
                              title={item.TieuDe}
                              style={{ marginBottom: 10 }}
                            />
                          </div>
                        </Tooltip>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text
                              style={{
                                backgroundColor: "#86d9ffbf",
                                color: "#3a83e6",
                                padding: "1% 2% 1% 2%",
                                borderRadius: "5px",
                              }}
                            >
                              {item.MaHoanCanh}
                            </Text>
                            <Text
                              style={{
                                backgroundColor: "#d7ad2f61",
                                color: "#ff9900",
                                padding: "1% 2% 1% 2%",
                                borderRadius: "5px",
                              }}
                            >
                              Còn{" "}
                              {(new Date(item.NgayKetThuc) -
                                new Date(item.NgayBatDau)) /
                                1000 /
                                60 /
                                60 /
                                24}{" "}
                              ngày
                            </Text>
                          </div>
                          <Row>
                            <Text strong>
                              {convertMoney(
                                item.SoTienDaNhan ? item.SoTienDaNhan : 0
                              )}
                              đ
                            </Text>
                            <Text>/{convertMoney(item.SoTienHuyDong)}đ</Text>
                          </Row>
                          <Progress
                            strokeColor="#0798db"
                            percent={(
                              ((item.SoTienDaNhan ? item.SoTienDaNhan : 0) /
                                item.SoTienHuyDong) *
                              100
                            ).toFixed(2)}
                            showInfo={false}
                          />
                          <Row className={styled.solieu}>
                            <Col span={12}>
                              <p>Lượt quyên góp</p>
                              <p>
                                <b>
                                  {item.LuotQuyenGop ? item.LuotQuyenGop : 0}
                                </b>
                              </p>
                            </Col>
                            <Col span={12}>
                              <p>Đạt được</p>
                              <p>
                                <b>
                                  {(
                                    ((item.SoTienDaNhan
                                      ? item.SoTienDaNhan
                                      : 0) /
                                      item.SoTienHuyDong) *
                                    100
                                  ).toFixed(2)}
                                  %
                                </b>
                              </p>
                            </Col>
                          </Row>
                        </div>
                      </Card>
                    ))}
                </div>
              </Spin>
              <Pagination
                defaultCurrent={pageUnfCampaign.page}
                defaultPageSize={pageUnfCampaign.pageSize}
                current={pageUnfCampaign?.page}
                // total={data.length}
                // showTotal={showTotal}
                pageSizeOptions={[6, 12, 24, 48]}
                onChange={onChangePageUnfCampaign}
                total={dataUnfCamapaign.total}
                showSizeChanger
                style={{ textAlign: "center" }}
              />
            </section>
          )}
          {dataUnfCamapaign.data?.length === 0 && (
            <section className="pt-5">
              <header className="text-center">
                {/* <p className="small text-muted small text-uppercase mb-1">
                Carefully created collections
              </p> */}
                <h2
                  className="h5 text-uppercase mb-4"
                  style={{ color: "#0798db" }}
                >
                  Những đợt quyên góp đang được tiến hành
                </h2>
              </header>
              <Empty description={false}>
                <p>Hiện không có đợt quyên góp nào được tiến hành</p>
              </Empty>
            </section>
          )}
          {dataCmpCamapaign.data?.length > 0 && (
            <section className="pt-5">
              <header className="text-center">
                {/* <p className="small text-muted small text-uppercase mb-1">
                Carefully created collections
              </p> */}
                <h2
                  className="h5 text-uppercase mb-4"
                  style={{ color: "#db07b1" }}
                >
                  Những đợt quyên góp Đã Hoàn Thành
                </h2>
              </header>
              <Spin tip="Loading..." spinning={CmpLoad} size="large">
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {dataCmpCamapaign?.data?.length > 0 &&
                    dataCmpCamapaign?.data?.map((item, index) => (
                      <Card
                        key={index}
                        hoverable
                        style={{ width: "31%", margin: "1% 1% 1% 1%" }}
                        cover={
                          <img
                            alt="example"
                            src={item.HinhAnh.length > 0 && item.HinhAnh[0].url}
                          />
                        }
                        actions={[
                          <Button
                            type="text"
                            onClick={() =>
                              history.push({
                                pathname: `/xem/${item._id}`,
                                state: item._id,
                              })
                            }
                          >
                            Chi Tiết
                          </Button>,
                        ]}
                      >
                        <Tooltip
                          title={item.TieuDe}
                          placement="bottom"
                          color="#0798db"
                        >
                          <div>
                            <Meta
                              title={item.TieuDe}
                              style={{ marginBottom: 10 }}
                            />
                          </div>
                        </Tooltip>
                        <div>
                          <Text
                            style={{
                              backgroundColor: "#d7ad2f61",
                              color: "#ff9900",
                              padding: "1% 2% 1% 2%",
                              borderRadius: "5px",
                            }}
                          >
                            Còn{" "}
                            {(new Date(item.NgayKetThuc) -
                              new Date(item.NgayBatDau)) /
                              1000 /
                              60 /
                              60 /
                              24}{" "}
                            ngày
                          </Text>
                          <Row>
                            <Text strong>
                              {convertMoney(item.SoTienDaNhan)}đ
                            </Text>
                            <Text>/{convertMoney(item.SoTienHuyDong)}đ</Text>
                          </Row>
                          <Progress
                            strokeColor="#0798db"
                            percent={(
                              (item.SoTienDaNhan / item.SoTienHuyDong) *
                              100
                            ).toFixed(2)}
                            showInfo={false}
                          />
                          <Row className={styled.solieu}>
                            <Col span={12}>
                              <p>Lượt quyên góp</p>
                              <p>
                                <b>{item.LuotQuyenGop}</b>
                              </p>
                            </Col>
                            <Col span={12}>
                              <p>Đạt được</p>
                              <p>
                                <b>
                                  {(
                                    (item.SoTienDaNhan / item.SoTienHuyDong) *
                                    100
                                  ).toFixed(2)}
                                  %
                                </b>
                              </p>
                            </Col>
                          </Row>
                        </div>
                      </Card>
                    ))}
                </div>
              </Spin>
              <Pagination
                defaultCurrent={pageCmpCampaign.page}
                defaultPageSize={pageCmpCampaign.pageSize}
                current={pageCmpCampaign?.page}
                // total={data.length}
                // showTotal={showTotal}
                pageSizeOptions={[6, 12, 24, 48]}
                onChange={onChangePageCmpCampaign}
                total={dataCmpCamapaign.total}
                showSizeChanger
                style={{ textAlign: "center" }}
              />
            </section>
          )}
          {dataCmpCamapaign.data?.length === 0 && (
            <section className="pt-5">
              <header className="text-center">
                {/* <p className="small text-muted small text-uppercase mb-1">
                Carefully created collections
              </p> */}
                <h2
                  className="h5 text-uppercase mb-4"
                  style={{ color: "#0798db" }}
                >
                  Những đợt quyên góp Đã Hoàn Thành
                </h2>
              </header>
              <Empty description={false}>
                <p>Hiện chưa có đợt quyên góp nào hoàn thành</p>
              </Empty>
            </section>
          )}
        </div>
      </header>
    </div>
  );
}

export default Programme;
