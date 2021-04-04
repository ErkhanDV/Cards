class Card {
  constructor(worth, suit) {
    this.worth = worth;
    this.suit = suit;
    this.value = VALUES[worth];
    this.color = COLORS[suit];
  }

  cardImage(dx, dy) {
    let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    $(rect)
    .addClass('cardRect')
    .attr({
      x: 45 + dx,
      y: 45 + dy,
      rx: 15,
      ry: 15,
      width: 50,
      height: 70
    })
    let worthText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    $(worthText)
    .addClass('cardWorth')
    .attr({
      x: 70 + dx,
      y: 100 + dy
    })
    let suitText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    $(suitText)
    .addClass('cardSuit')
    .attr({
      x: 80 + dx,
      y: 60 + dy
    })
    $('#playersCards').append(rect);
    $('#playersCards').append(worthText);
    $(worthText).append(this.worth);
    $('#playersCards').append(suitText);
    $(suitText).append(suitVisual[this.suit]);
    $(worthText).addClass(color[this.color]);
    $(suitText).addClass(color[this.color]);
  }

  showCard() {
    return `${this.worth}${this.suit}`;
  }

  cardShort(dx) {
    let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    $(rect)
    .addClass('cardRect')
    .attr({
      x: 45 + dx,
      y: 5,
      rx: 15,
      ry: 15,
      width: 50,
      height: 70
    })
    let spadesText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    $(spadesText)
    .addClass('blackSuit')
    .attr({
      x: 82 + dx,
      y: 27
    })
    let heartsText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    $(heartsText)
    .addClass('redSuit')
    .attr({
      x: 82 + dx,
      y: 65
    })
    let diamsText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    $(diamsText)
    .addClass('redSuit')
    .attr({
      x: 57 + dx,
      y: 27,
    })
    let clubsText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    $(clubsText)
    .addClass('blackSuit')
    .attr({
      x: 57 + dx,
      y: 65
    })
    $('#shortCards').append(rect);
    $('#shortCards').append(spadesText);
    $(spadesText).append('&spades;');
    $('#shortCards').append(heartsText);
    $(heartsText).append('&hearts;');
    $('#shortCards').append(diamsText);
    $(diamsText).append('&diams;');
    $('#shortCards').append(clubsText);
    $(clubsText).append('&clubs;');
    $('#shortCards').addClass('short');
  }
}
var diller = [];
var player = [];
var deck = [];
var suitVisual = {
  c: '&clubs;',
  d: '&diams;',
  s: '&spades;',
  h: '&hearts;'
};
var color = {
  dark: 'colorCardBlack',
  red: 'colorCardRed'
};
const WORTHS = [ '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A' ];
const SUITS = [ 'c', 'd', 's', 'h'];
const VALUES = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  'T': 10,
  'J': 10,
  'Q': 10,
  'K': 10,
  'A': 11 
};
const COLORS = {
  'c': 'dark',
  'd': 'red',
  's': 'dark',
  'h': 'red'
};

$( document ).ready(function(evt) {

  start();

  $('#get-card').click(function(evt) {
    addCard();
  });

  $('#end-round').click(function(evt) {
    end();
  });

  $('#new-round').click(function(evt) {
    start();
  });

});

function createDeck() {
  deck = [];
  for (let i = 0; i < SUITS.length; i++) {
    for (let j = 0; j < WORTHS.length; j++) {
      deck.push(new Card(WORTHS[j], SUITS[i]));
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
    sum += card.value;
    if (card.worth === 'A') {
      acesCount += 1;
    }
  }
  for (let i = 1; i <= acesCount; i++) {
    if (sum <= 21) break;
    sum -= 10;
  }
  return sum;
}

function showCards(cards) {
  let cardsOnHand = cards.map(card => card.showCard()).join(' ');
  return `${sumOfCards(cards)} (${cardsOnHand})`;
}

function start() {
  $('g').empty();
  $('text').empty();
  $('.buttons').removeClass('buttons-start');
  deck = createDeck();
  diller = [];
  player = [];
  addCard();
  addCard();
}

function findWinner() {
  let sumOfPlayer = sumOfCards(player);
  let sumOfDiller = sumOfCards(diller);
  if (sumOfPlayer > 21 && sumOfDiller > 21 || sumOfPlayer == sumOfDiller) {
    $('#winerText').append('Tied!');
    console.log('Tied!');
  } else if (sumOfPlayer > 21) {
    $('#winerText').append('Diler WIN!');
    console.log('Diler Win!');
  } else if (sumOfDiller > 21 || sumOfPlayer > sumOfDiller) {
    $('#winerText').append('Player WIN!');
    console.log('Player Win!');
  } else {
    $('#winerText').append('Diler WIN!');
    console.log('Diler Win!');
  }
  $('#dillerResult').append(sumOfCards(diller));
  console.log(`Diler: ${showCards(diller)}`);
  $('.buttons').addClass('buttons-start');
  $('.short').empty();
  let dx = 0;
  for (let card of diller) {
    let dy = -40;
    card.cardImage(dx, dy);
    dx += 55;
  }
}

function addDillerCard(untillimit=false) {
  if (sumOfCards(diller) >= 17) return;
  let card = randomCard(deck);
  diller.push(card);
  let dx = 55 * (diller.length -1);
  card.cardShort(dx);
  if (untillimit) {
    addDillerCard(true);
  }
}

function addCard() {
  addDillerCard();
  let card = randomCard(deck);
  player.push(card);
  let dy = 80;
  let dx = 55 * (player.length - 1);
  card.cardImage(dx, dy);
  $('#playerResult').empty();
  $('#playerResult').append(sumOfCards(player));
  if (sumOfCards(player) >= 21) {
    end();
  }
  console.log(`Player: ${showCards(player)}`);
}

function end() {
  addDillerCard(true);
  findWinner();
}
