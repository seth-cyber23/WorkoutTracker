const workoutPlans = {
  "Upper A": [
    "Incline Bench Press",
    "Lat Pulldown",
    "Cable Row",
    "Shoulder Press",
    "Lateral Raise",
    "Preacher Curl",
    "Tricep Pushdown"
  ],
  "Upper B": [
    "Chest Fly",
    "Assisted Pull-up",
    "Cable Row",
    "Shoulder Press",
    "Lateral Raise",
    "Preacher Curl",
    "Tricep Pushdown"
  ],
  "Legs": [
    "Leg Press",
    "RDL",
    "Leg Curl",
    "Leg Extension",
    "Calf Raises"
  ]
};

let data = JSON.parse(localStorage.getItem("eliteData")) || {
  streak: 0,
  lastWorkout: null,
  history: [],
  prs: {}
};

function saveData() {
  localStorage.setItem("eliteData", JSON.stringify(data));
}

function updateStreak() {
  const today = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (data.lastWorkout === yesterday.toDateString()) {
    data.streak++;
  } else if (data.lastWorkout !== today) {
    data.streak = 1;
  }

  data.lastWorkout = today;
  document.getElementById("streak").innerText = data.streak;
  saveData();
}

document.getElementById("streak").innerText = data.streak;

function startWorkout() {
  const type = document.getElementById("workoutType").value;
  const area = document.getElementById("workoutArea");
  area.innerHTML = "";
  area.classList.remove("hidden");

  if (type === "Cardio") {
    area.innerHTML = `
      <div class="card">
        <h3>Cardio</h3>
        Duration (minutes):
        <input type="number" id="cardioTime">
        <button onclick="finishWorkout('Cardio')">Complete</button>
      </div>
    `;
    return;
  }

  if (type === "Mobility") {
    area.innerHTML = `
      <div class="card">
        <h3>Mobility Session</h3>
        <button onclick="finishWorkout('Mobility')">Complete Mobility</button>
      </div>
    `;
    return;
  }

  workoutPlans[type].forEach(exercise => {
    area.innerHTML += `
      <div class="card">
        <h3>${exercise}</h3>
        Weight <input type="number" id="${exercise}-w">
        Reps <input type="number" id="${exercise}-r">
      </div>
    `;
  });

  area.innerHTML += `<button onclick="finishWorkout('${type}')">Finish Workout</button>`;
}

function finishWorkout(type) {
  const today = new Date().toDateString();

  if (type === "Cardio") {
    const duration = document.getElementById("cardioTime").value;
    data.history.push({ type, date: today, duration });
  } else if (type === "Mobility") {
    data.history.push({ type, date: today });
  } else {
    workoutPlans[type].forEach(exercise => {
      const weight = document.getElementById(`${exercise}-w`)?.value;
      const reps = document.getElementById(`${exercise}-r`)?.value;

      if (weight) {
        if (!data.prs[exercise] || weight > data.prs[exercise]) {
          data.prs[exercise] = weight;
        }
      }

      data.history.push({
        type,
        exercise,
        weight,
        reps,
        date: today
      });
    });
  }

  updateStreak();
  updateWeeklyStats();
  renderHistory();
  saveData();
  document.getElementById("workoutArea").classList.add("hidden");
}

function renderHistory() {
  const list = document.getElementById("history");
  list.innerHTML = "";
  data.history.slice().reverse().forEach(entry => {
    list.innerHTML += `<li>${entry.type} - ${entry.date}</li>`;
  });
}

function updateWeeklyStats() {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const weeklyWorkouts = data.history.filter(entry =>
    new Date(entry.date) > weekAgo
  );

  const percent = Math.min((weeklyWorkouts.length / 5) * 100, 100);
  document.getElementById("weeklyStats").innerText =
    percent.toFixed(0) + "%";
}

renderHistory();
updateWeeklyStats();
