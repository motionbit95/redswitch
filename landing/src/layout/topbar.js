import React, { useEffect, useState } from "react";

import logo from "../asset/image/redswitchLogo.png";

function Topbar(props) {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      console.log(window.location.hash);
    };

    // 해시 변경을 감지하는 이벤트 리스너 등록
    window.addEventListener("hashchange", handleHashChange);

    // 컴포넌트 언마운트 시 이벤트 리스너 해제
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div className="top">
      <div className="top-logo">
        <div className="row">
          <img src={logo} alt="logo" className="logo" />
          <div>REDSWITCH</div>
        </div>

        <button
          onClick={() => (window.location.href = "#10")}
          className="button"
        >
          가맹점 신청하기
        </button>
      </div>
      <div className="topbar">
        <a
          href="#1"
          className={currentHash === "#1" ? "selected" : "unselected"}
        >
          MAIN
        </a>
        <a
          href="#2"
          className={
            currentHash === "#2" || currentHash === "#3" || currentHash === "#4"
              ? "selected"
              : "unselected"
          }
        >
          INTRO
        </a>
        <a
          href="#5"
          className={
            currentHash === "#5" ||
            currentHash === "#6" ||
            currentHash === "#7" ||
            currentHash === "#8"
              ? "selected"
              : "unselected"
          }
        >
          SERVICE
        </a>
        <a
          href="#9"
          className={currentHash === "#9" ? "selected" : "unselected"}
        >
          CUSTOMER
        </a>
        <a
          href="#10"
          className={
            currentHash === "#10" || currentHash === "#11"
              ? "selected"
              : "unselected"
          }
        >
          CONTACT US
        </a>
      </div>
    </div>
  );
}

export default Topbar;
