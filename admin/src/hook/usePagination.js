import { useState } from "react";

const usePagination = (initialPageSize = 10) => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: initialPageSize,
  });

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  return { pagination, setPagination, handleTableChange };
};

export default usePagination;
