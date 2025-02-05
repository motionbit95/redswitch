import React from "react";
import { Space, Button, Input, Card, Image, Row, Col, Drawer } from "antd";
import { AxiosGet } from "../api";
import { useState } from "react";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";

const Spot = (props) => {
  const { theme, setPage } = props;

  // Media queries
  const isSmallScreen = useMediaQuery({ maxWidth: 769 });
  const isMediumScreen = useMediaQuery({ minWidth: 769, maxWidth: 1200 });
  const isLargeScreen = useMediaQuery({ minWidth: 1201 });

  const size = isSmallScreen ? "small" : isMediumScreen ? "medium" : "large";
  const [spots, setSpots] = useState([]);
  const [branches, setBranches] = useState([]);

  const [filteredSpots, setFilteredSpots] = useState([]);
  const [searchInputs, setSearchInputs] = useState({
    branch_sido: "",
    branch_sigungu: "",
    company_name: "",
  });

  const [isvisible, setIsvisible] = useState(false);
  const [details, setDetails] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    AxiosGet("/spots")
      .then((res) => {
        setSpots(res.data);
        setFilteredSpots(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    AxiosGet("/branches")
      .then((res) => {
        setBranches(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchInputs((prev) => ({ ...prev, [name]: value }));
  };

  const onSearch = () => {
    const { branch_sido, branch_sigungu, branch_name } = searchInputs;

    console.log(searchInputs);

    // 검색어가 하나도 입력되지 않았을 경우, 전체 데이터 표시
    if (!branch_sido && !branch_sigungu && !branch_name) {
      setFilteredSpots(spots);
      return;
    }
    // Branches 데이터 필터링
    const filteredBranches = branches.filter((branch) => {
      return (
        (!branch_sido || branch.branch_sido.includes(branch_sido)) &&
        (!branch_sigungu || branch.branch_sigungu.includes(branch_sigungu)) &&
        (!branch_name || branch.branch_name.includes(branch_name))
      );
    });

    // Branches에서 id 추출
    const branchIds = filteredBranches.map((branch) => branch.id);

    // Spots 데이터 필터링
    const filtered = spots.filter((spot) => branchIds.includes(spot.spot_id));
    setFilteredSpots(filtered);
  };

  const handleDetail = (spot) => {
    console.log("detail", spot);
    setIsvisible(true);
    setDetails(spot);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Row>
        <Col
          span={size === "small" ? 24 : 12}
          className={`container-${size}`}
          style={{
            backgroundColor: theme === "dark" ? "black" : "#f1f1f1",
            height: "100vh",
          }}
        >
          <Space direction="vertical" size={"middle"} style={{ width: "100%" }}>
            <Row gutter={8}>
              <Col span={12}>
                <Input
                  name="branch_sido"
                  value={searchInputs.branch_sido}
                  onChange={handleInputChange}
                  placeholder="시, 도"
                  className="search_input"
                />
              </Col>
              <Col span={12}>
                <Input
                  name="branch_sigungu"
                  value={searchInputs.branch_sigungu}
                  onChange={handleInputChange}
                  placeholder="시, 군, 구"
                  className="search_input"
                />
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={19}>
                <Input
                  name="branch_name"
                  value={searchInputs.branch_name}
                  onChange={handleInputChange}
                  placeholder="매장명"
                  className="search_input"
                />
              </Col>
              <Col span={5}>
                <Button style={{ width: "100%" }} onClick={onSearch}>
                  검색
                </Button>
              </Col>
            </Row>
          </Space>
          <Space
            direction="vertical"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Col
              style={{
                width: "100%",
                padding: "16px",
                minHeight: "70vh",
              }}
            >
              {filteredSpots.map((spot) => (
                <Space
                  direction="vertical"
                  style={{ width: "100%", marginBottom: "16px" }}
                  key={spot.id}
                >
                  {/* <div style={{ padding: "16px" }}> */}
                  <Card color="#f0f0f0" onClick={() => handleDetail(spot)}>
                    <Space style={{ display: "flex", gap: "15px" }}>
                      <Image
                        src={spot.spot_logo}
                        style={{ width: "36px", overflow: "hidden" }}
                        alt="spot"
                        preview={false}
                      />
                      <Space
                        direction="vertical"
                        style={{
                          gap: "3px",
                          textAlign: "left",
                        }}
                      >
                        <div>{spot.spot_name}</div>
                        <div>{spot.branch_address}</div>
                        <div>{spot.branch_address_detail}</div>
                      </Space>
                    </Space>
                  </Card>
                  {/* </div> */}
                </Space>
              ))}
            </Col>
            <Space>
              <Button
                size="large"
                style={{ width: "100%" }}
                onClick={() => window.history.back()}
              >
                뒤로가기
              </Button>
            </Space>
          </Space>
        </Col>
        <Col
          span={size === "small" ? 24 : 12}
          className={`container-${size}`}
          style={{
            display: size === "small" ? "none" : "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minWidth: "390px",
          }}
        >
          {isvisible ? (
            <Space direction="vertical" style={{ width: "300px" }}>
              <Card>
                <Space direction="vertical">
                  <Space direction="vertical">
                    <div>{details ? details.spot_name : ""}</div>
                    <div>
                      {details
                        ? (() => {
                            // spot_name과 일치하는 branch 찾기
                            const matchedBranch = branches.find(
                              (branch) =>
                                branch.branch_name === details.spot_name
                            );

                            // 일치하는 branch가 있으면 branch_number 반환, 없으면 빈 문자열
                            return matchedBranch
                              ? matchedBranch.branch_contact
                              : "";
                          })()
                        : ""}
                    </div>
                    <Button
                      onClick={() =>
                        window.open(
                          // `https://spot.redswitch.kr/spot/${details?.spot_id}`
                          `https://redswitch-customer.netlify.app/spot/${details?.spot_id}`
                        )
                      }
                    >
                      샵 바로가기
                    </Button>
                  </Space>
                  <Image
                    src={details?.spot_image}
                    style={{
                      aspectRatio: "1/1",
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginTop: "10px",
                    }}
                    alt="spot"
                  />
                </Space>
              </Card>
            </Space>
          ) : (
            <span>매장을 선택해주세요</span>
          )}
        </Col>
        {size === "small" && (
          <Drawer
            title={
              <Space
                direction="horizontal"
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <div>{details?.spot_name}</div>
                <Button
                  onClick={() =>
                    window.open(
                      // `https://spot.redswitch.kr/spot/${details?.spot_id}`
                      `https://redswitch-customer.netlify.app/spot/${details?.spot_id}`
                    )
                  }
                >
                  샵 바로가기
                </Button>
              </Space>
            }
            placement="bottom"
            onClose={() => setIsvisible(false)}
            height={"auto"}
            open={isvisible}
            style={{
              backgroundColor: theme === "dark" ? "#1e1e1e" : "#f1f1f1",
              color: theme === "dark" ? "white" : "black",
            }}
            closeIcon={
              <div style={{ color: theme === "dark" ? "white" : "black" }}>
                X
              </div>
            }
            bodyStyle={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Space direction="vertical">
              <Image
                src={details?.spot_image}
                style={{
                  aspectRatio: "1/1",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
                alt="spot"
              />
              <Space direction="vertical">
                <div>매장주소: {details?.branch_address}</div>
                {details?.branch_address_detail && (
                  <div>매장주소: {details?.branch_address_detail}</div>
                )}
                <div>
                  매장번호:{" "}
                  {details
                    ? (() => {
                        // spot_name과 일치하는 branch 찾기
                        const matchedBranch = branches.find(
                          (branch) => branch.branch_name === details.spot_name
                        );

                        // 일치하는 branch가 있으면 branch_number 반환, 없으면 빈 문자열
                        return matchedBranch
                          ? matchedBranch.branch_contact
                          : "";
                      })()
                    : ""}
                </div>
              </Space>
            </Space>
          </Drawer>
        )}
      </Row>
    </div>
  );
};

export default Spot;
