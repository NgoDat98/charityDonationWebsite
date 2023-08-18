import React from "react";
import { useLocation, useParams } from "react-router-dom";

import FormEditUser from "../Form/Form_Edit_User/Form_Edit_User";
import DetailUser from "../Detail/detail_User/Detail_User";

const ManageUser = () => {
  const params = useParams();
  return (
    <>
      {params.type === "edit" && <FormEditUser />}
      {params.type === "view" && <DetailUser />}
    </>
  );
};

export default ManageUser;
