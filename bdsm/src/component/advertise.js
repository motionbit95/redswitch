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
        setImages(result.data);
      } catch (error) {
        console.error("Error fetching advertise banner:", error);
      }
    };
    fetchAdvertiseBanner();
  }, []);
  return (
    <Carousel autoplay>
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
