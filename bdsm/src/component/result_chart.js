import React, { useEffect, useState } from "react";
import { Progress, Row, Col, Typography, Image, Divider } from "antd";
import { AxiosGet } from "../api";

const { Text, Title } = Typography;

const dataMap = {
  master_mistress_total: "마스터/미스트레스",
  slave_total: "슬레이브",
  hunter_total: "헌터",
  prey_total: "프레이",
  brat_tamer_total: "브랫테이머",
  brat_total: "브랫",
  owner_total: "오너",
  pet_total: "펫",
  daddy_mommy_total: "대디/마미",
  little_total: "리틀",
  sadist_total: "사디스트",
  masochist_total: "마조히스트",
  spanker_total: "스팽커",
  spankee_total: "스팽키",
  degrader_total: "디그레이더",
  degradee_total: "디그레이디",
  rigger_total: "리거",
  rope_bunny_total: "로프버니",
  dominant_total: "도미넌트",
  submissive_total: "서브미시브",
  switch_total: "스위치",
  vanilla_total: "바닐라",
};

const ResultChart = ({ data }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [results, setResults] = useState([]);
  const [firstType, setFirstType] = useState(null);

  useEffect(() => {
    console.log("Data received:", data);
    const fetchResults = async () => {
      try {
        AxiosGet("/bdsm/results")
          .then((response) => {
            console.log("Result fetched:", response.data);
            setResults(response.data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      } catch (error) {}
    };

    fetchResults();
  }, []);

  // 데이터 정렬 (값 기준 내림차순)
  const sortedData = Object.entries(data)
    .filter(([key]) => key.endsWith("_total")) // "_total"로 끝나는 데이터만 필터링
    .sort((a, b) => b[1] - a[1]); // 값 기준 내림차순 정렬

  const getResult = (type) => {
    const result = results.find(
      (res) => res.type === type.replaceAll("total", "")
    );
    return result ? result : null;
  };

  useEffect(() => {
    if (sortedData[0]) {
      let result = getResult(sortedData[0][0].replaceAll("total", ""));
      if (result) {
        console.log(result.key);
        setFirstType(result.key);
      }
    }
  }, [sortedData]);

  return (
    <div style={{ width: "90%", margin: "0 auto" }}>
      {firstType && (
        <Image
          preview={false}
          src={require(`../assets/bdsm_type/${firstType}.jpg`)}
          width="100%"
          style={{ marginBottom: "20px" }}
        />
      )}
      {/* 화면 중앙 정렬 */}
      {sortedData.map(([key, value], index) => {
        // 퍼센트 계산: 0을 기준으로 비율 계산
        const maxValue = 200;
        const minValue = -200;
        const positivePercent = ((value > 0 ? value : 0) / maxValue) * 100; // 양수의 퍼센트
        const negativePercent =
          ((value < 0 ? Math.abs(value) : 0) / maxValue) * 100; // 음수의 퍼센트

        return (
          <div
            key={key}
            style={{ cursor: "pointer" }}
            onClick={() =>
              setSelectedIndex(selectedIndex === index ? null : index)
            }
          >
            <Row align="middle" style={{ marginBottom: "10px" }}>
              {/* 항목 이름과 해설 버튼 */}
              <Col span={12} style={{ textAlign: "left" }}>
                <Text
                  style={{
                    fontSize: "medium",
                    fontWeight: "bold",
                    cursor: "pointer", // 클릭 가능한 스타일
                  }}
                >
                  {getResult(key) ? getResult(key).tendency : dataMap[key]}
                </Text>
              </Col>

              <Col span={8}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {/* 음수 바 */}
                  <div
                    style={{
                      width: "50%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Progress
                      percent={negativePercent} // 음수 값의 퍼센트 계산
                      trailColor="#2e2e2e"
                      strokeColor={negativePercent > 70 ? "#ef4444" : "#eab308"}
                      showInfo={false}
                      style={{
                        transform: value < 0 ? "scaleX(-1)" : "none", // 음수일 때 180도 회전
                        transformOrigin: "center", // 회전의 기준점을 가운데로 설정
                        borderRadius: "0", // 모서리를 둥글게 하지 않음
                      }}
                      strokeLinecap="square"
                      strokeWidth={12}
                    />
                  </div>

                  {/* 양수 바 */}
                  <div
                    style={{
                      width: "50%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Progress
                      percent={positivePercent} // 양수 값의 퍼센트 계산
                      trailColor="#2e2e2e"
                      strokeColor={positivePercent > 70 ? "#22c55e" : "#84cc16"}
                      showInfo={false}
                      style={{
                        borderRadius: "0", // 모서리를 둥글게 하지 않음
                      }}
                      strokeLinecap="square"
                      strokeWidth={12}
                    />
                  </div>
                </div>
              </Col>

              <Col span={4}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginLeft: "10px",
                    color: positivePercent
                      ? positivePercent > 70
                        ? "#22c55e"
                        : "#84cc16"
                      : negativePercent > 70
                      ? "#ef4444"
                      : "#eab308",
                  }}
                >
                  {value}
                </Text>
              </Col>
              {/* 설명을 트리 형태로 표시 */}
              {selectedIndex === index && (
                <div
                  style={{
                    textAlign: "left",
                    paddingTop: "10px",
                    opacity: 0.8,
                  }}
                >
                  <Text style={{ whiteSpace: "pre-line" }}>
                    {getResult(key) ? getResult(key).description : dataMap[key]}
                    에 대한 상세 설명을 여기에 입력합니다. 이 부분은 해당 항목에
                    대한 설명이나 추가적인 정보를 보여줄 수 있는 곳입니다.
                  </Text>
                </div>
              )}
            </Row>
          </div>
        );
      })}
    </div>
  );
};

export default ResultChart;
