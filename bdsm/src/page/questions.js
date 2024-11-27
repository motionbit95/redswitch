import React, { useEffect, useState } from "react";
import { AxiosGet, AxiosPost } from "../api";
import { useMediaQuery } from "react-responsive";
import {
  Carousel,
  Space,
  Card,
  Button,
  Typography,
  Row,
  Col,
  Progress,
  message,
  Spin,
} from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../component/loading";

function Questions(props) {
  const { theme, setPage } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]); // 전체 질문
  const [currentPage, setCurrentPage] = useState(1); // 모바일 사이즈 이상에서의 페이지 Number
  const [currentSlide, setCurrentSlide] = useState(0); // 모바일에서의 슬라이드 Number
  const [answeredCount, setAnsweredCount] = useState(0); // 답안 질문의 개수(프로그레스바에 사용)
  const [totalAnswers, setTotalAnswers] = useState([]); // 각 질문의 선택된 답변을 저장(답안지)
  const [loading, setLoading] = useState(false);
  const carouselRef = React.useRef(null);

  // Media queries
  const isSmallScreen = useMediaQuery({ maxWidth: 769 });

  const questionsPerPage = 5;

  useEffect(() => {
    try {
      // home에서 입력했던 사용자 정보를 저장합니다.
      console.log(location.state.user_info);
      setUser(location.state.user_info);
    } catch (error) {
      console.error(error);
    }
  }, [location.state]);

  useEffect(() => {
    const getAllQuestions = async () => {
      try {
        const res = await AxiosGet("/bdsm/questions");
        setQuestions(res.data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };
    getAllQuestions();
  }, []);

  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = questions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  const handleSlideChange = (current) => {
    setCurrentSlide(current);
  };

  const handleAnswerSelection = (questionIndex, anwerIndex) => {
    if (!totalAnswers[questionIndex]) {
      // 답변이 아직 선택되지 않은 경우에만 진행도 증가
      setAnsweredCount((prevCount) => prevCount + 1);
    }

    setTotalAnswers((prev) => {
      return {
        ...prev,
        [questionIndex]: anwerIndex,
      };
    });
  };

  const handleNextQuestion = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevQuestion = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleFinish = () => {
    if (answeredCount === questions.length) {
      message.success("제출이 완료되었습니다.");
      // 답안지를 서버로 전송
      setLoading(true);
      // 결과 계산
      AxiosPost("/bdsm/calculate-scores", { answers: totalAnswers })
        .then((res) => {
          setLoading(false);
          if (res.status === 200) {
            console.log({ ...res.data.totalScores, ...user });
            // DB에 저장하는 예제
            AxiosPost("/bdsm/save-score-result", {
              ...res.data.totalScores,
              ...user,
            })
              .then((res) => {
                if (res.status === 200) {
                  console.log(res.data);
                  navigate(`/result/${res.data.id}`);
                }
              })
              .catch((error) => {
                setLoading(false);
                console.error(error);
              });
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error(error);
        });
    } else {
      message.error("미응답 질문이 존재해요!");
    }
  };

  return (
    <div
      className="center"
      style={{ minHeight: "100vh", width: "100%", maxWidth: "1024px" }}
    >
      <Loading isLoding={loading} />
      <div
        style={{
          position: "sticky",
          left: "0",
          top: "0",
          zIndex: 1,
          backgroundColor: theme === "dark" ? "#000" : "#fff",
          color: theme === "dark" ? "#fff" : "#000",
          padding: "20px",
        }}
      >
        <h1>🔥 BDSM 테스트 🔥</h1>
        <Progress
          percent={(answeredCount / questions.length) * 100}
          status="active"
          showInfo={false}
          style={{ marginBottom: "20px" }}
        />
      </div>
      <div style={{ padding: "20px" }}>
        {isSmallScreen ? (
          <div>
            <Carousel
              fade
              dots={false}
              ref={carouselRef}
              afterChange={handleSlideChange}
            >
              {questions.map((value, index) => (
                <div key={index}>
                  <Card style={{ display: "flex", flexDirection: "column" }}>
                    <Row gutter={[16, 16]} style={{ width: "100%", flex: 1 }}>
                      <Col span={24}>
                        <Typography.Text
                          className="text-medium"
                          style={{
                            whiteSpace: "pre-line",
                            fontWeight: "bold",
                          }}
                        >
                          {value.question}
                        </Typography.Text>
                      </Col>
                      <Col span={24} style={{ flexGrow: 1 }}>
                        <Answer
                          answers={totalAnswers}
                          question_pk={value.index}
                          onSelect={(questionIndex, anwerIndex) => {
                            handleAnswerSelection(questionIndex, anwerIndex);
                            carouselRef.current.next();
                          }}
                        />
                      </Col>
                    </Row>
                  </Card>
                </div>
              ))}
            </Carousel>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Button
                type="link"
                icon={<LeftOutlined />}
                onClick={() => carouselRef.current.prev()}
                disabled={currentSlide === 0}
              >
                이전
              </Button>
              <Button
                type="link"
                icon={<RightOutlined />}
                onClick={() => carouselRef.current.next()}
                disabled={currentSlide === questions.length - 1}
              >
                다음
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Space direction="vertical" style={{ width: "100%" }}>
              {currentQuestions.map((value, index) => (
                <Card
                  key={index}
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    // padding: "10px",
                  }}
                >
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Typography.Text
                        className="text-medium"
                        style={{ whiteSpace: "pre-line", fontWeight: "bold" }}
                      >
                        {value.question}
                      </Typography.Text>
                    </Col>
                    <Col
                      span={24}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Answer
                        answers={totalAnswers}
                        question_pk={value.index}
                        onSelect={(questionIndex, anwerIndex) => {
                          handleAnswerSelection(questionIndex, anwerIndex);
                        }}
                      />
                    </Col>
                  </Row>
                </Card>
              ))}
            </Space>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <Button
                type="link"
                icon={<LeftOutlined />}
                onClick={handlePrevQuestion}
                disabled={currentPage === 1}
              >
                이전
              </Button>
              <Button
                type="link"
                icon={<RightOutlined />}
                onClick={handleNextQuestion}
                disabled={
                  currentPage === Math.ceil(questions.length / questionsPerPage)
                }
              >
                다음
              </Button>
            </div>
          </div>
        )}

        {answeredCount === questions.length && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Button size="large" type="primary" onClick={handleFinish}>
              🎉 BDSM 테스트 결과 보러가기 🎉
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

const strList = [
  "동의",
  "대체적으로 동의",
  "약간 동의",
  "모르겠음",
  "약간 비동의",
  "대체적으로 비동의",
  "비동의",
];

const Answer = (props) => {
  const { question_pk, onSelect, answers } = props;

  const onAnswer = async (index) => {
    onSelect(question_pk, index + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row-reverse",
        }}
      >
        <div>{strList[0]}</div>
        <div>{strList[3]}</div>
        <div>{strList[6]}</div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row-reverse",
        }}
      >
        {strList.map((answer, index) => (
          <div
            key={index}
            onClick={() => onAnswer(index)}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width:
                index === 0 || index === 6
                  ? "50px"
                  : index === 1 || index === 5
                  ? "45px"
                  : index === 2 || index === 4
                  ? "40px"
                  : "35px",
              aspectRatio: "1 / 1",
              borderRadius: "100px",
              border: "2px solid",
              backgroundColor:
                answers[question_pk] === index + 1 ? "#8c8c8c" : "transparent", // 선택된 답변 강조
              borderColor:
                index === 6
                  ? "#f5222d"
                  : index === 5
                  ? "#fa541c"
                  : index === 4
                  ? "#fa8c16"
                  : index === 3
                  ? "#faad14"
                  : index === 2
                  ? "#fadb14"
                  : index === 1
                  ? "#52c41a"
                  : "#13c2c2",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Questions;
