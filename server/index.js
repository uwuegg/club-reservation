import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

let reservations = [];

app.get('/api/reservations', (req, res) => {
  res.json(reservations);
});

app.post('/api/reservations', (req, res) => {
  const { name, date, startTime, endTime } = req.body;
  if (!name || !date || !startTime || !endTime) {
    return res.status(400).json({ error: '資料不完整' });
  }
  const overlap = reservations.some(r =>
    r.date === date &&
    !(
      endTime <= r.startTime || startTime >= r.endTime
    )
  );
  if (overlap) {
    return res.status(409).json({ error: '時段已被預約，請選擇其他時段' });
  }
  const newReservation = { id: Date.now().toString(), name, date, startTime, endTime };
  reservations.push(newReservation);
  res.json(newReservation);
});

app.delete('/api/reservations/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const idx = reservations.findIndex(r => r.id === id && r.name === name);
  if (idx === -1) return res.status(403).json({ error: '只能取消自己的預約' });
  reservations.splice(idx, 1);
  res.json({ success: true });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});