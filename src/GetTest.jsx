// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { API } from './utils/utils';

// const GetTest = () => {
//   const [newTalon, setNewTalon] = useState(null);

//   const fetchNewTalon = async () => {
//     try {
//       const response = await axios.get(`${API}/talon`); // Замените на ваш URL для получения нового талона
//       setNewTalon(response.data);
//     } catch (error) {
//       console.error('Ошибка получения нового талона:', error);
//     }
//   };

//   useEffect(() => {
//     // Запрашиваем новый талон при монтировании компонента
//     fetchNewTalon();

//     // Устанавливаем интервал для периодического запроса нового талона
//     const intervalId = setInterval(fetchNewTalon, 5000); // Здесь устанавливается интервал, например, 5 секунд

//     // Очистка интервала при размонтировании компонента
//     return () => {
//       clearInterval(intervalId);
//     };
//   }, []);

//   console.log(newTalon);

//   // Визуализация полученного талона на табло
//   return (
//     <div>
//       {newTalon ? (
//         <div>
//           <h1>Новый талон:</h1>
//           <p>Номер: {newTalon.token}</p>
//           <p>Услуга: {newTalon.service}</p>
//           {/* Другие данные талона */}
//         </div>
//       ) : (
//         <p>Ожидание нового талона...</p>
//       )}
//     </div>
//   );
// };

// export default GetTest;
