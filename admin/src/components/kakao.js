import { Button } from "antd";
import React, { useEffect, useState } from "react";

const KakaoAddressSearch = ({ onSelectAddress }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkDaumScript = () => {
      if (window.daum && window.daum.Postcode) {
        setIsLoaded(true); // 스크립트가 로드된 상태로 설정
      } else {
        // 스크립트가 아직 로드되지 않았다면 재확인
        const interval = setInterval(() => {
          if (window.daum && window.daum.Postcode) {
            setIsLoaded(true);
            clearInterval(interval);
          }
        }, 100);
      }
    };

    checkDaumScript();
  }, []);

  const openSearch = () => {
    if (!isLoaded) {
      alert("카카오 주소 검색 API가 로드되지 않았습니다.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullAddress = data.address; // 도로명 주소
        const extraAddress =
          data.bname || data.buildingName
            ? ` (${data.bname || ""} ${data.buildingName || ""})`
            : "";
        onSelectAddress(fullAddress + extraAddress, data.sido, data.sigungu); // 선택된 주소 전달
      },
    }).open();
  };

  return (
    <Button style={{ width: "100%" }} onClick={openSearch}>
      주소 검색
    </Button>
  );
};

export default KakaoAddressSearch;
