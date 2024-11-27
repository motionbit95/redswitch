import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Divider, Space, Select } from "antd";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { AxiosGet } from "../../api";

// Chart.js에서 사용할 모듈 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const BDSMStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [filter, setFilter] = useState({
    type: "연령",
    value: "23~26",
  });

  // 나이대 순서 정의
  const ageRangeOrder = [
    "~19",
    "20~22",
    "23~26",
    "27~29",
    "30~32",
    "33~36",
    "37~39",
    "40~45",
    "46~49",
    "50~",
  ];

  // 예시로 API 호출 없이 하드코딩된 데이터로 처리
  useEffect(() => {
    const fetchAverageBdsmScore = async () => {
      try {
        const statResponse = await AxiosGet("/bdsm/statistics");

        let avgResponse;
        if (filter.type === "연령") {
          avgResponse = await AxiosGet("/bdsm/age-group/average", {
            params: {
              ageRange: filter.value,
            },
          });
        }

        if (filter.type === "성별") {
          avgResponse = await AxiosGet("/bdsm/gender-group/average", {
            params: {
              genderGroup: filter.value,
            },
          });
        }

        if (filter.type === "성적취향") {
          avgResponse = await AxiosGet("/bdsm/preference-group/average", {
            params: {
              preferenceGroup: filter.value,
            },
          });
        }

        console.log(avgResponse.data);

        // 나이대 데이터 정렬
        const sortedAgeGroups = ageRangeOrder.reduce((acc, ageRange) => {
          if (statResponse.data.ageGroups[ageRange] !== undefined) {
            acc[ageRange] = statResponse.data.ageGroups[ageRange];
          }
          return acc;
        }, {});

        // 상태 업데이트
        setStatistics({
          ...statResponse.data,
          ageGroups: sortedAgeGroups, // 정렬된 나이대 데이터 추가
          bdsmScores: avgResponse.data,
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchAverageBdsmScore();
  }, []);

  useEffect(() => {
    const fetchAverageBdsmScore = async () => {
      if (filter) {
        console.log(filter.value);
        try {
          let avgResponse;
          if (filter.type === "연령") {
            avgResponse = await AxiosGet("/bdsm/age-group/average", {
              params: {
                ageRange: filter.value,
              },
            });
          }

          if (filter.type === "성별") {
            avgResponse = await AxiosGet("/bdsm/gender-group/average", {
              params: {
                genderGroup: filter.value,
              },
            });
          }

          if (filter.type === "성적취향") {
            avgResponse = await AxiosGet("/bdsm/preference-group/average", {
              params: {
                preferenceGroup: filter.value,
              },
            });
          }

          console.log({
            ...statistics,
            bdsmScores: avgResponse.data,
          });
          setStatistics({
            ...statistics,
            bdsmScores: avgResponse.data,
          });
        } catch (error) {
          console.error("Error fetching statistics:", error);
        }
      }
    };
    if (statistics) {
      fetchAverageBdsmScore();
    }
  }, [filter]);

  useEffect(() => {
    // filter.type이 변경될 때마다 초기 값을 설정
    let initialValue = "";

    if (filter.type === "연령") {
      initialValue = "23~26"; // 기본 연령대 설정
    } else if (filter.type === "성별") {
      initialValue = "남자"; // 기본 성별 설정
    } else if (filter.type === "성적취향") {
      initialValue = "이성애자"; // 기본 성적취향 설정
    }

    // 필터 상태가 변경되었을 때 value를 초기화합니다.
    setFilter((prevFilter) => ({
      ...prevFilter,
      value: initialValue,
    }));
  }, [filter.type]);

  if (!statistics) return <div>Loading...</div>;

  // 데이터가 비어있지 않거나, `undefined`가 아닌지 확인하는 함수
  const isValidData = (data) => data && Object.keys(data).length > 0;

  // 차트 데이터 준비
  const chartData = (groups, isPie = false) => {
    if (!isValidData(groups)) return {}; // 유효한 데이터가 아닐 경우 빈 객체 반환

    const labels = Object.keys(groups);
    const data = Object.values(groups);

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: isPie
            ? ["#FF8C00", "#32CD32", "#6495ED", "#FF6347", "#FFD700"]
            : "#1890ff", // 색상 설정
          borderColor: isPie ? "#fff" : undefined, // 파이차트의 경우 경계선 색
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={16}>
        {/* 전체 응답 수 */}
        <Col span={24}>
          <Card>
            <Statistic title="전체 응답 수" value={statistics.totalResponses} />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={16}>
        {/* 연령대 통계 (가로 바 차트) */}
        <Col sm={24} lg={12}>
          <Card
            style={{
              height: "100%", // 높이를 100%로 설정
              display: "flex",
              flexDirection: "column", // 세로 방향으로 정렬
            }}
          >
            <h3>연령대</h3>
            <Bar
              data={chartData(statistics.ageGroups, false)}
              options={{
                responsive: true,
                maintainAspectRatio: true, // 차트 비율 자동 맞추기
                indexAxis: "y", // 가로 바 차트
                plugins: {
                  title: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) =>
                        `${tooltipItem.label}: ${tooltipItem.raw}명`, // 툴팁 수정
                    },
                  },
                  legend: {
                    display: false, // 범례(Label) 숨기기
                  },
                },
                scales: {
                  x: {
                    beginAtZero: true, // x축은 0부터 시작
                    ticks: {
                      stepSize: 1, // 바의 간격 조정
                    },
                    grid: {
                      display: false, // x축의 격자선 숨기기
                    },
                  },
                  y: {
                    ticks: {
                      font: {
                        size: 12, // y축 레이블 폰트 크기 축소
                        callback: function (value, index, values) {
                          const customLabels = [
                            "~19",
                            "20~22",
                            "23~26",
                            "27~29",
                            "30~32",
                            "33~36",
                            "37~39",
                            "40~45",
                            "46~49",
                            "50~",
                          ]; // 원하는 순서대로 레이블 정의
                          return customLabels[index]; // index를 기반으로 레이블 순서 반환
                        },
                      },
                    },
                    barThickness: "5px", // 막대 두께를 적당히 얇게 설정
                    maxBarThickness: "10px", // 막대의 최대 두께를 설정 (최대 10px)
                    grid: {
                      display: false, // y축의 격자선 숨기기
                    },
                    reverse: true, // y축 값 순서를 내림차순으로 설정
                  },
                },
              }}
              style={{
                width: "100%", // 차트가 가로로 꽉 차도록 설정
                height: "100%", // 차트 높이를 Card의 100%로 설정
              }}
            />
          </Card>
        </Col>

        {/* 성별 통계 (파이 차트) */}
        <Col sm={12} lg={6}>
          <Card
            style={{
              height: "100%", // 높이를 100%로 설정
              display: "flex",
              flexDirection: "column", // 세로 방향으로 정렬
            }}
          >
            <h3>성별</h3>
            <Pie
              data={chartData(statistics.genderGroups, true)}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) =>
                        `${tooltipItem.label}: ${tooltipItem.raw}명`, // 툴팁 수정
                    },
                  },
                  legend: {
                    display: false, // 범례(Label) 숨기기
                  },
                },
              }}
              style={{
                height: "100%", // 차트의 높이를 Card의 100%로 설정
              }}
            />
          </Card>
        </Col>

        {/* 성적취향 통계 (파이 차트) */}
        <Col sm={12} lg={6}>
          <Card
            style={{
              height: "100%", // 높이를 100%로 설정
              display: "flex",
              flexDirection: "column", // 세로 방향으로 정렬
            }}
          >
            <h3>성적취향</h3>
            <Pie
              data={chartData(statistics.preferenceGroups, true)}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) =>
                        `${tooltipItem.label}: ${tooltipItem.raw}명`, // 툴팁 수정
                    },
                  },
                  legend: {
                    display: false, // 범례(Label) 숨기기
                  },
                },
              }}
              style={{
                height: "100%", // 차트의 높이를 Card의 100%로 설정
              }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* BDSM 점수 통계 (Bar 차트) */}
      <>
        <Row gutter={16}>
          <Col span={24}>
            <Card>
              <Space>
                <h3>BDSM 항목별 평균 점수</h3>
                <Select
                  popupMatchSelectWidth={false}
                  defaultValue={filter.type}
                  onChange={(e) => setFilter({ ...filter, type: e })}
                >
                  <Select.Option value="연령">연령</Select.Option>
                  <Select.Option value="성별">성별</Select.Option>
                  <Select.Option value="성적취향">성적취향</Select.Option>
                </Select>
                {filter.type === "연령" && (
                  <Select
                    value={filter.value}
                    onChange={(e) => setFilter({ ...filter, value: e })}
                  >
                    <Select.Option value="~19">19세 이하</Select.Option>
                    <Select.Option value="20~22">20세~22세</Select.Option>
                    <Select.Option value="23~26">23세~26세</Select.Option>
                    <Select.Option value="27~29">27세~29세</Select.Option>
                    <Select.Option value="30~32">30세~32세</Select.Option>
                    <Select.Option value="33~36">33세~36세</Select.Option>
                    <Select.Option value="37~39">37세~39세</Select.Option>
                    <Select.Option value="40~45">40세~45세</Select.Option>
                    <Select.Option value="46~49">46세~49세</Select.Option>
                    <Select.Option value="50~">50세 이상</Select.Option>
                  </Select>
                )}
                {filter.type === "성별" && (
                  <Select
                    popupMatchSelectWidth={false}
                    value={filter.value}
                    onChange={(e) => setFilter({ ...filter, value: e })}
                  >
                    <Select.Option value="남자">남자</Select.Option>
                    <Select.Option value="여자">여자</Select.Option>
                    <Select.Option value="트랜스젠더(MTF)">
                      트랜스젠더(MTF)
                    </Select.Option>
                    <Select.Option value="트랜스젠더(FTM)">
                      트랜스젠더(FTM)
                    </Select.Option>
                    <Select.Option value="기타">기타</Select.Option>
                  </Select>
                )}
                {filter.type === "성적취향" && (
                  <Select
                    popupMatchSelectWidth={false}
                    value={filter.value}
                    onChange={(e) => setFilter({ ...filter, value: e })}
                  >
                    <Select.Option value="이성애자">이성애자</Select.Option>
                    <Select.Option value="동성애자">동성애자</Select.Option>
                    <Select.Option value="양성애자">양성애자</Select.Option>
                    <Select.Option value="기타">기타</Select.Option>
                  </Select>
                )}
              </Space>
              <Bar
                data={{
                  ...chartData(statistics.bdsmScores, false), // 기존 chartData
                  datasets: [
                    {
                      ...chartData(statistics.bdsmScores, false).datasets[0], // 기존 dataset 복사
                      backgroundColor: chartData(
                        statistics.bdsmScores,
                        false
                      ).datasets[0].data.map(
                        (value) => (value < 0 ? "#ff4d4f" : "#40a9ff") // 음수일 경우 빨간색, 양수일 경우 파란색
                      ),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: (tooltipItem) =>
                          `${tooltipItem.label}: ${tooltipItem.raw}점`, // 툴팁 수정
                      },
                    },
                    legend: {
                      display: false, // 범례(Label) 숨기기
                    },
                  },
                  scales: {
                    x: {
                      beginAtZero: true, // x축은 0부터 시작
                      ticks: {
                        stepSize: 10, // 바 간격 설정
                        maxRotation: 90, // 최대 회전 각도 (세로로 설정)
                        minRotation: 90, // 최소 회전 각도 (세로로 설정)
                      },
                    },
                    y: {
                      ticks: {
                        font: {
                          size: 14, // y축 레이블 폰트 크기
                        },
                      },
                    },
                  },
                }}
              />
            </Card>
          </Col>
        </Row>
      </>
    </div>
  );
};

export default BDSMStatistics;
