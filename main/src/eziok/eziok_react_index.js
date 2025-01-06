import { Button } from "antd";
import React, { Component } from "react";

/* react-helmet 이용 시 react-helmet 다운 및 주석해제 */
import { Helmet } from "react-helmet";
import { mainPageStyles } from "../styles";

const ezioK_react_index = (props) => {
  const { onCert } = props;
  const eziok = () => {
    window.eziok_std_process(
      "https://port-0-redswitch-lxwmkqxz2d25ae69.sel5.cloudtype.app/eziok/eziok_std_request",
      "WB",
      "printResult"
    ); // callback 방식 사용
    // window.eziok_std_process(
    //   "https://port-0-redswitch-lxwmkqxz2d25ae69.sel5.cloudtype.app/eziok/eziok_std_request",
    //   "MB",
    //   ""
    // ); // redirect 방식 사용

    // 인증결과 콜백함수 정의
    const script = document.createElement("script");
    const callBackFunc = document.createTextNode(
      "function printResult(data) {" +
        "var resultCode = data.split('|')[0];" +
        "var resultMsg = data.split('|')[1];" +
        "if (resultCode === '0') {" +
        // 간편인증-표준창 성공 완료시 처리 부분
        'document.querySelector("#result").textContent = resultMsg;' +
        "}" +
        "else {" +
        // 간편인증-표준창 실패 완료시 처리 부분
        'alert("Error : " + resultMsg);' +
        "}" +
        "}"
    );

    script.appendChild(callBackFunc);
    document.body.appendChild(script);
    if (script.errorCode === "2000") {
      onCert(script);
    }
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

      {/* <button onClick={this.eziok}>인증_팝업</button> */}
      <Button
        type="primary"
        danger
        size="large"
        style={mainPageStyles.certButton}
        onClick={eziok}
      >
        휴대폰 본인 인증
      </Button>
      {/* <textarea cols="100" rows="50" id="result"></textarea> */}
    </>
  );
};

export default ezioK_react_index;
