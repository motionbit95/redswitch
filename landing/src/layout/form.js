import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  InputNumber,
  Row,
  Col,
  message,
  Modal,
  Drawer,
  Space,
} from "antd";
import { useMediaQuery } from "react-responsive";
import { UpOutlined, LeftOutlined, CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import TextBox from "../component/textbox";
import Description from "../component/description";

const CenteredForm = (props) => {
  const { size } = props;
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
      // 서버로 POST 요청
      const response = await axios.post(
        "http://localhost:8080/posts/franchises",
        values
      );
      console.log("Response:", response.data);

      message.success("신청이 성공적으로 완료되었습니다!");
    } catch (error) {
      console.error("Error:", error);
      message.error("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleopenModal = (type) => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: size === "mobile" ? 0 : "50%",
          transform: size === "mobile" ? "translateY(0)" : "translateY(50%)",
          right: 0,
          zIndex: 999,
          backgroundColor: "#333333",
          width: size === "mobile" ? "100%" : "50px",
          height: size === "mobile" ? "40px" : "250px",
          textAlign: "center",
          display: "flex",
          flexDirection: size === "mobile" ? "row" : "column",
          justifyContent: "center",
          alignItems: "center",
          border: "none",
          borderTopLeftRadius: size === "mobile" ? "0" : "10px",
          borderBottomLeftRadius: size === "mobile" ? "0" : "10px",
          color: "white",
          cursor: "pointer",
          padding: size === "mobile" ? "0px" : "8px",
        }}
        onClick={() => setOpen(true)}
      >
        {size === "mobile" ? (
          <>
            <UpOutlined style={{ fontSize: "18px", marginRight: "8px" }} />
            <div>가맹점 신청하기</div>
          </>
        ) : (
          <>
            <LeftOutlined style={{ fontSize: "24px", marginBottom: "8px" }} />
            <div
              style={{
                fontSize: "20px",
                writingMode: "vertical-rl",
              }}
            >
              가맹점 신청하기
            </div>
          </>
        )}
      </div>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        width={size === "mobile" ? "100%" : "700px"}
        height="100vh"
        centered
        placement={size === "mobile" ? "bottom" : "right"}
        style={{
          backgroundColor: "#000",
          display: "flex",
        }}
        closeIcon={<CloseOutlined style={{ color: "#fff" }} />}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Space direction="vertical" size={"large"}>
            <TextBox size={size} title="가맹점 신청하기" />
            <div>
              <Description
                size={size}
                description={`레드스위치는 건전한 성문화를 지향하는 성인 플랫폼으로써`}
              />
              <Description
                size={size}
                description={`성문화 인식 개선과 성문화 발전을 위해 존재합니다.`}
              />
              <Description
                size={size}
                description={`체계적이고 안정적인 서비스와 다양한 컨텐츠로 보답하겠습니다.`}
              />
            </div>
          </Space>
          <Space
            onClick={handleopenModal}
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              borderBottom: "1px solid #fff",
            }}
          >
            <Description size={size} description={`개인정보처리방침`} />
          </Space>
          <Col
            style={{
              padding: "20px",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              display: "flex",
              marginBottom: "60px",
            }}
          >
            <Form
              layout="vertical"
              onFinish={onFinish}
              validateTrigger="onBlur"
            >
              <Row gutter={size === "mobile" ? [8, 0] : [16, 4]}>
                <Col span={12}>
                  <Form.Item
                    name="franchise_name"
                    rules={[
                      { required: true, message: "가맹점명을 입력해주세요." },
                    ]}
                    style={{ marginBottom: size ? "8px" : "16px" }}
                  >
                    <Input placeholder="가맹점명" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="franchise_manager"
                    rules={[
                      {
                        required: true,
                        message: "담당자 이름을 입력해주세요.",
                      },
                    ]}
                    style={{ marginBottom: size ? "8px" : "16px" }}
                  >
                    <Input placeholder="담당자 이름" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="franchise_manager_phone"
                    rules={[
                      {
                        required: true,
                        message: "담당자 전화번호를 입력해주세요.",
                      },
                    ]}
                    style={{ marginBottom: size ? "8px" : "16px" }}
                  >
                    <Input placeholder="담당자 전화번호" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="franchise_manager_email"
                    rules={[
                      {
                        required: true,
                        message: "담당자 이메일을 입력해주세요.",
                      },
                      {
                        type: "email",
                        message: "이메일 형식이 올바르지 않습니다.",
                      },
                    ]}
                    style={{ marginBottom: size ? "8px" : "16px" }}
                  >
                    <Input placeholder="담당자 이메일" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="franchise_address"
                    rules={[
                      {
                        required: true,
                        message: "가맹점 주소를 입력해주세요.",
                      },
                    ]}
                    style={{ marginBottom: size ? "8px" : "16px" }}
                  >
                    <Input placeholder="가맹점 주소" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="franchise_room_cnt"
                    rules={[
                      { required: true, message: "객실 수를 입력해주세요." },
                    ]}
                    style={{ marginBottom: size ? "8px" : "16px" }}
                  >
                    <InputNumber
                      style={{
                        width: "100%",
                      }}
                      placeholder="객실 수"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button type="primary" danger htmlType="submit" block>
                      신청하기
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </div>
      </Drawer>
      <Modal
        open={isModalOpen}
        title={
          <div
            style={{
              fontWeight: "bold",
              fontSize: size === "mobile" ? "18px" : "24px",
            }}
          >
            레드스위치 개인정보처리방침
          </div>
        }
        onCancel={() => setIsModalOpen(false)}
        footer={
          <Button
            onClick={() => setIsModalOpen(false)}
            style={{ backgroundColor: "black", color: "white" }}
          >
            닫기
          </Button>
        }
        width={size === "mobile" ? "100%" : "100%"}
        centered
        style={{ zIndex: 9999, borderRadius: "10px" }}
        className="custom-modal"
        onScroll={(e) => e.stopPropagation()}
        maskClosable={false}
      >
        <div
          style={{
            whiteSpace: "pre-line",
            fontSize: size === "mobile" ? "10px" : "12px",
            color: "white",
          }}
        >
          {`제1조 (총칙)

레드스위치 주식회사(이하 "회사")는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다. 

회사는 성인용품 비대면 판매 플랫폼으로서, 숙박 업소 이용 고객에게 편리하고 프라이버시를 보호하며, 가장 필요한 순간 구매와 수령이 즉시 가능한 이색 쇼핑 경험을 제공합니다. 본 방침은 관련 법령의 개정이나 회사 정책의 변경에 따라 수시로 변경될 수 있으며, 변경 시 웹사이트 공지사항을 통하여 고지할 것입니다.

제2조 (개인정보의 처리 목적)

회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.

1. 가맹점 계약 체결 및 관리
   - 가맹점 계약 체결을 위한 본인 식별·인증, 가맹점 자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지, 고충처리 등을 목적으로 개인정보를 처리합니다.

2. 서비스 개선 및 마케팅
   - 신규 서비스 개발 및 맞춤 서비스 제공, 통계학적 특성에 따른 서비스 제공, 서비스의 유효성 확인, 접속빈도 파악 등을 목적으로 개인정보를 처리합니다.

제3조 (개인정보의 처리 및 보유기간)

① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.

② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.

1. 가맹점 계약 관리 : 가맹점 탈퇴 시까지
   다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지
   1) 관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지
   2) 재화 또는 서비스 제공에 따른 채권·채무관계 잔존 시에는 해당 채권·채무관계 정산 시까지

2. 행태정보 : 수집일로부터 1년

제4조 (처리하는 개인정보의 항목)

회사는 다음의 개인정보 항목을 처리하고 있습니다.

1. 가맹점 계약 체결
   - 필수항목 : 가맹점명, 담당자 이름, 담당자 연락처, 담당자 이메일, 가맹점 주소, 객실 수
   - 선택항목 : 없음

2. 행태정보 수집
   - 성별, 나이, 성적 지향성(이성애자/동성애자)

3. 자동 생성 정보
   - IP주소, 쿠키, MAC주소, 서비스 이용기록, 방문기록, 불량 이용기록 등

제5조 (개인정보의 제3자 제공)

① 회사는 정보주체의 개인정보를 제2조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.

② 회사는 현재 개인정보를 제3자에게 제공하고 있지 않습니다. 향후 제3자 제공 필요가 발생할 경우, 사전에 정보주체의 동의를 받아 필요 최소한의 범위로 제공할 것이며, 관련 사항은 본 개인정보 처리방침을 통해 공개하도록 하겠습니다.

제6조 (개인정보처리의 위탁)

① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.

1. 배송업무
   - 위탁받는 자 (수탁자) : OO택배
   - 위탁하는 업무의 내용 : 상품 배송업무

2. 채권추심업무
   - 위탁받는 자 (수탁자) : OO신용정보
   - 위탁하는 업무의 내용 : 채권추심 업무

② 회사는 위탁계약 체결시 「개인정보 보호법」 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적․관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리․감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.

③ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본 개인정보 처리방침을 통하여 공개하도록 하겠습니다.

제7조 (정보주체와 법정대리인의 권리·의무 및 그 행사방법)

① 정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.

② 제1항에 따른 권리 행사는 회사에 대해 「개인정보 보호법」 시행령 제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.

③ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 "개인정보 처리 방법에 관한 고시(제2020-7호)" 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.

④ 개인정보 열람 및 처리정지 요구는 「개인정보 보호법」 제35조 제4항, 제37조 제2항에 의하여 정보주체의 권리가 제한 될 수 있습니다.

⑤ 개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.

⑥ 회사는 정보주체 권리에 따른 열람의 요구, 정정·삭제의 요구, 처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한 대리인인지를 확인합니다.

제8조 (개인정보의 파기)

① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.

② 정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.

③ 개인정보 파기의 절차 및 방법은 다음과 같습니다.
1. 파기절차
회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.

2. 파기방법
회사는 전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록 파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.

제9조 (개인정보의 안전성 확보 조치)

회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.

1. 관리적 조치 : 내부관리계획 수립·시행, 정기적 직원 교육 등
2. 기술적 조치 : 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치 
3. 물리적 조치 : 전산실, 자료보관실 등의 접근통제

제10조 (개인정보 자동 수집 장치의 설치•운영 및 거부에 관한 사항)

① 회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.

② 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다.

   가. 쿠키의 사용목적: 이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부, 등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.
   나. 쿠키의 설치•운영 및 거부 : 웹브라우저 상단의 도구>인터넷 옵션>개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부 할 수 있습니다.
   다. 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.

제11조 (행태정보의 수집·이용 및 거부 등에 관한 사항)

① 회사는 서비스 개선 및 맞춤형 서비스 제공을 위해 행태정보를 수집·이용하고 있습니다.

② 회사는 다음과 같이 행태정보를 수집합니다.
- 수집하는 행태정보의 항목 : 성별, 나이, 성적 지향성(이성애자/동성애자)
- 행태정보 수집 방법 : 자체 sex mbti 테스트 플랫폼
- 행태정보 수집 목적 : 서비스 개선 및 신규 서비스 개발

③ 회사는 행태정보를 제3자에게 제공하지 않습니다.

④ 회사는 행태정보 수집·이용·분석 시 특정 개인을 알아볼 수 없도록 비식별화 처리를 하여 이용합니다.

⑤ 정보주체는 웹브라우저의 쿠키 설정 변경 등을 통해 행태정보 수집·이용을 거부할 수 있습니다. 다만, 일부 서비스 이용에 어려움이 발생할 수 있습니다.

제12조 (영상정보처리기기 설치·운영)

① 회사는 아래와 같이 영상정보처리기기를 설치·운영하고 있습니다.

1. 영상정보처리기기 설치근거·목적 : 회사의 직원 안전 및 범죄 예방
2. 설치 대수, 설치 위치, 촬영 범위 : 사무실 내 10대 설치, 촬영범위는 사무실 내부
3. 관리책임자, 담당부서 및 영상정보에 대한 접근권한자 : 이한샘
4. 영상정보 촬영시간, 보관기간, 보관장소, 처리방법 
   - 촬영시간 : 24시간 촬영
   - 보관기간 : 촬영시부터 30일 
   - 보관장소 및 처리방법 : 관리팀 영상정보처리기기 통제실에 보관·처리
5. 영상정보 확인 방법 및 장소 : 관리책임자에 요구 (관리팀)
6. 정보주체의 영상정보 열람 등 요구에 대한 조치 : 개인영상정보 열람·존재확인 청구서로 신청하여야 하며, 정보주체 자신이 촬영된 경우 또는 명백히 정보주체의 생명·신체·재산 이익을 위해 필요한 경우에 한해 열람을 허용함
7. 영상정보 보호를 위한 기술적·관리적·물리적 조치 : 내부관리계획 수립, 접근통제 및 접근권한 제한, 영상정보의 안전한 저장·전송기술 적용, 처리기록 보관 및 위·변조 방지조치, 보관시설 마련 및 잠금장치 설치 등

제13조 (개인정보 보호책임자)

① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.


▶ 개인정보 보호책임자 
성명 : 이한샘
직책 : 대표
연락처 : 010-8859-7942 / redswitch.help@gmail.com

② 정보주체께서는 회사의 서비스(또는 사업)을 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 회사는 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.

제14조 (개인정보 열람청구)

정보주체는 「개인정보 보호법」 제35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다. 회사는 정보주체의 개인정보 열람청구가 신속하게 처리되도록 노력하겠습니다.

▶ 개인정보 열람청구 접수·처리 부서 
담당자 : 이한샘
연락처 : 010-8859-7942 / redswitch.help@gmail.com

제15조 (권익침해 구제방법)

정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타 개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.

1. 개인정보분쟁조정위원회 : (국번없이) 1833-6972 (www.kopico.go.kr)
2. 개인정보침해신고센터 : (국번없이) 118 (privacy.kisa.or.kr)
3. 대검찰청 : (국번없이) 1301 (www.spo.go.kr)
4. 경찰청 : (국번없이) 182 (ecrm.cyber.go.kr)

제16조 (개인정보 처리방침 변경)

이 개인정보처리방침은 2024년 8월 8일부터 적용됩니다.

제17조 (개인정보의 안전성 확보 조치)

회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.

1. 개인정보 취급 직원의 최소화 및 교육
개인정보를 취급하는 직원을 지정하고 담당자에 한정시켜 최소화 하여 개인정보를 관리하는 대책을 시행하고 있습니다.

2. 내부관리계획의 수립 및 시행
개인정보의 안전한 처리를 위하여 내부관리계획을 수립하고 시행하고 있습니다.

3. 개인정보의 암호화
이용자의 개인정보는 비밀번호는 암호화 되어 저장 및 관리되고 있어, 본인만이 알 수 있으며 중요한 데이터는 파일 및 전송 데이터를 암호화 하거나 파일 잠금 기능을 사용하는 등의 별도 보안기능을 사용하고 있습니다.

4. 해킹 등에 대비한 기술적 대책
회사는 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검을 하며 외부로부터 접근이 통제된 구역에 시스템을 설치하고 기술적/물리적으로 감시 및 차단하고 있습니다.

5. 개인정보에 대한 접근 제한
개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여,변경,말소를 통하여 개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있으며 침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있습니다.

6. 접속기록의 보관 및 위변조 방지
개인정보처리시스템에 접속한 기록을 최소 1년 이상 보관, 관리하고 있으며, 접속 기록이 위변조 및 도난, 분실되지 않도록 보안기능 사용하고 있습니다.

7. 문서보안을 위한 잠금장치 사용
개인정보가 포함된 서류, 보조저장매체 등을 잠금장치가 있는 안전한 장소에 보관하고 있습니다.

8. 비인가자에 대한 출입 통제
개인정보를 보관하고 있는 물리적 보관 장소를 별도로 두고 이에 대해 출입통제 절차를 수립, 운영하고 있습니다.

이상으로 레드스위치의 개인정보 처리방침을 마칩니다. 본 방침은 법령・정책 또는 보안기술의 변경에 따라 내용의 추가・삭제 및 수정이 있을 시에는 변경되는 개인정보 처리방침을 시행하기 최소 7일전에 당사 홈페이지를 통해 변경사유 및 내용 등을 공지하도록 하겠습니다.`}
        </div>
      </Modal>
    </>
  );
};

export default CenteredForm;
