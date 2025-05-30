import React, { useEffect, useState } from "react";

const hours = [
  "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00", "21:00", "22:00"
];

function getWeekDates(startDate = new Date()) {
  // 取得本週一到日的日期字串
  const result = [];
  const monday = new Date(startDate);
  monday.setDate(startDate.getDate() - startDate.getDay() + 1);
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    result.push(d.toISOString().slice(0, 10));
  }
  return result;
}

export default function TimeTable() {
  const [reservations, setReservations] = useState([]);
  const [weekDates, setWeekDates] = useState(getWeekDates());

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}`)
      .then(res => res.json())
      .then(data => setReservations(data));
  }, []);

  // 整理成 { "2025-05-31-09:00": true }
  const reservedMap = {};
  reservations.forEach(r => {
    reservedMap[`${r.date}-${r.time}`] = true;
  });

  return (
    <table border="1">
      <thead>
        <tr>
          <th>時間 / 日期</th>
          {weekDates.map(date => (
            <th key={date}>{date}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {hours.map(hour => (
          <tr key={hour}>
            <td>{hour}</td>
            {weekDates.map(date => (
              <td
                key={date + hour}
                style={{
                  background: reservedMap[`${date}-${hour}`] ? "#7fd97f" : "#fff"
                }}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}