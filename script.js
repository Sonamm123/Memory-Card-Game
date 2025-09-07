const gameBoard = document.getElementById("gameBoard");
const restartBtn = document.getElementById("restart");
const themeToggle = document.getElementById("themeToggle");
const modeToggle = document.getElementById("modeToggle");
const statusDiv = document.getElementById("status");

const modal = document.getElementById("winnerModal");
const winnerText = document.getElementById("winnerText");
const closeModal = document.getElementById("closeModal");

const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

let cards = [];
let flipped = [];
let currentPlayer = 1;
let scores = { 1: 0, 2: 0 };
let totalPairs = 8;
let mode = "2p"; // "2p" or "cpu"

// Emoji icons for cards
const icons = ["🍎","🍌","🍒","🍇","🍉","🍋","🍓","🍑"];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  gameBoard.innerHTML = "";
  const doubledIcons = shuffle([...icons, ...icons]);
  doubledIcons.forEach(icon => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.icon = icon;
    card.innerHTML = `<span>?</span>`;
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });
}

function flipCard() {
  if (flipped.length >= 2 || this.classList.contains("flipped")) return;
  this.classList.add("flipped");
  this.innerHTML = `<span>${this.dataset.icon}</span>`;
  flipped.push(this);

  if (flipped.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flipped;
  if (card1.dataset.icon === card2.dataset.icon) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    scores[currentPlayer]++;
    flipped = [];

    if (document.querySelectorAll(".matched").length === totalPairs * 2) {
      endGame();
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      card1.innerHTML = `<span>?</span>`;
      card2.innerHTML = `<span>?</span>`;
      flipped = [];
      switchPlayer();
    }, 1000);
  }
}

function switchPlayer() {
  if (mode === "2p") {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    statusDiv.textContent = `Player ${currentPlayer}'s Turn`;
  } else if (mode === "cpu") {
    if (currentPlayer === 1) {
      currentPlayer = 2;
      statusDiv.textContent = "CPU's Turn";
      setTimeout(cpuMove, 1000);
    } else {
      currentPlayer = 1;
      statusDiv.textContent = "Player 1's Turn";
    }
  }
}

function cpuMove() {
  const available = [...document.querySelectorAll(".card:not(.flipped):not(.matched)")];
  if (available.length < 2) return;

  const card1 = available[Math.floor(Math.random() * available.length)];
  card1.click();

  setTimeout(() => {
    const stillAvailable = [...document.querySelectorAll(".card:not(.flipped):not(.matched)")];
    if (stillAvailable.length > 0) {
      const card2 = stillAvailable[Math.floor(Math.random() * stillAvailable.length)];
      card2.click();
    }
  }, 800);
}

function endGame() {
  let winner;
  if (scores[1] > scores[2]) {
    winner = "🎉 Player 1 Wins!";
    winSound.play();
  } else if (scores[2] > scores[1]) {
    winner = mode === "cpu" ? "🤖 CPU Wins!" : "🎉 Player 2 Wins!";
    winSound.play();
  } else {
    winner = "🤝 It's a Draw!";
    drawSound.play();
  }
  winnerText.textContent = winner;
  modal.classList.remove("hidden");
}

restartBtn.addEventListener("click", () => {
  scores = { 1: 0, 2: 0 };
  currentPlayer = 1;
  mode = modeToggle.value;
  statusDiv.textContent = "Player 1's Turn";
  flipped = [];
  modal.classList.add("hidden");
  createBoard();
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

themeToggle.addEventListener("change", () => {
  document.body.className = themeToggle.value;
});

modeToggle.addEventListener("change", () => {
  mode = modeToggle.value;
  restartBtn.click(); // reset immediately when mode changes
});

// Initialize
createBoard();
