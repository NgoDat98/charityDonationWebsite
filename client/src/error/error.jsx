import React from "react";
import { useHistory } from "react-router-dom";
import Image from "../Share/img/Image";
import { Button, Typography } from "antd";

import styled from "./error.module.css";

const { Text } = Typography;

const Error = () => {
  const history = useHistory();
  window.scrollTo(0, 143);
  return (
    <div className={styled.container}>
      <div className={styled.body}>
        <img src={Image.imgError} />
        <Typography></Typography>
        <Typography.Title level={3}>
          Xin lỗi, trang bạn truy cập không tồn tại.
        </Typography.Title>
        {/* <Text disabled aria-level={1}>
          Xin lỗi, trang bạn truy cập không tồn tại.
        </Text> */}
        <Button type="primary" onClick={() => history.replace("/")}>
          Back Home
        </Button>
      </div>
    </div>
  );
};

export default Error;
