const currentScoreDiv = document.querySelector(".currentScore");
const highScoreDiv = document.querySelector(".highScore");
const resetButton = document.querySelector("#resetButton");
const tilesContainer = document.querySelector(".tiles");
const colors = [
  "aqua",
  "aquamarine",
  "crimson",
  "blue",
  "dodgerblue",
  "gold",
  "greenyellow",
  "teal",
];
const colorsPicklist = [...colors, ...colors];
const tileCount = colorsPicklist.length;

// Game state
let revealedCount = 0;
let activeTile = null;
let awaitingEndOfMove = false;
let currentScore = 0;
let highScore = 0;

currentScoreDiv.textContent = "Current Score = 0";
highScoreDiv.textContent = "High Score = 0";

// Check if highScore is already in local storage
if (localStorage.getItem("highScore")) {
  // If it is, retrieve it and store it in the highScore variable
  highScore = parseInt(localStorage.getItem("highScore"));
  highScoreDiv.textContent = `High Score = ${highScore}`;
}

//resetting the game
resetButton.addEventListener("click", resetGame);
function resetGame() {
  // Game state
  let revealedCount = 0;
  let activeTile = null;
  let awaitingEndOfMove = false;
  let currentScore = 0;
  let highScore = 0;

  // Reset tile colors
  const tiles = document.querySelectorAll(".tile");
  tiles.forEach((tile) => {
    tile.style.backgroundColor = null;
    tile.setAttribute("data-revealed", "false");
  });

  // Check if highScore is already in local storage
  if (localStorage.getItem("highScore")) {
    // If it is, retrieve it and store it in the highScore variable
    highScore = parseInt(localStorage.getItem("highScore"));
    highScoreDiv.textContent = `High Score = ${highScore}`;
    currentScoreDiv.textContent = "Current Score = 0";
    highScoreDiv.textContent = "High Score = 0";
  }
}

function startGame() {}
// Build Tile Function
function buildTile(color) {
  const element = document.createElement("div");

  element.classList.add("tile");
  element.setAttribute("data-color", color);
  element.setAttribute("data-revealed", "false");

  element.addEventListener("click", () => {
    const revealed = element.getAttribute("data-revealed");

    if (awaitingEndOfMove || revealed === "true" || element === activeTile) {
      return;
    }

    element.style.backgroundColor = color;

    if (!activeTile) {
      activeTile = element;

      return;
    }

    //check for a match
    const colorToMatch = activeTile.getAttribute("data-color");

    if (colorToMatch === color) {
      // Tiles match
      activeTile.setAttribute("data-revealed", "true");
      element.setAttribute("data-revealed", "true");
      awaitingEndOfMove = false;
      activeTile = null;
      revealedCount += 2;
      currentScore += 1;
      currentScoreDiv.textContent = `Current Score = ${currentScore}`;

      if (revealedCount === tileCount) {
        setTimeout(() => {
          alert("You win! Refresh to play again.");
        }, 500);
      }

      // Update the high score if the current score is higher
      if (currentScore < highScore) {
        highScore = currentScore;
        localStorage.setItem("highScore", highScore);
        highScoreDiv.textContent = `High Score = ${highScore}`;
      }

      return;
    }

    //incorrect pair
    awaitingEndOfMove = true;
    currentScore += 1;
    currentScoreDiv.textContent = `Current Score = ${currentScore}`;

    setTimeout(() => {
      element.style.backgroundColor = null;
      activeTile.style.backgroundColor = null;

      awaitingEndOfMove = false;
      activeTile = null;
    }, 1000);
  });
  return element;
}

// For loop to creat the tiles
for (let i = 0; i < tileCount; i++) {
  const randomIndex = Math.floor(Math.random() * colorsPicklist.length);
  const color = colorsPicklist[randomIndex];
  const tile = buildTile(color);

  colorsPicklist.splice(randomIndex, 1);
  tilesContainer.appendChild(tile);
}