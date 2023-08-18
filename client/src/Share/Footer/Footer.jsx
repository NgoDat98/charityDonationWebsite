/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useHistory } from "react-router-dom";
import { PhoneOutlined, FacebookOutlined } from "@ant-design/icons";

function Footer(props) {
  const history = useHistory();
  return (
    <footer className="bg-dark text-white">
      <div className="container py-4">
        <div className="row py-5">
          <div className="col-md-4 mb-3 mb-md-0">
            <h6 className="text-uppercase mb-3">Về Chúng tôi</h6>
            <ul className="list-unstyled mb-0">
              <li>
                <p>
                  + Quỹ Trái Tim Nhan Ai được xây dựng với mục đích tạo lên một
                  lền tảng quyên góp từ thiện online
                </p>
              </li>
            </ul>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <h6 className="text-uppercase mb-3">Chương trình</h6>
            <ul className="list-unstyled mb-0">
              <li>
                <p
                  className="footer-link"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    history.push(
                      "/ChuongTrinh/nguoi-gia-va-nguoi-khuyet-tat/null",
                      { title: "Người Già Và Người Khuyết Tật" }
                    )
                  }
                >
                  Người gia và người khuyết tật
                </p>
              </li>
              <li>
                <p
                  className="footer-link"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    history.push("/ChuongTrinh/quy-vi-tre-em/null", {
                      title: "Trẻ Em",
                    })
                  }
                >
                  Vì trẻ em
                </p>
              </li>
              <li>
                <p
                  className="footer-link"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    history.push("/ChuongTrinh/nguoi-vung-sau-vung-xa/null", {
                      title: "Người Vùng Sâu,Vùng Xa",
                    })
                  }
                >
                  Người vùng sâu, vùng xa
                </p>
              </li>
              <li>
                <p
                  className="footer-link"
                  href="/ChuongTrinh/quy-bao-ve-dong-vat/null"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    history.push("/ChuongTrinh/quy-bao-ve-dong-vat/null", {
                      title: "Quỹ Bảo Vệ Động Vật",
                    })
                  }
                >
                  Bảo vệ động vật
                </p>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="text-uppercase mb-3">
              Quỹ từ Thiện trái tim nhân ái
            </h6>
            <ul className="list-unstyled mb-0">
              <li>
                <a className="footer-link" href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 384 512"
                  >
                    <path
                      fill="white"
                      d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
                    />
                  </svg>{" "}
                  địa chỉ: địa chỉ
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  <PhoneOutlined /> hotline: hotline
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="white"
                      d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                    />
                  </svg>{" "}
                  Email: Email
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  <FacebookOutlined /> Facebook: Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
