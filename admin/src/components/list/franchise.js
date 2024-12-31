import React, { useEffect, useState } from "react";
import { AxiosGet } from "../../api";
import { List, Skeleton, Button } from "antd";
import { PostDetailModal } from "../../pages/provider/franchise_post";

function FranchiseList(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPost, setCurrentPost] = useState(null); // For post
  const [franchise_post, setFranchisePost] = useState([]);

  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  useEffect(() => {
    AxiosGet("/posts/franchises")
      .then((res) => {
        console.log(res.data);
        setFranchisePost(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onLoadMore = () => {
    window.location.replace("/provider/post");
  };
  const loadMore =
    franchise_post.length > 0 ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={onLoadMore}>더보기</Button>
      </div>
    ) : null;

  return (
    <>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={franchise_post}
        renderItem={(item) => (
          <List.Item>
            <Skeleton title={false} loading={item.loading} active>
              <List.Item style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <a
                    style={{ color: "black", fontWeight: "bold" }}
                    onClick={() => {
                      setCurrentPost(item);
                      setIsDetailModalVisible(true);
                    }}
                  >
                    {item.franchise_name}
                  </a>

                  <div style={{ color: "gray" }}>
                    {item.created_at.split("T")[0]}
                  </div>
                </div>
              </List.Item>
            </Skeleton>
          </List.Item>
        )}
      />
      <PostDetailModal
        isModalOpen={isDetailModalVisible}
        setIsModalOpen={setIsDetailModalVisible}
        currentPost={currentPost}
        // handleOk={handleOk}
      />
    </>
  );
}

export default FranchiseList;
