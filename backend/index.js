const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Подключаем middlewares
app.use(cors());
app.use(express.json());

// Временная "база" в памяти
const users = {};

// Роут для сохранения пользователя
app.post("/user", (req, res) => {
  const { id, first_name, username } = req.body;

  if (!users[id]) {
    users[id] = {
      id,
      first_name,
      username,
      balance: 100, // стартовый баланс
    };
  }

  res.json(users[id]);
});

// Роут для получения пользователя
app.get("/user/:id", (req, res) => {
  const id = req.params.id;
  if (users[id]) {
    res.json(users[id]);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// 🚀 ВОТ ЗДЕСЬ app.listen — запуск сервера
app.listen(PORT, () => {
  console.log(`Backend запущен на http://localhost:${PORT}`);
});
