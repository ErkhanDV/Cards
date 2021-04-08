class Card {
  constructor(worth, suit) {
    this.worth = worth;
    this.suit = suit;
    this.value = VALUES[worth];
    this.color = COLORS[suit];
  }

  cardRect(dx, dy) {
    let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    $(rect)
    .addClass('cardRect')
    .attr({
      x: 45 + dx,
      y: 5 + dy,
      rx: 15,
      ry: 15,
      width: 50,
      height: 70
    })
    return rect;
  }

  cardWorth(dx, dy) {
    let worthText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    $(worthText)
    .addClass('cardWorth')
    .attr({
      x: 70 + dx,
      y: 100 + dy
    })
    .append(this.worth)
    .addClass(color[this.color]);
    return worthText;
  }

  cardSuit(dx, dy, suit) {
    let suitText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    $(suitText)
    .attr({
      x: 80 + dx,
      y: 60 + dy
    })
    .append(suit);
    return suitText;
  }

  createPlayerGroup() {
    let playerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    return playerGroup;
  }

  createDillerGroup() {
    let dillerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    return dillerGroup;
  }

  showCard() {
    return `${this.worth}${this.suit}`;
  }
}


class Cards {
  constructor() {
    this.items = [];
  }

  add(card) {
    this.items.push(card);
  }

  clean() {
    this.items = [];
  }

  sumOfCards() {
    let sum = 0;
    let acesCount = 0;
    for (let card of this.items) {
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

  showCards() {
    let cardsOnHand = this.items.map(card => card.showCard()).join(' ');
    return `${this.sumOfCards()} (${cardsOnHand})`;
  }

  count() {
    return this.items.length;
  }
}


var diller = new Cards;
var player = new Cards;
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

function start() {
  $('g').remove();
  $('text').empty();
  $('.buttons').removeClass('buttons-start');
  deck = createDeck();
  diller.clean();
  player.clean();
  addCard();
  addCard();
}

function findWinner() {
  let sumOfPlayer = player.sumOfCards();
  let sumOfDiller = diller.sumOfCards();
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
  $('#dillerResult').append(diller.sumOfCards());
  console.log(`Diler: ${diller.showCards()}`);
  $('.buttons').addClass('buttons-start');
  $('.dilerCards').remove();
  let dx = 0;
  for (let card of diller.items) {
    let dy = 0;
    let dilGroup = card.createDillerGroup();
    $('#cardPicture').append(dilGroup);
    $(dilGroup).append(card.cardRect(dx, dy));
    dy = -40;
    $(dilGroup).append(card.cardWorth(dx, dy));
    suit = suitVisual[card.suit];
    let cardSuit = card.cardSuit(dx, dy, suit);
    $(dilGroup).append(cardSuit);
    $(cardSuit).addClass('cardSuit');
    $(cardSuit).addClass(color[card.color]);
    dx += 55;
  }
  $()
}

function addDillerCard(untillimit=false) {
  if (diller.sumOfCards() >= 17) return;
  let card = randomCard(deck);
  diller.add(card);
  let dilGroup = card.createDillerGroup();
  $(dilGroup).addClass('dilerCards');
  $('#cardPicture').append(dilGroup);
  let dx = 55 * (diller.count() -1);
  let dy = 0;
  $(dilGroup).append(card.cardRect(dx, dy));

  suit = '&hearts;'
  dx = 3 + 55 * (diller.count() -1);
  dy = 0;
  let heartSymbol = card.cardSuit(dx, dy, suit);
  $(heartSymbol).addClass('redSuit');
  $(dilGroup).append(heartSymbol);

  suit = '&spades;';
  dx = 3 + 55 * (diller.count() -1);
  dy = -33;
  let spadeSymbol = card.cardSuit(dx, dy, suit);
  $(spadeSymbol).addClass('blackSuit');
  $(dilGroup).append(spadeSymbol);

  suit = '&diams;';
  dx = -22 + 55 * (diller.count() -1);
  dy = -33;
  let diamSymbol = card.cardSuit(dx, dy, suit);
  $(diamSymbol).addClass('redSuit');
  $(dilGroup).append(diamSymbol);

  suit = '&clubs;';
  dx = -22 + 55 * (diller.count() -1);
  dy = 0;
  let clubSymbol = card.cardSuit(dx, dy, suit);
  $(clubSymbol).addClass('blackSuit');
  $(dilGroup).append(clubSymbol);

  if (untillimit) {
    addDillerCard(true);
  }
}

function addCard() {
  addDillerCard();
  let card = randomCard(deck);
  player.add(card);
  let dy = 120;
  let dx = 55 * (player.count() - 1);
  let plGroup = card.createPlayerGroup();
  $('#cardPicture').append(plGroup);
  $(plGroup).append(card.cardRect(dx, dy));
  dy = 80;
  $(plGroup).append(card.cardWorth(dx, dy));
  suit = suitVisual[card.suit];
  let cardSuit = card.cardSuit(dx, dy, suit);
  $(plGroup).append(cardSuit);
  $(cardSuit).addClass('cardSuit');
  $(cardSuit).addClass(color[card.color]);
  $('#playerResult').empty();
  $('#playerResult').append(player.sumOfCards());
  if (player.sumOfCards() >= 21) {
    end();
  }
  console.log(`Player: ${player.showCards()}`);
}

function end() {
  addDillerCard(true);
  findWinner();
}
