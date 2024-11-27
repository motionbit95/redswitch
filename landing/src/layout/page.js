import React, { useEffect } from "react";
import Pagination from "../component/pagination";

function Page(props) {
  useEffect(() => {
    // 화면 크기를 계산하여 --vh 값을 설정하는 함수
    function setVhVariable() {
      const vh = window.innerHeight * 0.01; // 1vh의 크기를 계산
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    // 초기 설정과 화면 크기 변경 시마다 --vh 값 업데이트
    setVhVariable();
    window.addEventListener("resize", setVhVariable);

    // cleanup 함수에서 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", setVhVariable);
    };
  }, []);

  return (
    <div className="page">
      {props.children}
      <Pagination
        pageNumber={props.pageNumber}
        groupNumber={props.groupNumber}
      />
    </div>
  );
}

export default Page;
