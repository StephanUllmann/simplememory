"use strict";

const fileSet = new Set();
let fileArray = [];
let randomizedArr = [];
const pairsIndexes = {};

let clickCount = 0;
let cardsClicked = [];

// Fetch Elements from DOM
const inputElement = document.getElementById("input");
const overlay = document.querySelector(".overlay");
const inputEl = document.querySelector(".fileinput");
const containerEL = document.getElementById("container");
let memoCard = document.querySelectorAll(".memorycard");
const memoCardInner = document.querySelectorAll(".memorycard-inner");
const continueEl = document.getElementById("continue");
const shuffleEl = document.getElementById("shuffle");
// Players
const playerContainer = document.querySelector(".player-container");
let numPlayers = 1;
let activePlayer = 0;
let playersScore;
let players;

// Setting up initial state
const resetPlayers = function () {
  playerContainer.innerHTML = "";
  numPlayers = Number(prompt("Wieviele Spieler?"));
  if (numPlayers > 0 && numPlayers < 7) {
    playersScore = new Array(numPlayers).fill(0);
    for (let i = 0; i < playersScore.length; i++) {
      const html = `
    <div class="player" id="player${i}">
    <p class="player-name" id="name${i}">Player ${i + 1}</p>
    <p class="counter"><span id="score${i}">0</span> Punkte</p>
    </div>`;
      playerContainer.insertAdjacentHTML("beforeend", html);
    }

    players = document.querySelectorAll(".player");
    let player0 = document.getElementById("player0");
    player0.classList.add("player-active");
    console.log(player0);
    players.forEach(function (player, index) {
      if (index > 0) player.classList.remove("player-active");
      document.getElementById(`score${index}`).textContent =
        playersScore[`${index}`];
      document.getElementById(`name${index}`).textContent = prompt(
        `Spieler ${index + 1} - Wie heißt du?`
      );
    });

    clickCard();
  } else {
    alert("1-6 Spieler möglich");
    resetPlayers();
  }
};

const displayCards = function () {
  let plainFileNames = randomizedArr.map((filename) => filename.slice(0, -1));
  console.log(plainFileNames);

  plainFileNames.forEach(function (filename, ind) {
    const html = `
    <div class="memorycard" id="memocard-${ind}">
    <div class="memorycard-inner">
      <div class="memorycard-front">
        <img class="frontpic" src="./lib/cardfront.png" alt="cardfront${
          ind + 1
        }front" />
      </div>
      <div class="memorycard-back">
        <img
          class="memopic"
          id="pic${ind + 1}"
          src="./pics/${filename}"
          alt="memocard${ind + 1}back"
        />
      </div>
    </div>
  </div>`;
    containerEL.insertAdjacentHTML("beforeend", html);
  });
  memoCard = document.querySelectorAll(".memorycard");
  console.log(memoCard);

  for (let i = 0; i < plainFileNames.length; i++) {
    document.getElementById(`pic${i + 1}`).src = `./pics/${plainFileNames[i]}`;
    // Building Pairs Object
    for (let [pairInd, pairName] of plainFileNames.entries()) {
      if (i !== pairInd && plainFileNames[i] === pairName)
        pairsIndexes[i] = pairInd;
    }
  }
  console.log(pairsIndexes);
  resetPlayers();
};

const randomizeArr = function () {
  randomizedArr = [...fileArray];
  for (let i = randomizedArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomizedArr[i], randomizedArr[j]] = [randomizedArr[j], randomizedArr[i]];
  }
  console.log(randomizedArr);
  displayCards();
};

const fillArray = function () {
  for (const filename of fileSet) {
    fileArray.push(`${filename}A`);
    fileArray.push(`${filename}B`);
  }
  randomizeArr();
};

const handleFiles = function () {
  containerEL.innerHTML = "";
  overlay.classList.toggle("hidden");
  inputEl.classList.toggle("hidden");
  //   Save file names in set
  const fileList = this.files;
  for (const file of fileList) fileSet.add(file.name);
  fillArray();
};

inputElement.addEventListener("change", handleFiles, false);

// Initial State finished
// let playersArr = [0, 1];
// let activePlayer = 0;
// let playing = false;
// let clickCount = 0;
// let cardsClicked = [];

//// Game Logic

const changePlayer = function () {
  document
    .getElementById(`player${activePlayer}`)
    .classList.toggle("player-active");
  if (activePlayer < playersScore.length - 1) activePlayer++;
  else activePlayer = 0;
  document
    .getElementById(`player${activePlayer}`)
    .classList.toggle("player-active");
};

const continueGame = function () {
  if (clickCount === 2) {
    if (pairsIndexes[cardsClicked[0]] === cardsClicked[1]) {
      memoCard[cardsClicked[0]].classList.add("invisible");
      memoCard[cardsClicked[1]].classList.add("invisible");
      clickCount = 0;
      cardsClicked = [];
    } else {
      memoCard[cardsClicked[0]].classList.toggle("click");
      memoCard[cardsClicked[1]].classList.toggle("click");
      clickCount = 0;
      cardsClicked = [];
      changePlayer();
    }
  }
};

// document.querySelector(".container").addEventListener("click", continueGame);
continueEl.addEventListener("click", continueGame);
document.addEventListener("keydown", function (event) {
  if (event.code === "Space") continueGame();
});

const checkCards = function () {
  if (pairsIndexes[cardsClicked[0]] === cardsClicked[1]) {
    playersScore[`${activePlayer}`]++;
    document.getElementById(`score${activePlayer}`).textContent =
      playersScore[`${activePlayer}`];
  }
};

// Flipping Cards on click
const flipCard = function (i) {
  if (!cardsClicked.includes(i) && clickCount < 2) {
    clickCount++;
    memoCard[i].classList.toggle("click");
    // console.log(memoCard[1]);
    cardsClicked.push(i);
    console.log(cardsClicked);
    if (clickCount === 2) checkCards();
  }
};

const clickCard = function () {
  for (let i = 0; i < memoCard.length; i++) {
    memoCard[i].addEventListener("click", function () {
      flipCard(i);
    });
  }
};

// Shuffle same cards again

shuffleEl.addEventListener("click", function () {
  cardsClicked = [];
  clickCount = 0;
  containerEL.innerHTML = "";
  randomizeArr();
});
