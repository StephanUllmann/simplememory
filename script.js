"use strict";

// Global Variables
const fileSet = new Set();
let fileArray = [];
let randomizedArr = [];
const pairsIndexes = {};

let clickCount = 0;
let cardsClicked = [];

// Fetch Elements
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

const displayCards = function (array) {
  array.forEach(function (file, ind) {
    const html = `
    <div class="memorycard" id="memocard-${ind}">
    <div class="memorycard-inner">
      <div class="memorycard-front">
        <img class="frontpic" src="./lib/cardfront.png" alt="cardfront${
          ind + 1
        }front" id="${ind}"/>
      </div>
      <div class="memorycard-back">
        <img
          class="memopic"
          id="pic${ind + 1}"
          src="${file}"
          alt="memocard${ind + 1}back"
        />
      </div>
    </div>
  </div>`;
    containerEL.insertAdjacentHTML("beforeend", html);
  });
  memoCard = document.querySelectorAll(".memorycard");

  for (let i = 0; i < array.length; i++) {
    document.getElementById(`pic${i + 1}`).src = `${array[i]}`;
    // Building Pairs Object
    for (let [pairInd, pairName] of array.entries()) {
      if (i !== pairInd && array[i] === pairName) pairsIndexes[i] = pairInd;
    }
  }
  resetPlayers();
};

const randomizeArr = function (array) {
  randomizedArr = [...array];
  for (let i = randomizedArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomizedArr[i], randomizedArr[j]] = [randomizedArr[j], randomizedArr[i]];
  }
  displayCards(randomizedArr);
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
  console.log(fileList);
  for (const file of fileList) fileSet.add(URL.createObjectURL(file));
  fileArray = [...fileSet, ...fileSet];
  randomizeArr(fileArray);
};

inputElement.addEventListener("change", handleFiles, false);

// Initial State finished

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
  if (clickCount >= 2) {
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
const flipCard = function (cardID) {
  if (!cardsClicked.includes(cardID) && clickCount < 3) {
    memoCard[cardID].classList.toggle("click");
    cardsClicked.push(cardID);
    if (clickCount === 2) checkCards();
  }
};

const clickCard = function () {
  containerEL.addEventListener("click", function (e) {
    if (cardsClicked.length === 2) {
      continueGame();
    } else if (e.target.classList.contains("frontpic")) {
      clickCount++;
      flipCard(Number(e.target.getAttribute("id")));
    }
  });
};

// Shuffle same cards again

shuffleEl.addEventListener("click", function () {
  cardsClicked = [];
  clickCount = 0;
  containerEL.innerHTML = "";
  randomizeArr();
});
