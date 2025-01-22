import React, { useEffect, useState } from "react";
import { AxiosGet } from "../../api";
import { List, Skeleton, Button } from "antd";
import { PostDetailModal } from "../../pages/admin/franchise_post";

function FranchiseList(props) {
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState(null); // 현재 선택된 포스트
  const [franchisePosts, setFranchisePosts] = useState([]); // 가맹점 게시물 목록
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 데이터를 처음 불러오기
  useEffect(() => {
    const fetchFranchisePosts = async () => {
      try {
        const res = await AxiosGet("/posts/franchises");
        setFranchisePosts(res.data.slice(0, 5)); // 처음 5개만 가져옴
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFranchisePosts();
  }, []);

  // 더보기 버튼 클릭 시 처리
  const onLoadMore = () => {
    // 현재는 5개만 표시되므로 더보기 버튼을 클릭하면 나머지 항목을 불러옴
    // AxiosGet("/posts/franchises")
    //   .then((res) => {
    //     setFranchisePosts(res.data); // 전체 데이터를 업데이트 (페이지네이션 로직을 추가할 수 있음)
    //   })
    //   .catch((err) => console.log(err));
    window.location.replace("/provider/post");
  };

  const loadMore =
    franchisePosts.length > 0 ? (
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
        dataSource={franchisePosts}
        renderItem={(item) => (
          <List.Item>
            <Skeleton title={false} loading={loading} active>
              <List.Item.Meta
                title={
                  <a
                    style={{ color: "black", fontWeight: "bold" }}
                    onClick={() => {
                      setCurrentPost(item);
                      setIsDetailModalVisible(true);
                    }}
                  >
                    {item.franchise_name}
                  </a>
                }
                description={item.created_at.split("T")[0]}
              />
            </Skeleton>
          </List.Item>
        )}
      />
      <PostDetailModal
        isModalOpen={isDetailModalVisible}
        setIsModalOpen={setIsDetailModalVisible}
        currentPost={currentPost}
      />
    </>
  );
}

export default FranchiseList;
