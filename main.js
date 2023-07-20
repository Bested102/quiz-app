// Variables

let time = 10
let questionCount = 8;
let questionsPassed = 0;
let questions = getData();
let question = document.querySelector("h2.question");
let choices = document.querySelectorAll("section label p");
let next = document.querySelector("button.next");
let timer = document.querySelector("header .time");
let labels = document.querySelectorAll("section label");
let inputs = document.querySelectorAll("section label input");
let current = document.querySelector("header .done");
let total = document.querySelector("header .total");
let result = document.querySelector(".result .circle")
let correctCount = 0;

// Events

nextEvent();

next.onclick = () => {
  if (next.classList.contains("active")) nextEvent();
};

inputs.forEach((e) => {
  e.onchange = () => {
    setEffects(e.parentElement);
  };
});

setInterval(() => {
  if (!next.classList.contains("active")) {
    if (timer.innerHTML > 0) {
      timer.innerHTML--;
      if (timer.innerHTML == 0) {
        setEffects();
      }
    }
  }
}, 1000);

total.innerHTML = questionCount;

// Functions

async function* getData() {
  let req = await fetch("questions.json");
  let reqData = await req.json();
  let questions = [];
  for (i = 0; i < questionCount; i++) {
    let index = Math.floor(Math.random() * reqData.length);
    questions.push(reqData[index]);
    reqData.splice(index, 1);
  }
  yield* questions;
}

function nextEvent() {
  questions.next().then((data) => {
    if (data.done) {
      showResult();
    } else {
      resetEffects();

      printQuestion(data.value);

      current.innerHTML = +current.innerHTML + 1;

      if (current.innerHTML == questionCount) {
        next.innerHTML = "Get Result!";
      }
    }
  });
}

function printQuestion(data) {
  question.textContent = data.title;
  shuffle([...choices]).forEach((e, i) => {
    e.textContent = data.answers[i];
    if (data.answers[i] === data.right_answer) e.parentElement.id = "correct";
  });
}

function showResult() {
  document.querySelector("main").style.display = "none";
  document.querySelector(".result").style.display = "grid";

  document.querySelector(".result .got").textContent = correctCount;
  document.querySelector(".result .all").textContent = questionCount;

  let percentage = Math.round(correctCount / questionCount * 100)

  if (percentage <= 25) {
    result.classList.add("bad");
  } else if (percentage <= 75) {
    result.classList.add("decent");
  } else {
    result.classList.add("good");
  }
}

function setEffects(choice) {
  labels.forEach((e, i) => {
    e.style.opacity = 0.5;
    if (e.id == "correct") {
      e.classList.add("right");
    }
    inputs[i].setAttribute("disabled", "");
  });

  next.classList.add("active");
  if (choice) {
    if (choice.id !== "correct") {
      choice.classList.add("wrong");
    } else {
      ++correctCount;
    }
  }
}

function resetEffects() {
  labels.forEach((e, i) => {
    e.style.opacity = 1;
    e.classList.remove("wrong");
    e.classList.remove("right");
    e.id = "";
    inputs[i].removeAttribute("disabled");
    inputs[i].checked = false;
  });
  timer.innerHTML = time;
  next.classList.remove("active");
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}
