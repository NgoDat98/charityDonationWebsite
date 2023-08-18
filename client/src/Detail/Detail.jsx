import React, { useState, useEffect, useContext } from "react";
import {
  Tabs,
  Card,
  Button,
  Row,
  Col,
  Typography,
  Progress,
  Divider,
  List,
  Pagination,
  Spin,
} from "antd";
import { useParams, useLocation, useHistory } from "react-router-dom";
import CampaignAPI from "../API/CampaignAPI";
import DonationAPI from "../API/DonationsAPI";
import Slider from "react-slick";
import convertMoney from "../convertMoney";
import { valuesContext } from "../App";

import FormDonations from "../Form/Form_quyengop/FormDonations";
import styled from "./Detail.module.css";
import "./Detail.css";

const Detail = () => {
  const [data, setData] = useState("");
  const [open, setOpen] = useState(false);
  const [dataDonationsSortedMoney, setDataDonationsSortedMoney] = useState("");
  const [loadDonationsSortedMoney, setLoadDonationsSortedMoney] =
    useState(false);
  const [pageDonationsSortedMoney, setPageDonationsSortedMoney] = useState({
    page: 1,
    pageSize: 10,
  });
  const [dataDonationsSortedDate, setDataDonationsSortedDate] = useState("");
  const [loadDonationsSortedDate, setLoadDonationsSortedDate] = useState(false);
  const [pageDonationsSortedDate, setPageDonationsSortedDate] = useState({
    page: 1,
    pageSize: 10,
  });

  // window.scrollTo(0, 0);
  const notifyError = useContext(valuesContext).notifyError;
  const location = useLocation();
  const { id } = useParams();
  const { Meta } = Card;
  const { Text } = Typography;

  const type = location.pathname.split("/")[1];

  const settings = {
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };
  const openModal = (e) => setOpen(e);
  //hàm sử lý định dạng ngày DD/MM/YYYY
  const dinhDangDate = (day) => {
    const date = new Date(day);
    return (
      date.getDate().toString().padStart(2, "0") +
      "/" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      date.getFullYear()
    );
  };
  //thay đổi state page
  const onChangePageDonationsSortedMoney = (page, pageSize) => {
    setPageDonationsSortedMoney({ page: page, pageSize: pageSize });
    setLoadDonationsSortedMoney(true);
  };
  //thay đổi state page
  const onChangePageDonationsSortedDate = (page, pageSize) => {
    setPageDonationsSortedDate({ page: page, pageSize: pageSize });
    setLoadDonationsSortedDate(true);
  };
  //get dữ liệu campaign theo campaignId
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await CampaignAPI.getFindCampaign(id);
        setData(res);
      } catch (err) {
        console.log(err);
        notifyError(err?.response?.data?.errors[0].msg);
      }
    };
    fetchData();
  }, [id]);
  //get Donation theo campaignId được sắp xếp theo số tiền quyên góp
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await DonationAPI.getDonationsByCampaignIdSortedMoney({
          campaignId: id,
          page: pageDonationsSortedMoney.page,
          pageSize: pageDonationsSortedMoney.pageSize,
        });
        if (res.message === "lấy dữ liệu thành công!") {
          setDataDonationsSortedMoney(res);
          setLoadDonationsSortedMoney(false);
        }
      } catch (err) {
        console.log(err);
        setLoadDonationsSortedMoney(false);
        notifyError(err?.response?.data?.errors[0].msg);
      }
    };
    fetchData();
  }, [id, pageDonationsSortedMoney]);
  //get Donation theo campaignId được sắp xếp theo thời gian quyên góp
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await DonationAPI.getDonationsByCampaignIdSortedDay({
          campaignId: id,
          page: pageDonationsSortedDate.page,
          pageSize: pageDonationsSortedDate.pageSize,
        });
        if (res.message === "lấy dữ liệu thành công!") {
          setDataDonationsSortedDate(res);
          setLoadDonationsSortedDate(false);
        }
      } catch (err) {
        console.log(err);
        setLoadDonationsSortedDate(false);
        notifyError(err?.response?.data?.errors[0].msg);
      }
    };
    fetchData();
  }, [id, pageDonationsSortedDate]);

  const dataSortedMoney = dataDonationsSortedMoney?.data?.map(
    (item, index) => ({
      title: item.TenCongKhai,
      description: item.SoDienThoai,
      content: item.SoTienQuyenGop,
      stt: index + 1,
    })
  );
  const dataSortedDate = dataDonationsSortedDate?.data?.map((item, index) => ({
    title: item.TenCongKhai,
    description: item.SoDienThoai,
    content: item.SoTienQuyenGop,
    stt: index + 1,
  }));
  return (
    <div
      className="container"
      style={{ marginTop: "20px", marginBottom: "20px" }}
    >
      <h1>{data?.TieuDe}</h1>
      <p>{dinhDangDate(data?.NgayBatDau)}</p>
      <div className={styled.girdImg}>
        <Slider {...settings}>
          {data?.HinhAnh?.length > 0 &&
            data?.HinhAnh?.map((item, index) => (
              <div key={index}>
                <a href={item.url} target="_blank">
                  <img src={item.url} alt={item.name} />
                </a>
              </div>
            ))}
        </Slider>
      </div>
      <FormDonations open={open} handlerOpen={openModal} data={data} />
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: `Câu chuyện`,
            key: "1",
            children: (
              <div className={styled.body}>
                <div className={styled.content}>
                  <h3>Câu chuyện</h3>
                  <br />
                  <div className={styled.cauchuyen}>
                    {data?.MoTaHoanCanh?.length > 0 &&
                      data?.MoTaHoanCanh?.map((item, index) => (
                        <div key={index}>
                          <p>{item.NoiDung}</p>
                          <br />
                          {data?.HinhAnh[index] && (
                            <>
                              <img
                                src={data?.HinhAnh[index].url}
                                alt={data?.HinhAnh[index].name}
                              />
                              <br />
                            </>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
                <div className={styled.card}>
                  <Card
                    style={{
                      width: "100%",
                      position: "-webkit-sticky",
                      position: "sticky",
                      top: "10px",
                    }}
                    actions={[
                      type !== "xem" && (
                        <Button type="primary" onClick={() => setOpen(true)}>
                          Quyên góp
                        </Button>
                      ),
                    ]}
                  >
                    <Meta
                      title={`Thông tin quyên góp - ${data.MaHoanCanh}`}
                      style={{
                        marginBottom: 10,
                        fontSize: "130%",
                        fontWeight: "700",
                        fontFamily: "serif",
                        marginBottom: "30px",
                      }}
                    />
                    <div>
                      <Row>
                        <Text strong>{convertMoney(data?.SoTienDaNhan)}đ </Text>
                        <Text style={{ padding: "0 0 0 5px" }}>
                          quyên góp / {convertMoney(data?.SoTienHuyDong)}đ
                        </Text>
                      </Row>
                      <Progress
                        strokeColor={type === "xem" ? "#52c41a" : "#0798db"}
                        percent={(
                          (data?.SoTienDaNhan / data?.SoTienHuyDong) *
                          100
                        ).toFixed(2)}
                        showInfo={false}
                      />
                      <Row className={styled.solieu}>
                        <Col span={10}>
                          <p>Lượt quyên góp</p>
                          <p>
                            <b>{data?.LuotQuyenGop}</b>
                          </p>
                        </Col>
                        <Col span={6}>
                          <p>Đạt được</p>
                          <p>
                            <b>
                              {(
                                (data?.SoTienDaNhan / data?.SoTienHuyDong) *
                                100
                              ).toFixed(2)}
                              %
                            </b>
                          </p>
                        </Col>
                        <Col span={8}>
                          {type === "quyengop" && (
                            <>
                              <p>Thời hạn còn</p>
                              <p>
                                <b>
                                  {Math.ceil(
                                    (new Date(data?.NgayKetThuc) - new Date()) /
                                      1000 /
                                      60 /
                                      60 /
                                      24
                                  )}{" "}
                                  ngày
                                </b>
                              </p>
                            </>
                          )}
                          {type === "xem" && (
                            <Text type="success">Đã hoàn thành</Text>
                          )}
                        </Col>
                      </Row>
                    </div>
                    {type === "quyengop" && (
                      <div className={styled.hinh_thuc_quyen_gop}>
                        <Meta
                          title={`Hình thức quyên góp - ${data.MaHoanCanh}`}
                          style={{
                            fontSize: "130%",
                            fontWeight: "700",
                            fontFamily: "serif",
                            marginBottom: "30px",
                          }}
                        />
                        <div>
                          <Row>
                            <p>Ngân hàng: AGRIBANK</p>
                          </Row>
                          <Row>
                            <p>Sô tài khoản: *************</p>
                          </Row>
                          <Row>
                            <p>Số tiền: "vi dụ 1000đ"</p>
                          </Row>
                          <Row>
                            <p>
                              Nội dung: quyen gop hoan canh {data.MaHoanCanh}
                            </p>
                          </Row>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            ),
          },
          {
            label: `Nhà hảo tâm`,
            key: "2",
            children: (
              <div className={styled.body}>
                <div className={styled.content} style={{ marginTop: "0px" }}>
                  <div className={styled.cauchuyen}>
                    <Divider orientation="left">Nhà Hảo Tâm Hàng Đầu</Divider>
                    <Spin
                      tip="Loading..."
                      spinning={loadDonationsSortedMoney}
                      size="default"
                    >
                      <List
                        size="small"
                        bordered
                        dataSource={dataSortedMoney}
                        style={{ height: "460px", overflow: "auto" }}
                        renderItem={(item) => {
                          return (
                            <List.Item>
                              <div className={styled.list_donation}>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                  }}
                                >
                                  <div
                                    style={{
                                      marginRight: "20px",
                                      alignSelf: "center",
                                    }}
                                  >
                                    <span>{item.stt}</span>
                                  </div>
                                  <div>
                                    <p>{item.title}</p>
                                    <p>
                                      {item.description
                                        ? item.description
                                            ?.toString()
                                            .slice(-3)
                                            .padStart(10, "*")
                                        : "".padStart(10, "*")}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p>{convertMoney(item.content)}đ</p>
                                </div>
                              </div>
                            </List.Item>
                          );
                        }}
                      />
                    </Spin>
                    <br />
                    <Pagination
                      defaultCurrent={pageDonationsSortedMoney.page}
                      defaultPageSize={pageDonationsSortedMoney.pageSize}
                      current={pageDonationsSortedMoney?.page}
                      // total={data.length}
                      // showTotal={showTotal}
                      pageSizeOptions={[10, 20, 50]}
                      onChange={onChangePageDonationsSortedMoney}
                      total={dataDonationsSortedMoney?.total}
                      showSizeChanger
                      style={{ textAlign: "center" }}
                    />
                  </div>
                  <div className={styled.cauchuyen}>
                    <Divider orientation="left">Nhà Hảo Tâm Mới Nhất</Divider>
                    <Spin
                      tip="Loading..."
                      spinning={loadDonationsSortedDate}
                      size="default"
                    >
                      <List
                        size="small"
                        bordered
                        dataSource={dataSortedDate}
                        style={{ height: "470px", overflow: "auto" }}
                        renderItem={(item) => {
                          return (
                            <List.Item>
                              <div className={styled.list_donation}>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                  }}
                                >
                                  <div
                                    style={{
                                      marginRight: "20px",
                                      alignSelf: "center",
                                    }}
                                  >
                                    <span>{item.stt}</span>
                                  </div>
                                  <div>
                                    <p>{item.title}</p>
                                    <p>
                                      {item.description
                                        ? item.description
                                            ?.toString()
                                            .slice(-3)
                                            .padStart(10, "*")
                                        : "".padStart(10, "*")}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p>{convertMoney(item.content)}đ</p>
                                </div>
                              </div>
                            </List.Item>
                          );
                        }}
                      />
                    </Spin>
                    <br />
                    <Pagination
                      defaultCurrent={pageDonationsSortedDate.page}
                      defaultPageSize={pageDonationsSortedDate.pageSize}
                      current={pageDonationsSortedDate?.page}
                      // total={data.length}
                      // showTotal={showTotal}
                      pageSizeOptions={[10, 20, 50]}
                      onChange={onChangePageDonationsSortedDate}
                      total={dataDonationsSortedDate?.total}
                      showSizeChanger
                      style={{ textAlign: "center" }}
                    />
                  </div>
                </div>
                <div className={styled.card}>
                  <Card
                    style={{
                      width: "100%",
                      position: "-webkit-sticky",
                      position: "sticky",
                      top: "10px",
                    }}
                    actions={[
                      type !== "xem" && (
                        <Button type="primary" onClick={() => setOpen(true)}>
                          Quyên góp
                        </Button>
                      ),
                    ]}
                  >
                    <Meta
                      title={`Thông tin quyên góp - ${data.MaHoanCanh}`}
                      style={{
                        marginBottom: 10,
                        fontSize: "130%",
                        fontWeight: "700",
                        fontFamily: "serif",
                        marginBottom: "30px",
                      }}
                    />
                    <div>
                      <Row>
                        <Text strong>{convertMoney(data?.SoTienDaNhan)}đ </Text>
                        <Text style={{ padding: "0 0 0 5px" }}>
                          quyên góp / {convertMoney(data?.SoTienHuyDong)}đ
                        </Text>
                      </Row>
                      <Progress
                        strokeColor={type === "xem" ? "#52c41a" : "#0798db"}
                        percent={(
                          (data?.SoTienDaNhan / data?.SoTienHuyDong) *
                          100
                        ).toFixed(2)}
                        showInfo={false}
                      />
                      <Row className={styled.solieu}>
                        <Col span={10}>
                          <p>Lượt quyên góp</p>
                          <p>
                            <b>{data?.LuotQuyenGop}</b>
                          </p>
                        </Col>
                        <Col span={6}>
                          <p>Đạt được</p>
                          <p>
                            <b>
                              {(
                                (data?.SoTienDaNhan / data?.SoTienHuyDong) *
                                100
                              ).toFixed(2)}
                              %
                            </b>
                          </p>
                        </Col>
                        <Col span={8}>
                          {type === "quyengop" && (
                            <>
                              <p>Thời hạn còn</p>
                              <p>
                                <b>
                                  {Math.ceil(
                                    (new Date(data?.NgayKetThuc) - new Date()) /
                                      1000 /
                                      60 /
                                      60 /
                                      24
                                  )}{" "}
                                  ngày
                                </b>
                              </p>
                            </>
                          )}
                          {type === "xem" && (
                            <Text type="success">Đã hoàn thành</Text>
                          )}
                        </Col>
                      </Row>
                    </div>
                    {type === "quyengop" && (
                      <div className={styled.hinh_thuc_quyen_gop}>
                        <Meta
                          title={`Hình thức quyên góp - ${data.MaHoanCanh}`}
                          style={{
                            fontSize: "130%",
                            fontWeight: "700",
                            fontFamily: "serif",
                            marginBottom: "30px",
                          }}
                        />
                        <div>
                          <Row>
                            <p>Ngân hàng: AGRIBANK</p>
                          </Row>
                          <Row>
                            <p>Sô tài khoản: *************</p>
                          </Row>
                          <Row>
                            <p>Số tiền: "vi dụ 1000đ"</p>
                          </Row>
                          <Row>
                            <p>
                              Nội dung: quyen gop hoan canh {data.MaHoanCanh}
                            </p>
                          </Row>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default Detail;
