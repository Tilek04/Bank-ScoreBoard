import React, { useEffect, useState } from "react";
import style from "../styles/Tablo.module.scss";
import logo from "../assets/LOGO.png";
import ads from "../assets/ads.png";
import { ClockCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import { tabloStore } from "../Zustand/store";
import { Ticker } from "../components/Ticker/Ticker";
import audio from '../assets/audio.mp3'

const columns = [
  {
    title: "Талон",
    dataIndex: "token",
  },
  {
    title: "Этаж",
    dataIndex: "branch",
  },
  {
    title: "Кабинет",
    dataIndex: "id",
  },
  {
    title: "Окно",
    dataIndex: "queue",
  },
  {
    title: "Статус",
    dataIndex: "status",
  },
];

export const Tablo = () => {
  const getTalons = tabloStore((state) => state.getTalons);
  const talons = tabloStore((state) => state.talons);

  const completedTalons = talons.filter((item) => item.status === "completed");
  const pendingTalons = talons.filter((item) => item.status !== "completed");

  useEffect(() => {
    getTalons();
  }, []);

  // Используем состояния для хранения текущей даты и времени
  const [currentDate, setCurrentDate] = useState(new Date());

  const updateDateTime = () => {
    setCurrentDate(new Date());
  };

  useEffect(() => {
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
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

  return (
    <div className={style.mainSection}>
  
      <div className={style.header}>
        <img className={style.header__logo} src={logo} alt="logo" />
        <img className={style.header__ads} src={ads} alt="ads" />
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
      <audio preload="auto">
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
                        "token" && item.status === "completed"
                          ? style.completed
                          : "")
                      }`}>
                      {item[column.dataIndex]}
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
