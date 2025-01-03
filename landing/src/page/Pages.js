import React from "react";
import TextBox from "../component/textbox";
import Description from "../component/description";
import { useMediaQuery } from "react-responsive";
import { Button, Col, Image, Row, Space } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

// export function Main(props) {
//   const { size } = props;
//   return (
//     <Row
//       gutter={[16, 16]}
//       style={{
//         overflow: "hidden",
//         display: "flex",
//         flex: 1,
//         height: "100vh",
//         paddingTop: "80px",
//         paddingInline:
//           size === "mobile" ? "20px" : size === "tablet" ? "48px" : "72px",
//       }}
//     >
//       <Col
//         span={size === "mobile" ? 24 : size === "tablet" ? 9 : 12}
//         style={{ padding: "20px", zIndex: 999 }}
//       >
//         <Space direction="vertical" size={"large"}>
//           <Space direction="vertical">
//             <MainDescription
//               size={size}
//               description="숙박업소 비대면 어덜트토이 플랫폼"
//             />
//             <Space direction="vertical" style={{ gap: "0px" }}>
//               <MainFontBox size={size} title="RED" color="#DA0A18" />
//               <MainFontBox size={size} title="SWITCH" color="white" />
//             </Space>
//             <MainDescription
//               size={size}
//               description="가장 필요한 순간, 간편 주문, 즉시 도착."
//             />
//           </Space>
//         </Space>
//       </Col>
//       <Col
//         span={size === "mobile" ? 24 : size === "tablet" ? 15 : 12}
//         style={{
//           padding: "20px",
//           alignItems: "flex-end",
//           justifyContent: "flex-end",
//           display: "flex",
//         }}
//       >
//         <Space direction="vertical">
//           <Image
//             preview={false}
//             src={require("../asset/section/IMAGE_2.png")}
//           />
//         </Space>
//       </Col>
//     </Row>
//   );
// }

// export function Intro2(props) {
//   const { size } = props;
//   return (
//     <Row
//       gutter={[16, 16]}
//       style={{
//         overflow: "hidden",
//         height: "100vh",
//         display: "flex",
//         flex: 1,
//         paddingTop: "80px",
//         paddingInline:
//           size === "mobile" ? "20px" : size === "tablet" ? "48px" : "72px",
//       }}
//     >
//       <Col
//         span={size === "mobile" ? 24 : size === "tablet" ? 9 : 12}
//         style={{ padding: "20px", zIndex: 999 }}
//       >
//         <Space direction="vertical" size={"large"}>
//           <TextBox
//             size={size}
//             title="Adult Toy"
//             description="성인용품 사용해보신적 있나요?"
//           />
//           <Space direction="vertical">
//             <Description
//               size={size}
//               description={`대답하기 부끄러운 것은 저 뿐만이 아니겠죠?`}
//             />
//             <div>
//               <Description
//                 size={size}
//                 description={`우리는 성적인 존재가 아닌 척 하는 데에`}
//               />
//               <Description
//                 size={size}
//                 description={`너무 오랜 시간을 보냈습니다.`}
//               />
//             </div>
//           </Space>
//         </Space>
//       </Col>
//       <Col
//         span={size === "mobile" ? 24 : size === "tablet" ? 15 : 12}
//         style={{
//           padding: "20px",
//           alignItems: "flex-end",
//           justifyContent: "flex-end",
//           display: "flex",
//         }}
//       >
//         <Space direction="vertical">
//           <Image
//             preview={false}
//             src={require("../asset/section/IMAGE_2.png")}
//           />
//         </Space>
//       </Col>
//     </Row>
//   );
// }

// export function Intro3(props) {
//   const { size } = props;
//   return (
//     <Row
//       gutter={[16, 16]}
//       style={{
//         overflow: "hidden",
//         height: "100vh",
//         display: "flex",
//         flex: 1,
//         paddingTop: "80px",
//         paddingInline:
//           size === "mobile" ? "20px" : size === "tablet" ? "48px" : "72px",
//       }}
//     >
//       <Col
//         span={size === "mobile" ? 24 : size === "tablet" ? 9 : 12}
//         style={{ padding: "20px", zIndex: 999 }}
//       >
//         <Space direction="vertical" size={"large"}>
//           <TextBox
//             size={size}
//             title="ADLT MARKET"
//             description="성인용품 시장 5조원 시대"
//           />
//           <div>
//             <Description
//               size={size}
//               description={`하지만 더 나은 섹스를 위한 어들트토이를 갖기까지`}
//             />
//             <Description
//               size={size}
//               description={`우리는 부끄러운 마음과 걱정이 먼저 앞서는걸요.`}
//             />
//           </div>
//         </Space>
//       </Col>
//       <Col
//         span={size === "mobile" ? 24 : size === "tablet" ? 15 : 12}
//         style={{
//           padding: "20px",
//           alignItems: "flex-end",
//           justifyContent: "flex-end",
//           display: "flex",
//         }}
//       >
//         <Space direction="vertical">
//           <Image
//             preview={false}
//             src={require("../asset/section/IMAGE_2.png")}
//           />
//         </Space>
//       </Col>
//     </Row>
//   );
// }

// export function Service1(props) {
//   const { size } = props;
//   return (
//     <Row
//       gutter={[16, 16]}
//       style={{
//         overflow: "hidden",
//         height: "100vh",
//         display: "flex",
//         flex: 1,
//         paddingTop: "80px",
//         paddingInline:
//           size === "mobile" ? "20px" : size === "tablet" ? "48px" : "72px",
//       }}
//     >
//       <Col
//         span={size === "mobile" ? 24 : size === "tablet" ? 9 : 12}
//         style={{ padding: "20px", zIndex: 999 }}
//       >
//         <TextBox
//           size={size}
//           title="SWITCH ON!"
//           description="가장 필요한 순간, 간편 주문, 즉시도착!"
//         />
//       </Col>
//       <Col
//         span={size === "mobile" ? 24 : size === "tablet" ? 15 : 12}
//         style={{
//           padding: "20px",
//           alignItems: "flex-end",
//           justifyContent: "flex-end",
//           display: "flex",
//         }}
//       >
//         <Space direction="vertical">
//           <Image
//             preview={false}
//             src={require("../asset/section/IMAGE_2.png")}
//           />
//         </Space>
//       </Col>
//     </Row>
//   );
// }

// export function Service2(props) {
//   const { size } = props;
//   return (
//     <Row
//       gutter={[16, 16]}
//       style={{
//         overflow: "hidden",
//         height: "100vh",
//         display: "flex",
//         flex: 1,
//         paddingTop: "80px",
//         paddingInline:
//           size === "mobile" ? "20px" : size === "tablet" ? "48px" : "72px",
//       }}
//     >
//       <Col
//         span={size === "mobile" ? 24 : size === "tablet" ? 9 : 12}
//         style={{ padding: "20px", zIndex: 999 }}
//       >
//         <Space direction="vertical" size={"large"}>
//           <TextBox
//             size={size}
//             title="SEX MBTI"
//             description="너 섹비티아이 뭐야?"
//           />
//           <Space direction="vertical">
//             <Description
//               size={size}
//               description={`MBTI는 알지만, 섹스 퍼스널리티는 모른다구요?`}
//             />
//             <div>
//               <Description
//                 size={size}
//                 description={`MBTI처럼 섹스 퍼스널리티에도`}
//               />
//               <Description
//                 size={size}
//                 description={`22가지의 다양한 성향이 있어요.`}
//               />
//             </div>
//           </Space>
//         </Space>
//       </Col>
//       <Col
//         span={size === "mobile" ? 24 : size === "tablet" ? 15 : 12}
//         style={{
//           padding: "20px",
//           alignItems: "flex-end",
//           justifyContent: "flex-end",
//           display: "flex",
//         }}
//       >
//         <Space direction="vertical">
//           <Image
//             preview={false}
//             src={require("../asset/section/IMAGE_2.png")}
//           />
//         </Space>
//       </Col>
//     </Row>
//   );
// }

// export function Service3(props) {
//   const { size } = props;
//   return (
//     <Row
//       gutter={[16, 16]}
//       style={{
//         overflow: "hidden",
//         height: "100vh",
//         display: "flex",
//         flex: 1,
//         paddingTop: "80px",
//         paddingInline:
//           size === "mobile" ? "20px" : size === "tablet" ? "48px" : "72px",
//       }}
//     >
//       <Col
//         span={size === "mobile" ? 24 : size === "tablet" ? 9 : 12}
//         style={{ padding: "20px", zIndex: 999 }}
//       >
//         <Space direction="vertical" size={"large"}>
//           <TextBox
//             size={size}
//             title="BDSM TEST"
//             description="무료 SEX MBTI 테스트"
//           />
//           <Space direction="vertical">
//             <Description
//               size={size}
//               description={`간단한 테스트로 성향을 공유해보세요.`}
//             />
//             <div>
//               <Description
//                 size={size}
//                 description={`상대의 성향과 서로에게 필요한 제품을 알 수 있어요.`}
//               />
//               <Description
//                 size={size}
//                 description={`지피지기백전백승! 오늘 사랑이 더 깊어지지 않을까요?`}
//               />
//             </div>
//           </Space>
//         </Space>
//       </Col>
//       <Col
//         span={size === "mobile" ? 24 : size === "tablet" ? 15 : 12}
//         style={{
//           padding: "20px",
//           alignItems: "flex-end",
//           justifyContent: "flex-end",
//           display: "flex",
//         }}
//       >
//         <Space direction="vertical">
//           <Image
//             preview={false}
//             src={require("../asset/section/IMAGE_2.png")}
//           />
//         </Space>
//       </Col>
//     </Row>
//   );
// }

export function Customer(props) {
  const { size } = props;
  return (
    <Row
      gutter={[16, 16]}
      style={{
        overflow: "hidden",
        height: "100vh",
        maxWidth: "770px",
        justifyContent: "center",
        display: "flex",
        flex: 1,
        paddingTop: "80px",
        paddingInline:
          size === "mobile" ? "0px" : size === "tablet" ? "48px" : "72px",
      }}
    >
      <Col
        span={24}
        style={{
          padding: size === "mobile" ? "0px" : "20px",
          marginBottom: size === "mobile" ? "0px" : "60px",
        }}
      >
        <Image
          preview={false}
          style={{
            marginTop: size === "mobile" ? "80px" : "0px",
            marginBottom:
              size === "mobile"
                ? "200px"
                : size === "tablet"
                ? "160px"
                : "60px",
          }}
          src={require("../asset/page/9_title.png")}
        />
        <Col
          span={24}
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            marginBottom: "60px",
          }}
        >
          <Space direction="vertical" align="center">
            <Space
              style={{
                display: "flex",
              }}
            >
              <Button style={{ borderRadius: "50%" }} icon={<LeftOutlined />} />
              <Space style={{ padding: size === "mobile" ? 0 : "20px" }}>
                {["1", "2", "3"].map((item) => {
                  return (
                    <div
                      style={{
                        width: size === "mobile" ? "50px" : "100px",
                        height: size === "mobile" ? "50px" : "100px",
                        backgroundColor: "#f1f1f1",
                        borderRadius: "50%",
                      }}
                    ></div>
                  );
                })}
              </Space>
              <Button
                style={{ borderRadius: "50%" }}
                icon={<RightOutlined />}
              />
            </Space>
            <Space
              style={{
                display: "flex",
              }}
            >
              <Button style={{ borderRadius: "50%" }} icon={<LeftOutlined />} />
              <Space style={{ padding: size === "mobile" ? 0 : "20px" }}>
                {["1", "2", "3"].map((item) => {
                  return (
                    <div
                      style={{
                        width: size === "mobile" ? "80px" : "120px",
                        height: size === "mobile" ? "80px" : "120px",
                        backgroundColor: "#f1f1f1",
                        borderRadius: "20%",
                      }}
                    ></div>
                  );
                })}
              </Space>
              <Button
                style={{ borderRadius: "50%" }}
                icon={<RightOutlined />}
              ></Button>
            </Space>
          </Space>
        </Col>
      </Col>
    </Row>
  );
}
