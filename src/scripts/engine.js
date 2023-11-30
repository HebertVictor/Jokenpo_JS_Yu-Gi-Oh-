const state = {
  // Manipular DOM
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },

  cardSprites: {
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
    avatar: document.getElementById("card-image"),
  },

  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },

  playerSides: {
    player1: "player-cards",
    player1BOX: document.querySelector("#player-cards"),

    computer: "computer-cards",
    computerBOX: document.querySelector("#computer-cards"),
  },
  actions: { button: document.getElementById("next-duel") },
};

const pathImages = "./src/assets/icons/";

const playerSides = {
  player1: "player-cards",
  computer: "computer-cards",
};

const cardData = [
  // Cartas utilizadas e seus dados
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    Wins: [1, 4, 7],
    losesTo: [2, 5, 8],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    Wins: [2, 5, 8],
    losesTo: [0, 3, 6],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors ",
    img: `${pathImages}exodia.png`,
    Wins: [0, 3, 6],
    losesTo: [1, 4, 7],
  },
  {
    id: 3,
    name: "Magic Cylinder",
    type: "Paper",
    img: `${pathImages}cylinder.png`,
    Wins: [1, 4, 7],
    losesTo: [2, 5, 8],
  },
  {
    id: 4,
    name: "Pot of Greed",
    type: "Rock",
    img: `${pathImages}pot.png`,
    Wins: [2, 5, 8],
    losesTo: [0, 3, 6],
  },
  {
    id: 5,
    name: "Slifer the Sky Dragon",
    type: "Scissors ",
    img: `${pathImages}slifer.png`,
    Wins: [0, 3, 6],
    losesTo: [1, 4, 7],
  },
  {
    id: 6,
    name: "Toon World",
    type: "Paper",
    img: `${pathImages}toon.png`,
    Wins: [1, 4, 7],
    losesTo: [2, 5, 8],
  },
  {
    id: 7,
    name: "Monster Reborn",
    type: "Rock",
    img: `${pathImages}reborn.png`,
    Wins: [2, 5, 8],
    losesTo: [0, 3, 6],
  },
  {
    id: 8,
    name: "Polymerization",
    type: "Scissors ",
    img: `${pathImages}polymerization.png`,
    Wins: [0, 3, 6],
    losesTo: [1, 4, 7],
  },
];

async function getRandomCardId() {
  // Numero aleatorio para carta
  const randomIndex = Math.floor(Math.random() * cardData.length);

  return cardData[randomIndex].id;
}

async function getCardImage(IdCard, fieldSide) {
  // Fileira de Cartas
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", IdCard);
  cardImage.classList.add("card");

  if (fieldSide === playerSides.player1) {
    // Se carta do player adcionar listeners
    cardImage.classList.add("myCards");

    cardImage.addEventListener("mouseover", () => {
      drawSelectedCard(IdCard); //Apresentar carta para visão do player
      audioPlay("cardHover");
    });

    cardImage.addEventListener("click", () => {
      //Colocar carta em campo
      setCardsField(cardImage.getAttribute("data-id"));
    });
  }

  return cardImage;
}

async function removeAllCardsImages() {
  let { computerBOX, player1BOX } = state.playerSides;

  let imgElements = computerBOX.querySelectorAll("img"); //pegar todas as imagens entre as cartas do computador

  imgElements.forEach((img) => img.remove()); // remover cada imagem

  // player

  imgElements = player1BOX.querySelectorAll("img");

  imgElements.forEach((img) => img.remove());
}

async function checkDuelResults(dataID, computerCardId) {
  let duelResults = "draw"; //Estado neutro do resultado

  let playerCard = cardData[dataID];

  if (playerCard.Wins.includes(computerCardId)) {
    duelResults = "win";

    state.score.playerScore++;
  }
  if (playerCard.losesTo.includes(computerCardId)) {
    duelResults = "lose";
    state.score.computerScore++;
  }
  await audioPlay(duelResults);
  return duelResults;
}

async function drawButton(text) {
  state.actions.button.innerText = text.toUpperCase();
  state.actions.button.style.display = "block";
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore}
  | Lose: ${state.score.computerScore}`;
}

async function drawSelectedCard(index) {
  state.cardSprites.avatar.style.display = "block";

  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
}

async function setCardsField(dataID) {
  await removeAllCardsImages();

  let computerCardId = await getRandomCardId();

  await ShowHiddenCardFieldsImages(true);

  await drawCardsInfield(dataID, computerCardId);

  let duelResults = await checkDuelResults(dataID, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

async function drawCardsInfield(dataID, computerCardId) {
  state.fieldCards.player.src = cardData[dataID].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function ShowHiddenCardFieldsImages(value) {
  if (value === true) {
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
  } else {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
  }
}

async function drawCards(cardNumber, fieldSide) {
  state.cardSprites.avatar.style.display = "none";

  for (let i = 0; i < cardNumber; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await getCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.actions.button.style.display = "none";

  state.fieldCards.computer.style.display = "none";
  state.fieldCards.player.style.display = "none";

  state.cardSprites.name.innerText = "Selecione";
  state.cardSprites.type.innerText = "uma carta";

  start();
}

async function audioPlay(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);

  try {
    audio.play();
  } catch {}
}

async function playBackgroundMusic() {
  const bgm = document.getElementById("bgm");

  bgm.volume = 0.7;
  bgm.play();
}

function start() {
  ShowHiddenCardFieldsImages(false);

  drawCards(5, playerSides.player1);
  drawCards(5, playerSides.computer);

  playBackgroundMusic();
}

start();
