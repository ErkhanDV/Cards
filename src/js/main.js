var diller = [];
var player = [];
var deck = [];

document.addEventListener('DOMContentLoaded', function(evt) {
  start();

  let getCardButton = document.getElementById('get-card');
  getCardButton.addEventListener('click', function(evt) {
    addCard();
  });

  let endRoundButton = document.getElementById('end-round');
  endRoundButton.addEventListener('click', function(evt) {
    end();
  });

  let newRoundButton = document.getElementById('new-round');
  newRoundButton.addEventListener('click', function(evt) {
    start();
  });
});

function createDeck() {
  let deck = [];
  let worth = [ '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A' ];
  let suit = [ 'c', 'd', 's', 'h'];
  let value = [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11 ];
  for (let i = 0; i < suit.length; i++) {
    for (let j = 0; j < worth.length; j++) {
      deck.push([ worth[j], suit[i], value[j] ]);
    }
  }
  return deck;
}

function randomCard(deck) {
  let index = Math.floor(Math.random() * deck.length);
  return deck.splice(index, 1)[0];
}

function sumOfCards(cards) {
  let sum = 0;
  let acesCount = 0;
  for (let card of cards) {
    sum += card[2];
    if (card[0] === 'A') {
      acesCount += 1;
    }
    if (sum > 21) {
      sum -= acesCount * 10;
      acesCount = 0;
    }
  }
  return sum;
}

function showCard(card) {
  return `${card[0]}${card[1]}`;
}

function showCards(cards) {
  let cardsOnHand = cards.map(showCard).join(' ');
  return `${sumOfCards(cards)} (${cardsOnHand})`;
}

function start() {
  for (let item of document.querySelectorAll("span")) {
    item.textContent = "";
  }
  document.getElementsByClassName('buttons')[0].classList.remove('buttons-start');
  deck = createDeck();
  diller = [];
  player = [];
  player.push(randomCard(deck), randomCard(deck));
  diller.push(randomCard(deck), randomCard(deck));
  document.getElementById('player-cards').textContent = showCards(player);
  if (sumOfCards(player) == 21) {
    findWinner();
  }
}

function findWinner() {
  let sumOfPlayer = sumOfCards(player);
  let sumOfDiller = sumOfCards(diller);
  if (sumOfPlayer > 21 && sumOfDiller > 21 || sumOfPlayer == sumOfDiller) {
    document.getElementById('result').textContent = 'Tied!';
  } else if (sumOfPlayer > 21) {
    document.getElementById('result').textContent = 'Diller WIN!';
  } else if (sumOfDiller > 21 || sumOfPlayer > sumOfDiller) {
    document.getElementById('result').textContent = 'Player WIN!';
  } else {
    document.getElementById('result').textContent = 'Diller WIN!';
  }
  document.getElementById('diller-cards').textContent = showCards(diller);
  document.getElementsByClassName('buttons')[0].classList.add('buttons-start');
}

function addDillerCard(untillimit=false) {
  if (sumOfCards(diller) >= 17) return;
  diller.push(randomCard(deck));
  if (untillimit) {
    addDillerCard(true);
  }
}

function addCard() {
  addDillerCard();
  player.push(randomCard(deck));
  document.getElementById('player-cards').textContent = showCards(player);
  if (sumOfCards(player) >= 21) {
    end();
  }
}

function end() {
  addDillerCard(true);
  findWinner();
}
