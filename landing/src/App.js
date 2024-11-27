import React, { useEffect, useState } from "react";
import { Section, SectionsContainer } from "react-fullpage";
import Topbar from "./layout/topbar";
import Page from "./layout/page";
// 페이지 이미지들
import img1 from "./asset/page/1.png";
import img2 from "./asset/page/2.png";
import img3 from "./asset/page/3.png";
import img4 from "./asset/page/4.png";
import img5 from "./asset/page/5.png";
import img6 from "./asset/page/6.png";
import img7 from "./asset/page/7.png";
import img8 from "./asset/page/8.png";
import img9 from "./asset/page/9.png";
import img10 from "./asset/page/10.png";
import img11 from "./asset/page/11.png";
import InstagramButton from "./component/instagram";
import CenteredForm from "./layout/form";
import { useMediaQuery } from "react-responsive";
import Header from "./layout/header";
import Link from "antd/es/typography/Link";
import Scroll from "./component/scroll";
import Content from "./layout/content";
import { Intro1 } from "./page/intro";

let options = {
  anchors: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
  navigation: false,
  fitToSection: true,
};

function App(props) {
  const isMobile = useMediaQuery({ maxWidth: 680 });
  const isTablet = useMediaQuery({ minWidth: 680, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });

  const size = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

  useEffect(() => {
    window.addEventListener("resize", () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);
  return (
    <div
      style={{
        minWidth: "300px",
      }}
    >
      <Header size={size} />
      <Scroll size={size} />
      <SectionsContainer {...options}>
        <Section>
          <Page pageNumber={1} groupNumber={3}>
            <Intro1 size={size} />
          </Page>
        </Section>
        <Section>
          <Page pageNumber={1} groupNumber={3}>
            <img src={img2} alt="intro1" className="image" />
          </Page>
        </Section>
        <Section>
          <Page pageNumber={2} groupNumber={3}>
            <img src={img3} alt="intro2" className="image" />
          </Page>
        </Section>
        <Section>
          <Page pageNumber={3} groupNumber={3}>
            <img src={img4} alt="intro3" className="image" />
          </Page>
        </Section>
        <Section>
          <Page pageNumber={1} groupNumber={4}>
            <img src={img5} alt="service1" className="image" />
          </Page>
        </Section>
        <Section>
          <Page pageNumber={2} groupNumber={4}>
            <img src={img6} alt="service2" className="image" />
          </Page>
        </Section>
        <Section>
          <Page pageNumber={3} groupNumber={4}>
            <img src={img7} alt="service3" className="image" />
          </Page>
        </Section>
        <Section>
          <Page pageNumber={4} groupNumber={4}>
            <img src={img8} alt="service4" className="image" />
          </Page>
        </Section>
        <Section>
          <Page>
            <img src={img9} alt="customer" className="image" />
          </Page>
        </Section>
        <Section>
          <Page>
            <img src={img10} alt="contact" className="image" />
            <CenteredForm />
          </Page>
        </Section>
        <Section>
          <Page>
            <img src={img11} alt="location" className="image" />
          </Page>
        </Section>
      </SectionsContainer>
      <InstagramButton />
    </div>
  );
}

export default App;
