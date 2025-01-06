import { Button } from "antd";
import React from "react";

/* react-helmet 이용 시 react-helmet 다운 및 주석해제 */
import { Helmet } from "react-helmet";
import { mainPageStyles } from "../styles";

const ezioK_react_index = (props) => {
  const { onCert } = props;

  // Define the callback function globally, so it can be called in the browser's global scope
  window.printResult = (data) => {
    var resultCode = data.split("|")[0];
    var resultMsg = data.split("|")[1];
    if (resultCode === "0") {
      document.querySelector("#result").textContent = resultMsg;
      // Call onCert function passed as prop with the result data
      onCert(data);
    } else {
      alert("Error : " + resultMsg);
    }
  };

  const eziok = () => {
    window.eziok_std_process(
      "https://port-0-redswitch-lxwmkqxz2d25ae69.sel5.cloudtype.app/eziok/eziok_std_request",
      "WB",
      "printResult" // Pass the function name as a string
    ); // callback 방식 사용
  };

  return (
    <>
      {/* react-helmet 이용 시 주석해제 */}
      <Helmet>
        {/* 운영 */}
        {/* <script src="https://cert.ez-iok.com/stdauth/ds_auth_ptb/asset/js/ptb_ezauth_proc.js"></script> */}
        {/* 개발 */}
        <script src="https://scert.ez-iok.com/stdauth/ds_auth_ptb/asset/js/ptb_ezauth_proc.js"></script>
      </Helmet>

      <Button
        type="primary"
        danger
        size="large"
        style={mainPageStyles.certButton}
        onClick={eziok}
      >
        휴대폰 본인 인증
      </Button>
      <textarea
        cols="100"
        rows="50"
        id="result"
        style={{ display: "none" }}
      ></textarea>
    </>
  );
};

export default ezioK_react_index;
