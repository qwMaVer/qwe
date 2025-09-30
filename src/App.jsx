import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const prizes = [
    "🎁 50⭐ бонус",
    "🎉 Стикер Telegram",
    "🌟 NFT приз",
    "😢 Пусто",
    "🔥 Редкий NFT",
  ];

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

  // 🎰 Крутка рулетки
  const spinWheel = () => {
    if (!user || user.balance < 10 || spinning) {
      alert("Недостаточно ⭐ или колесо уже крутится");
      return;
    }

    setUser((prev) => ({ ...prev, balance: prev.balance - 10 }));

    const randomIndex = Math.floor(Math.random() * prizes.length);
    const segmentAngle = 360 / prizes.length;

    const finalRotation =
      rotation + 360 * 5 + (360 - randomIndex * segmentAngle - segmentAngle / 2);

    setRotation(finalRotation);
    setSpinning(true);

    setTimeout(() => {
      setSpinning(false);
      setResult(prizes[randomIndex]);

      fetch("http://localhost:3000/user/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
        });
    }, 5000);
  };

  // 💰 Пополнение баланса
  const addBalance = () => {
    fetch("http://localhost:3000/user/addBalance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, amount: 50 }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
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
        className="text-3xl font-bold mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        🎰 Telegram MiniApp: Кастомная рулетка
      </motion.h1>

      {user ? (
        <div className="flex flex-col items-center">
          <p className="mb-2 text-lg">👤 {user.first_name}</p>
          <p className="mb-4 text-xl">💰 Баланс: {user.balance} ⭐</p>

          {/* Стрелка */}
          <div className="relative mb-[-20px] z-10">
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-yellow-400"></div>
          </div>

          {/* Колесо */}
          <motion.div
            className="relative rounded-full border-8 border-white shadow-2xl"
            style={{
              width: 300,
              height: 300,
              background: `conic-gradient(
                #FF6B6B 0deg ${360 / prizes.length}deg,
                #FFD93D ${360 / prizes.length}deg ${(360 / prizes.length) * 2}deg,
                #6BCB77 ${(360 / prizes.length) * 2}deg ${(360 / prizes.length) * 3}deg,
                #4D96FF ${(360 / prizes.length) * 3}deg ${(360 / prizes.length) * 4}deg,
                #9D4EDD ${(360 / prizes.length) * 4}deg 360deg
              )`,
            }}
            animate={{ rotate: rotation }}
            transition={{ duration: 5, ease: "easeOut" }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-2xl font-bold text-white drop-shadow-lg">🎡</p>
            </div>
          </motion.div>

          {/* 🎲 Крутка */}
          <motion.button
            onClick={spinWheel}
            className="mt-8 px-6 py-3 bg-gradient-to-r from-pink-500 to-yellow-400 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform"
            whileTap={{ scale: 0.9 }}
            disabled={user.balance < 10 || spinning}
          >
            🎲 Крутить рулетку (10⭐)
          </motion.button>

          {/* 💰 Пополнение */}
          <motion.button
            onClick={addBalance}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-400 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform"
            whileTap={{ scale: 0.9 }}
          >
            ➕ Пополнить баланс (+50⭐)
          </motion.button>

          {result && (
            <motion.div
              className="mt-6 text-2xl font-semibold text-yellow-300 drop-shadow-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              🎯 Результат: {result}
            </motion.div>
          )}
        </div>
      ) : (
        <p>Открой MiniApp в Telegram, чтобы увидеть свои данные</p>
      )}
    </div>
  );
}

export default App;
