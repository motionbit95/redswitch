import { useMemo, useState, useEffect } from "react";
import dayjs from "dayjs";

/**
 * 결제 데이터를 기반으로 통계를 계산하는 훅
 * @param {Array} payments - 결제 데이터
 * @param {Array} range - 날짜 범위 [시작일, 종료일]
 * @returns {Object} 통계 데이터
 */
export const usePaymentStats = (payments, range) => {
  return useMemo(() => {
    const [startDate, endDate] = range;

    // 날짜 범위 내 결제 필터링
    const filteredPayments = payments.filter((payment) => {
      const ediDate = dayjs(payment.ediDate, "YYYYMMDDHHmmss");
      return ediDate.isBetween(startDate, endDate, "day", "[]");
    });

    // 모든 payments를 펼쳐 하나의 배열로 만듦
    const allPayments = filteredPayments.flatMap(({ payments }) => payments);

    // 통계 계산
    const totalAmount = allPayments
      .filter((payment) => payment.cancelYN === "N")
      .reduce((sum, payment) => sum + Number(payment.goodsAmt), 0);

    const refundAmount = allPayments
      .filter((payment) => payment.cancelYN === "Y")
      .reduce((sum, payment) => sum + Number(payment.goodsAmt), 0);

    return {
      totalAmount,
      totalTransactions: filteredPayments.length,
      refundAmount,
    };
  }, [payments, range]);
};

/**
 * 금일 및 전일 매출을 계산하는 훅
 * @param {Array} payments - 결제 데이터
 * @returns {Object} 금일 및 전일 매출
 */
export const useDailySales = (payments) => {
  const [dailySales, setDailySales] = useState({ today: 0, yesterday: 0 });

  useEffect(() => {
    const today = dayjs().format("YYYY-MM-DD");
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    const getDailySales = (date) =>
      payments
        .filter(
          (payment) =>
            dayjs(payment.ediDate, "YYYYMMDDHHmmss").format("YYYY-MM-DD") ===
            date
        )
        .filter((payment) => payment.cancelYN === "N")
        .reduce((sum, payment) => sum + Number(payment.goodsAmt), 0);

    setDailySales({
      today: getDailySales(today),
      yesterday: getDailySales(yesterday),
    });
  }, [payments]);

  return dailySales;
};
