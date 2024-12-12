// src/hooks/useFirebase.js
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// Firebase 알림 데이터 로드를 담당하는 함수
const fetchAlarms = (db, branchPks, setAlarms, setLoading) => {
  const alarmRef = ref(db, "order_alarm/");

  // onValue로 데이터를 실시간으로 수신
  const unsubscribe = onValue(alarmRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      // 데이터를 필터링하여 branchPks에 포함된 지점들에 해당하는 알림만 추출
      const filteredAlarms = Object.keys(data)
        .map((key) => data[key])
        .filter((alarm) => branchPks.includes(alarm.branch_pk)); // 여러 branch_pk를 체크

      setAlarms(filteredAlarms);
    } else {
      setAlarms([]);
    }
    setLoading(false);
  });

  // 컴포넌트가 언마운트될 때 리스너 제거
  return unsubscribe;
};

// useFirebase 훅
const useFirebase = (branchPks) => {
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase 초기화
    const firebaseConfig = {
      apiKey: "AIzaSyB_uysE_rTot3VVueGob5tvRfLAiIBQnkw",
      authDomain: "redswitch-64c62.firebaseapp.com",
      databaseURL: "https://redswitch-64c62-default-rtdb.firebaseio.com",
      projectId: "redswitch-64c62",
      storageBucket: "redswitch-64c62.firebasestorage.app",
      messagingSenderId: "920454846826",
      appId: "1:920454846826:web:926b1df388ccecc36eed13",
      measurementId: "G-14LXG328DE",
    };

    // Firebase 앱 초기화
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    // 알림 데이터를 로드
    const unsubscribe = fetchAlarms(db, branchPks, setAlarms, setLoading);

    // 컴포넌트가 언마운트되면 리스너를 제거
    return () => unsubscribe();
  }, [branchPks]); // branchPks가 변경될 때마다 데이터를 다시 로드

  return { alarms, loading };
};

export default useFirebase;
