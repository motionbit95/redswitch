import { useState, useEffect, useRef } from "react";
import soundFile from "../assets/VoicesAI_1724058982121.mp3"; // 사운드 파일 경로

const useAlarmManager = (alarms) => {
  const [selectedAlarm, setSelectedAlarm] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [shouldCheckAlarms, setShouldCheckAlarms] = useState(false);

  const audioRef = useRef(null);

  // 사운드 재생
  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    audioRef.current = new Audio(soundFile);
    audioRef.current.loop = true;
    audioRef.current
      .play()
      .catch((e) => console.error("Audio play failed:", e));
  };

  // 사운드 정지
  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  // 알람 클릭 처리
  const handleAlarmClick = (alarm) => {
    setSelectedAlarm(alarm);
    setIsModalVisible(true);
    playSound();
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedAlarm(null);
    stopSound();
  };

  // 알람 초기 체크 및 변경 감지
  useEffect(() => {
    if ((isFirstLoad || shouldCheckAlarms) && alarms.length > 0) {
      const latestUnseenAlarm = alarms.find(
        (alarm) => alarm.alarm_status === 0
      );
      if (latestUnseenAlarm) {
        setSelectedAlarm(latestUnseenAlarm);
        setIsModalVisible(true);
        playSound();
      }

      // 플래그 초기화
      if (isFirstLoad) setIsFirstLoad(false);
      if (shouldCheckAlarms) setShouldCheckAlarms(false);
    }
  }, [isFirstLoad, shouldCheckAlarms, alarms]);

  // 알람 변경 시 플래그 업데이트
  useEffect(() => {
    if (!isFirstLoad && alarms.length > 0) {
      setShouldCheckAlarms(true);
    }
  }, [alarms]);

  return {
    selectedAlarm,
    isModalVisible,
    handleAlarmClick,
    handleCloseModal,
  };
};

export default useAlarmManager;
