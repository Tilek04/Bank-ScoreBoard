import React, { useEffect, useState } from "react";
import style from "../styles/Tablo.module.scss";
import logo from "../assets/LOGO.png";
import ads from "../assets/ads.png";
import { ClockCircleOutlined, CalendarOutlined } from "@ant-design/icons";

import { Table, Divider } from "antd";
import { Ticker } from "../components/Ticker/Ticker";
const columns = [
  {
    title: "Талон",
    dataIndex: "name",
    
  },
  {
    title: "Этаж",
    dataIndex: "age",
  },
  {
    title: "Кабинет",
    dataIndex: "address",
  },
  {
    title: "Окно",
    dataIndex: "address",
  },
  {
    title: "Статус",
    dataIndex: "address",
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
  },
];

export const Tablo = () => {
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
      {/* Таблица */}
      <div className={style.table}>
  <div className={style.table__header}>
  {columns.map((column) => (
                <p className={style.column} key={column.dataIndex}>{column.title}</p>
              ))}
  </div>
<table>
<tbody>
            {data.map((item) => (
              <tr key={item.key}>
                {columns.map((column) => (
                  <td key={column.dataIndex}>{item[column.dataIndex]}</td>
                ))}
              </tr>
            ))}
          </tbody>
</table>
      
      </div>

<Ticker/>

    </div>
  );
};
