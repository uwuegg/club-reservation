import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api/reservations";

function App() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [reservations, setReservations] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setReservations);
  }, []);

  useEffect(() => {
    setMyReservations(reservations.filter(r => r.name === name));
  }, [reservations, name]);

  const handleReserve = async (e) => {
    e.preventDefault();
    const ok = window.confirm(`確認預約：${date} ${startTime}-${endTime} 嗎？`);
    if (!ok) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, date, startTime, endTime })
      });
      if (!res.ok) {
        const err = await res.json();
        setMessage(err.error);
      } else {
        setMessage('預約成功！');
        setReservations(await (await fetch(API_URL)).json());
      }
    } catch {
      setMessage('預約失敗');
    }
  };

  const handleCancel = async (id) => {
    const ok = window.confirm('確定要取消這個預約嗎？');
    if (!ok) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (!res.ok) {
        const err = await res.json();
        setMessage(err.error);
      } else {
        setMessage('已取消');
        setReservations(await (await fetch(API_URL)).json());
      }
    } catch {
      setMessage('取消失敗');
    }
  };

  const timeOptions = [];
  for (let h = 8; h < 22; h++) {
    const hour = h.toString().padStart(2, '0');
    timeOptions.push(`${hour}:00`);
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>社辦預約系統</h1>
      <form onSubmit={handleReserve}>
        <input
          placeholder="請輸入姓名"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
        <select value={startTime} onChange={e => setStartTime(e.target.value)}>
          {timeOptions.map(t => <option key={t}>{t}</option>)}
        </select>
        <span>~</span>
        <select value={endTime} onChange={e => setEndTime(e.target.value)}>
          {timeOptions.slice(1).map(t => <option key={t}>{t}</option>)}
        </select>
        <button type="submit">預約</button>
      </form>
      <p style={{ color: "red" }}>{message}</p>

      <h2>我的預約</h2>
      <ul>
        {myReservations.map(r => (
          <li key={r.id}>
            {r.date} {r.startTime}-{r.endTime}
            <button onClick={() => handleCancel(r.id)}>取消</button>
          </li>
        ))}
      </ul>

      <h2>全部預約一覽</h2>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>姓名</th>
            <th>日期</th>
            <th>開始</th>
            <th>結束</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(r => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.date}</td>
              <td>{r.startTime}</td>
              <td>{r.endTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;