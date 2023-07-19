import React, { useEffect, useState } from 'react';
import style from '../styles/Tablo.module.scss';
import logo from '../assets/LOGO.png';
import ads from '../assets/ads.png';

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


  const formattedDate = `${addLeadingZero(day)}.${addLeadingZero(month)}.${year}`;
  const formattedTime = `${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;

  return (
    <div className={style.mainSection}>
      <div className={style.header}>
        <img className={style.header__logo} src={logo} alt="logo" />
        <img className={style.header__ads} src={ads} alt="ads" />
 <div className={style.header__date}>
 <p>{formattedDate}</p>
        <p>{formattedTime}</p>
 </div>
      </div>
    </div>
  );
};
