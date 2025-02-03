import React, { useEffect } from "react";
import { Carousel, Image } from "antd";

const AdCarousel = ({ position, ...props }) => {
  const [images, setImages] = React.useState([]);

  useEffect(() => {
    const fetchAdvertiseBanner = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/advertisements`
        );
        const result = await response.json();
        const now = new Date(); // 현재 시간 가져오기
        const filteredImages = result.data.filter((item) => {
          const expireDate = new Date(item.expire_datetime); // expire_datetime을 Date 객체로 변환
          return expireDate > now; // 현재 시간보다 큰 것만 남김
        });

        setImages(filteredImages);
      } catch (error) {
        console.error("Error fetching advertise banner:", error);
      }
    };
    fetchAdvertiseBanner();
  }, []);
  return (
    <Carousel autoplay style={{ zIndex: 10 }}>
      {images.map(
        (image, index) =>
          image.banner_position === position && (
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
          )
      )}
    </Carousel>
  );
};
export default AdCarousel;
