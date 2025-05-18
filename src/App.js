import React, { useState, useEffect } from 'react';

const suggestedGoals = ['Public Speaking', 'Reading', 'Coding', 'Fitness', 'Meditation'];

function App() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showLifeTimer, setShowLifeTimer] = useState(false);

  const [countdownInput, setCountdownInput] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [remainingTime, setRemainingTime] = useState(null);
  const [birthTime] = useState(new Date("2000-01-01T00:00:00")); // replace with real DOB if needed
  const [lifeTime, setLifeTime] = useState('');

  const dummyUser = {
    firstName: 'ABC',
    lastName: 'ABC',
    email: 'abc@example.com',
  };

  // --- GOALS LOGIC ---
  const addGoal = (goalName) => {
    if (!goalName.trim()) return;
    const exists = goals.find(g => g.name.toLowerCase() === goalName.toLowerCase());
    if (!exists) {
      setGoals([...goals, { name: goalName, level: 1, tasksCompleted: 0, lastActive: new Date() }]);
      setNewGoal('');
    }
  };

  const completeTask = (index) => {
    const updated = [...goals];
    const goal = updated[index];
    goal.tasksCompleted++;
    goal.lastActive = new Date();

    const neededTasks = 4 + goal.level;
    if (goal.tasksCompleted >= neededTasks) {
      goal.level++;
      goal.tasksCompleted = 0;
    }

    setGoals(updated);
  };

  const handleDecay = () => {
    const now = new Date();
    const updated = goals.map(goal => {
      const diff = Math.floor((now - new Date(goal.lastActive)) / (1000 * 60 * 60 * 24));
      let newLevel = goal.level;
      if (diff >= 30) newLevel -= 3;
      else if (diff >= 14) newLevel -= 2;
      else if (diff >= 7) newLevel -= 1;

      return { ...goal, level: Math.max(1, newLevel) };
    });

    setGoals(updated);
  };

  // --- COUNTDOWN TIMER LOGIC ---
  const startCountdown = () => {
    const total =
      countdownInput.hours * 3600 +
      countdownInput.minutes * 60 +
      countdownInput.seconds;
    if (total > 0) setRemainingTime(total);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (remainingTime && remainingTime > 0) {
        setRemainingTime(prev => prev - 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingTime]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  // --- LIFE TIMER LOGIC ---
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now - birthTime) / 1000);
      const years = Math.floor(diff / (60 * 60 * 24 * 365));
      const days = Math.floor((diff % (60 * 60 * 24 * 365)) / (60 * 60 * 24));
      const hrs = Math.floor((diff % (60 * 60 * 24)) / 3600);
      const mins = Math.floor((diff % 3600) / 60);
      const secs = diff % 60;
      setLifeTime(`${years}y ${days}d ${hrs}h ${mins}m ${secs}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [birthTime]);

  useEffect(() => {
    const interval = setInterval(handleDecay, 60 * 1000);
    return () => clearInterval(interval);
  }, [goals]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 relative">
        <h1 className="text-3xl font-bold text-purple-700">🚀 Leveling</h1>
        <div className="flex items-center gap-2">
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            onClick={() => setShowProfile(!showProfile)}
          >
            {showProfile ? 'Hide Profile' : 'View Profile'}
          </button>
          <button
            onClick={() => setShowMenu(prev => !prev)}
            className="p-2 rounded border border-gray-300 hover:bg-gray-200"
          >
            ☰
          </button>
          {showMenu && (
            <div className="absolute right-0 top-14 w-48 bg-white border rounded shadow-lg z-10">
              <ul className="text-gray-800 text-sm">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">📢 Newsfeed</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">🧑‍🤝‍🧑 People You Follow</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">⚙️ Settings</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">💬 Messaging</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">🤖 Bot</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* PROFILE */}
      {showProfile && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">👤 Profile</h2>
          <p><strong>Name:</strong> {dummyUser.firstName} {dummyUser.lastName}</p>
          <p><strong>Email:</strong> {dummyUser.email}</p>
          <h3 className="mt-4 text-lg font-medium">Skills & Levels:</h3>
          <ul className="list-disc list-inside">
            {goals.length === 0 && <li>No goals added yet</li>}
            {goals.map((g, idx) => (
              <li key={idx}>{g.name}: Level {g.level}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ADD GOALS */}
      <div className="mb-4 flex gap-2">
        <input
          className="p-2 border border-gray-400 rounded flex-grow"
          placeholder="Add a new goal..."
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => addGoal(newGoal)}
        >
          Add
        </button>
      </div>

      {/* SUGGESTED GOALS */}
      <div className="text-sm text-gray-600 mb-2">
        Suggestions: {suggestedGoals.join(', ')}
      </div>

      {/* GOALS LIST */}
      <div className="grid gap-4">
        {goals.map((goal, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{goal.name}</h2>
            <p>Level: {goal.level}</p>
            <p>Tasks Completed: {goal.tasksCompleted} / {4 + goal.level}</p>
            <button
              onClick={() => completeTask(index)}
              className="mt-2 bg-green-500 text-white px-4 py-1 rounded"
            >
              Complete Task
            </button>
          </div>
        ))}
      </div>

      {/* ⏳ Life Since Birth Widget */}
      <div className="fixed bottom-6 left-6 z-50">
        {showLifeTimer ? (
          <div className="w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-purple-700">⏳ Since You Were Born</span>
              <button onClick={() => setShowLifeTimer(false)} className="text-sm text-gray-500 hover:text-red-500">–</button>
            </div>
            <p className="text-sm">{lifeTime}</p>
          </div>
        ) : (
          <button
            onClick={() => setShowLifeTimer(true)}
            className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-700"
          >
            ⏳ Life Timer
          </button>
        )}
      </div>

      {/* 🕒 Countdown Timer Widget */}
      <div className="fixed bottom-6 left-80 z-50">
        {showCountdown ? (
          <div className="w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-purple-700">🕒 Timer</span>
              <button onClick={() => setShowCountdown(false)} className="text-sm text-gray-500 hover:text-red-500">–</button>
            </div>
            <div className="flex gap-2 mb-2 text-sm">
              <input
                type="number"
                placeholder="Hrs"
                className="w-1/3 p-1 border rounded"
                onChange={(e) => setCountdownInput({ ...countdownInput, hours: +e.target.value })}
              />
              <input
                type="number"
                placeholder="Min"
                className="w-1/3 p-1 border rounded"
                onChange={(e) => setCountdownInput({ ...countdownInput, minutes: +e.target.value })}
              />
              <input
                type="number"
                placeholder="Sec"
                className="w-1/3 p-1 border rounded"
                onChange={(e) => setCountdownInput({ ...countdownInput, seconds: +e.target.value })}
              />
            </div>
            <button onClick={startCountdown} className="w-full bg-blue-600 text-white rounded py-1 text-sm">
              Start
            </button>
            {remainingTime !== null && (
              <p className="mt-2 text-center text-sm">{formatTime(remainingTime)}</p>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowCountdown(true)}
            className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-700"
          >
            🕒 Timer
          </button>
        )}
      </div>

      {/* 💬 AI Assistant Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {showAssistant ? (
          <div className="w-72 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-purple-700">🤖 Your Assistant</span>
              <button onClick={() => setShowAssistant(false)} className="text-sm text-gray-500 hover:text-red-500">–</button>
            </div>
            <textarea
              rows="4"
              placeholder="Ask me anything..."
              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none"
            />
            <button className="mt-2 bg-purple-600 text-white px-3 py-1 rounded text-sm w-full">
              Send
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAssistant(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg text-sm hover:bg-purple-700"
          >
            💬 Need any help?
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
