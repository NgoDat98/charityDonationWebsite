import "./App.css";
import "./css/custom.css";
import "./css/style.default.css";

import { useState, useEffect, createContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Footer from "./Share/Footer/Footer";
import Header from "./Share/Header/Header";
import Home from "./Home/Home";
import Detail from "./Detail/Detail";
import SignIn from "./Authentication/SignIn";
import SignUp from "./Authentication/SignUp";
import FormCampaign from "./Form/Form_create/FormCampaign";
import TableUser from "./Table/TableUser";
import ManageUser from "./Manage_User/ChiTietUser";
import GioiThieu from "./Introduce/GioiThieu";
import Error from "../src/error/error";
import AuthAPI from "./API/AuthAPI";
import Swal from "sweetalert2";
//css slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TableCampaign from "./Table/TableCampaign";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DetailUser from "./Detail/detail_User/Detail_User";
import FormEditUser from "./Form/Form_Edit_User/Form_Edit_User";
import ForgotPassword from "./Authentication/ForgotPassword";
import TableDonations from "./Table/tableDonation";
import Programme from "./programme/Programme";

export const valuesContext = createContext();

function App() {
  const [load, setLoad] = useState(false);
  const [data, setData] = useState("");

  const loadAuth = (e) => setLoad(e);

  const notifyError = (values) =>
    toast.error(values, {
      autoClose: 3000,
    });

  useEffect(() => {
    const auth = window.localStorage.getItem("User");
    if (auth) {
      const fetchData = async () => {
        try {
          const res = await AuthAPI.getLogin("Breare " + auth);
          if (res?.mesaage === "Đăng nhập thành công") {
            setData(res);
            // setLoad(false);
          }
        } catch (err) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: `${err.response.data.message}`,
            showConfirmButton: false,
            timer: 3000,
          });
          console.log(err.response.data.message);
          if (
            err.response.data.message === "Phiên đăng nhập của bạn đã hết hạn"
          ) {
            window.localStorage.removeItem("User");
            setData("");
          }
        }
      };
      fetchData(auth);
    } else {
      setData("");
    }
    setLoad(false);
  }, [load]);

  // window.addEventListener("error", function (event) {
  //   console.log(event);
  //   if (event) {
  //     notifyError(event.message);
  //   }
  // });
  console.log(data);

  return (
    <valuesContext.Provider value={{ loadAuth, data, notifyError }}>
      <div className="App">
        <ToastContainer />
        <BrowserRouter>
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/quyengop/:id" component={Detail} />
            <Route path="/xem/:id" component={Detail} />
            {data?.mesaage !== "Đăng nhập thành công" && (
              <Route path="/signin" component={SignIn} />
            )}
            {data?.mesaage !== "Đăng nhập thành công" && (
              <Route path="/signup" component={SignUp} />
            )}
            {data?.mesaage !== "Đăng nhập thành công" && (
              <Route path="/forgot-password" component={ForgotPassword} />
            )}
            {data?.data?.VaiTro === "admin" && (
              <Route path="/create-campaign" component={FormCampaign} />
            )}
            {data?.data?.VaiTro === "admin" && (
              <Route path="/edit-campaign" component={FormCampaign} />
            )}
            {data?.data?.VaiTro === "admin" && (
              <Route path="/table-campaign" component={TableCampaign} />
            )}
            {data?.data?.VaiTro === "admin" && (
              <Route path="/table-user" exact component={TableUser} />
            )}
            {data?.data?.VaiTro === "admin" && (
              <Route path="/table-user/:type/:id" component={ManageUser} />
            )}
            {data?.data?.VaiTro === "admin" && (
              <Route path={"/create-user"} component={FormEditUser} />
            )}
            {data?.data?.VaiTro === "admin" && (
              <Route path="/table-donation" exact component={TableDonations} />
            )}
            {data?.mesaage === "Đăng nhập thành công" && (
              <Route path={"/ThongTintaiKhoan/:id"} component={DetailUser} />
            )}
            {data?.mesaage === "Đăng nhập thành công" && (
              <Route
                path={"/CapNhatThongTinTaiKhoan/:id"}
                component={DetailUser}
              />
            )}
            <Route path={"/ChuongTrinh/:programme/:id"} component={Programme} />
            <Route path={"/to-chuc"} component={GioiThieu} />
            <Route component={Error} />
            {/* <Route path="/checkout" component={Checkout} />{" "}
          <Route path="/history" component={History} />{" "}
          <Route path="/shop" component={Shop} /> */}
          </Switch>
          <Footer />
        </BrowserRouter>
        {/* 
      <Chat />

      <Footer /> */}
      </div>
    </valuesContext.Provider>
  );
}

export default App;
