import React from "react";
import { Carousel, Image } from "antd";

const AdCarousel = () => {
  const Images = [
    {
      banner_image:
        "https://firebasestorage.googleapis.com/v0/b/ehan-database.appspot.com/o/banner_image%2F20241011_ASDFASDF.jpg?alt=media&token=646c40df-e48f-4a28-a968-57c78c01c36c",
      banner_site: "http://specialnight.co.kr/",
    },
    {
      banner_image:
        "https://firebasestorage.googleapis.com/v0/b/ehan-database.appspot.com/o/banner_image%2F20241011_14RWF45.jpg?alt=media&token=c305da34-d49c-481e-865b-68cc2b810bc9",
      banner_site: "http://redswitch.kr/",
    },
    {
      banner_image:
        "https://firebasestorage.googleapis.com/v0/b/ehan-database.appspot.com/o/banner_image%2F20241011_ASDFASDF.jpg?alt=media&token=646c40df-e48f-4a28-a968-57c78c01c36c",
      banner_site: "http://taeryun.kr/",
    },
    {
      banner_image:
        "https://firebasestorage.googleapis.com/v0/b/ehan-database.appspot.com/o/banner_image%2F20241011_14RWF45.jpg?alt=media&token=c305da34-d49c-481e-865b-68cc2b810bc9",
      banner_site: "http://specialnight.co.kr/",
    },
    {
      banner_image:
        "https://firebasestorage.googleapis.com/v0/b/ehan-database.appspot.com/o/banner_image%2F20241011_ASDFASDF.jpg?alt=media&token=646c40df-e48f-4a28-a968-57c78c01c36c",
      banner_site: "http://redswitch.kr/",
    },
    {
      banner_image:
        "https://firebasestorage.googleapis.com/v0/b/ehan-database.appspot.com/o/banner_image%2F20241011_14RWF45.jpg?alt=media&token=c305da34-d49c-481e-865b-68cc2b810bc9",
      banner_site: "http://taeryun.kr/",
    },
  ];
  return (
    <Carousel autoplay>
      {Images.map((image, index) => (
        <div className="center" key={index}>
          <Image
            preview={false}
            onClick={() => {
              window.open(image.banner_site, "_blank");
            }}
            src={image.banner_image}
            style={{ width: "100%", height: "auto", maxHeight: "160px" }}
          />
        </div>
      ))}
    </Carousel>
  );
};
export default AdCarousel;
