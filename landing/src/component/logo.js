import { Image } from "antd";
import React, { useEffect } from "react";

function Logo(props) {
  const { size } = props;

  useEffect(() => {
    console.log(size);
  }, [size]);

  return (
    <>
      {size === "desktop" ? (
        <Image
          preview={false}
          src={require("../asset/image/LOGO.png")}
          alt="logo"
        />
      ) : (
        <Image
          preview={false}
          src={require("../asset/image/LOGO_S.png")}
          alt="logo"
        />
      )}
    </>
  );
}

export default Logo;
