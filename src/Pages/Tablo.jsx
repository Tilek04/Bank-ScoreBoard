import React, { useEffect, useState } from "react";
import style from "../styles/Tablo.module.scss";
import logo from "../assets/LOGO.png";
import { ClockCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import { tabloStore } from "../Zustand/store";
import { Ticker } from "../components/Ticker/Ticker";
import audio from "../assets/audio.mp3";
import { useParams } from "react-router";
import { debounce } from "lodash";
import { API } from "../utils/utils";
import { useRef } from "react";

const columns = [
  {
    title: "Талон",
    dataIndex: "token",
  },
  {
    title: "Статус",
    dataIndex: "status",
    render: (status) => {
      switch (status) {
        case "in service":
          return "В процессе";
        case "waiting":
          return "Ожидается";
        case "canceled":
          return "отменено";
        default:
          return status;
      }
    },
  },

  {
    title: "Окно",
    dataIndex: "window",
  },
];

export const Tablo = () => {
  const { id } = useParams();
  const getTalons = tabloStore((state) => state.getTalons);
  const ads = tabloStore((state) => state.ads);
  const talons = tabloStore((state) => state.talons);
  const [newTalon, setNewTalon] = useState(0);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [newTalonSound, setNewTalonSound] = useState(0);
  const audioRef = useRef(null);
  const [isTalonCalled, setIsTalonCalled] = useState(false);
  const [isAudioPlayed, setIsAudioPlayed] = useState(false);

  const completedTalons = talons.filter((item) => item.status === "completed");
  const pendingTalons = talons.filter((item) => item.status !== "completed");

  const speakTalonAndWindow = (talonId, windowNumber) => {
    const announcement = `Талон номер ${talonId}. Пожалуйста, подойдите к окну номер ${windowNumber}.`;

    // Проверяем поддержку SpeechSynthesis API
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(announcement);
      window.speechSynthesis.speak(utterance);
    } else {
      console.log("SpeechSynthesis API не поддерживается в этом браузере.");
    }
  };

  const updateTalonStatusAndPlayAudio = async (
    talonId,
    newStatus,
    windowNumber
  ) => {
    try {
      // ... ваш код для обновления статуса талона ...

      // Воспроизводим аудио рингтона
      audioRef.current.play();

      // Выполняем озвучку талона и окна только если статус стал "in service"
      if (newStatus === "in service") {
        setIsTalonCalled(true); // Устанавливаем флаг, когда талон вызвали
        setIsAudioPlayed(false); // Сбрасываем флаг, чтобы аудио могло быть воспроизведено

        // Выполняем озвучку талона и окна
        speakTalonAndWindow(talonId, windowNumber);
      } else {
        setIsTalonCalled(false); // Сбрасываем флаг, если статус не "in service"
      }
    } catch (error) {
      console.error("Error updating talon status:", error);
    }
  };

  useEffect(() => {
    const latestTalon = talons[talons.length - 1];

    if (latestTalon && latestTalon.status === "in service" && !isTalonCalled) {
      setIsTalonCalled(true); // Устанавливаем флаг, когда талон вызвали
      setIsAudioPlayed(false); // Сбрасываем флаг, чтобы аудио могло быть воспроизведено в следующий раз

      // Выполняем озвучку талона и окна
      speakTalonAndWindow(latestTalon.token, latestTalon.window);
    } else if (latestTalon && latestTalon.status !== "in service") {
      setIsTalonCalled(false); // Сбрасываем флаг, если статус не "in service"
    }

    // Воспроизводим аудио только если талон вызвали и аудио не воспроизводилось ранее
    if (isTalonCalled && !isAudioPlayed) {
      audioRef.current.play();
      setIsAudioPlayed(true); // Устанавливаем флаг, когда аудио проиграно
    }
  }, [talons]);

  // ... (ваш код после этого момента остаются без изменений) ...

  useEffect(() => {
    if (newTalonSound) {
      audioRef.current.play();

      setNewTalonSound(false); // После проигрывания аудио, сразу же установите newTalonSound в false
      setIsAudioPlayed(true); // Устанавливаем флаг, когда аудио проиграно
    }
  }, [newTalonSound]);

  const fetchDataDebounced = debounce(async () => {
    try {
      await getTalons(id);
      const latestTalon = talons[talons.length - 1];
      if (
        latestTalon &&
        latestTalon.status === "in service" &&
        !isAudioPlayed
      ) {
        audioRef.current.play();
        setIsAudioPlayed(true); // Устанавливаем флаг, когда талон вызвали
      } else if (latestTalon && latestTalon.status !== "in service") {
        setIsAudioPlayed(false); // Сбрасываем флаг, если статус не "in service"
      }
      setNewTalon((prevValue) => prevValue + 1);
    } catch (error) {
      console.error("Error fetching talons:", error);
    }
  }, 3000);

  //   Вывод Рекламы
  useEffect(() => {
    tabloStore.getState().getAds();
  }, []);

  // Используем состояния для хранения текущей даты и времени
  const [currentDate, setCurrentDate] = useState(new Date());

  const updateDateTime = () => {
    setCurrentDate(new Date());
  };

  useEffect(() => {
    const intervalId = setInterval(changeAd, 15000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(updateDateTime, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Функция для добавления ведущего нуля, если число меньше 10
  const addLeadingZero = (number) => (number < 10 ? `0${number}` : number);

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  const formattedDate = `${addLeadingZero(day)}.${addLeadingZero(
    month
  )}.${year}`;
  const formattedTime = `${addLeadingZero(hours)}:${addLeadingZero(
    minutes
  )}:${addLeadingZero(seconds)}`;

  const changeAd = () => {
    setIsAdLoaded(false); // Reset the isAdLoaded state to false before changing the ad
    setCurrentAdIndex((prevIndex) =>
      prevIndex === ads.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    fetchDataDebounced();

    const intervalId = setInterval(fetchDataDebounced, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [id, talons, ads]);

  return (
    <div className={style.mainSection}>
      <div className={style.header}>
        <img className={style.header__logo} src={logo} alt="logo" />

        {ads.length > 0 && (
          <img
            onLoad={() => {
              if (currentAdIndex === ads.length - 1) {
                setCurrentAdIndex(0); // Reset to 0 after last image is loaded
              }
            }}
            className={style.header__ads}
            src={`${API}/${ads[currentAdIndex]?.image}`}
            alt={ads[currentAdIndex]?.title}
          />
        )}

        <div className={style.header__date}>
          <div className={style.header__calendar}>
            <CalendarOutlined style={{ color: "#fff", fontSize: "25px" }} />
            <p>{formattedDate}</p>
          </div>
          <div className={style.header__time}>
            <ClockCircleOutlined style={{ color: "#fff", fontSize: "25px" }} />
            <p>{formattedTime}</p>
          </div>
        </div>
      </div>
      <audio preload="auto" ref={audioRef}>
        <source src={audio} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      {/* Таблица */}
      <div className={style.table}>
        <div className={style.table__header}>
          {columns.map((column) => (
            <p className={style.column} key={column.dataIndex}>
              {column.title}
            </p>
          ))}
        </div>

        <table>
          <tbody>
            {/* Фильтруем элементы по статусу и рендерим только те, у которых статус не "canceled" */}
            {talons
              .filter((item) => item.status !== "canceled")
              .map((item) => (
                <tr key={item.id}>
                  {columns.map((column) => (
                    <td
                      key={column.dataIndex}
                      className={`${style.dataIndex} ${
                        (column.dataIndex === "status",
                        "token" && item.status === "in service"
                          ? style.completed
                          : "")
                      }`}>
                      {column.dataIndex === "status"
                        ? column.render(item[column.dataIndex])
                        : item[column.dataIndex]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className={style.ticker}>
        <Ticker />
      </div>
    </div>
  );
};
