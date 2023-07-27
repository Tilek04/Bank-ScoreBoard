import React, { useEffect, useState } from "react";
import style from "../styles/Tablo.module.scss";
import logo from "../assets/LOGO.png";
import adsv from "../assets/ads.png";
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
    title: "Окно",
    dataIndex: "queue",
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
];

export const Tablo = () => {
  const { id } = useParams();
  const getTalons = tabloStore((state) => state.getTalons);
  const ads = tabloStore((state) => state.ads);
  const talons = tabloStore((state) => state.talons);
  const [newTalon, setNewTalon] = useState(0);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [newTalonSound, setNewTalonSound] = useState(false);
  const audioRef = useRef(null);

  const completedTalons = talons.filter((item) => item.status === "completed");
  const pendingTalons = talons.filter((item) => item.status !== "completed");

  const speakTalonStatus = (talonNumber, windowNumber) => {
    const message = `Талон номер ${talonNumber} подойдите к окну номер ${windowNumber}`;
    const utterance = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak(utterance);
  };

  //   Вывод Талонов и аудио
  useEffect(() => {
    const audioElement = new Audio(audio);
    audioRef.current = audioElement;
    fetchDataDebounced();

    const intervalId = setInterval(fetchDataDebounced, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [id, talons, ads]);

  const fetchDataDebounced = debounce(async () => {
    try {
      await getTalons(id);

      setNewTalon((prevValue) => prevValue + 1);
    } catch (error) {
      console.error("Error fetching talons:", error);
    }
  }, 3000);

  useEffect(() => {
    if (newTalon) {
      audioRef.current.play();
      setNewTalon(false);
    }
  }, [newTalonSound]);

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
  console.log("ads:", ads);
  console.log("currentAdIndex:", currentAdIndex);

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
