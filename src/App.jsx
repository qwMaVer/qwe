import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    const initData = tg.initDataUnsafe;

    if (initData?.user) {
      const u = initData.user;

      fetch("http://localhost:3000/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: u.id,
          first_name: u.first_name,
          username: u.username,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const spinWheel = () => {
    if (!user || user.balance < 10) {
      alert("Недостаточно ⭐ для крутки (10⭐)");
      return;
    }

    fetch("http://localhost:3000/user/spin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setResult(data.lastPrize);
      });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 text-white">
        <p className="text-2xl animate-pulse">Загрузка...</p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 text-white p-6">
      <motion.h1
        className="text-4xl font-bold mb-8 drop-shadow-lg"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        🎰 Telegram MiniApp: Рулетка
      </motion.h1>

      {user ? (
        <motion.div
          className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="mb-2"><b>ID:</b> {user.id}</p>
          <p className="mb-2"><b>Имя:</b> {user.first_name}</p>
          <p className="mb-4"><b>Баланс:</b> {user.balance} ⭐</p>

          <motion.button
            onClick={spinWheel}
            className="mt-4 px-8 py-4 bg-gradient-to-r from-pink-500 to-yellow-400 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform"
            whileTap={{ scale: 0.9 }}
          >
            🎲 Крутить рулетку (10⭐)
          </motion.button>

          {result && (
            <motion.div
              className="mt-6 text-2xl font-semibold text-yellow-300 drop-shadow-md"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              🎯 Результат: {result}
            </motion.div>
          )}
        </motion.div>
      ) : (
        <p>Открой MiniApp в Telegram, чтобы увидеть свои данные</p>
      )}
    </div>
  );
}

export default App;
