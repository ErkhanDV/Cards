class Card {
  constructor(worth, suit) {
    this.worth = worth;
    this.suit = suit;
    this.value = VALUES[worth];
    this.color = COLORS[suit];
  }

  createRect(dx, dy) {
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

  createWorth(dx, dy) {
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

  createSuit(dx, dy, suit) {
    let suitText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    $(suitText)
    .attr({
      x: 80 + dx,
      y: 60 + dy
    })
    .append(suit);
    return suitText;
  }

  createFace(index, dy0) {
    let card = player.items[index];
    let dy = 120 + dy0;
    let dx = 55 * index;
    let group = card.createGroup();
    $(group).append(card.createRect(dx, dy));
    dy = 80 + dy0;
    $(group).append(card.createWorth(dx, dy));
    let suit = suitVisual[card.suit];
    let cardSuit = card.createSuit(dx, dy, suit);
    $(group).append(cardSuit);
    $(cardSuit).addClass('cardSuit');
    $(cardSuit).addClass(color[card.color]);
    return group;
  }

  createShirt(index) {
    let card = diller.items[index];
    let group = card.createGroup();
    $('#dillerCards').append(group);
    let dx = 55 * index;
    let dy = 0;
    $(group).append(card.createRect(dx, dy));

    let suit = '&hearts;';
    dx = 3 + 55 * index;
    dy = 3;
    let heartSymbol = card.createSuit(dx, dy, suit);
    $(heartSymbol).addClass('redSuit');
    $(group).append(heartSymbol);

    suit = '&spades;';
    dx = 3 + 55 * index;
    dy = -33;
    let spadeSymbol = card.createSuit(dx, dy, suit);
    $(spadeSymbol).addClass('blackSuit');
    $(group).append(spadeSymbol);

    suit = '&diams;';
    dx = -22 + 55 * index;
    dy = -33;
    let diamSymbol = card.createSuit(dx, dy, suit);
    $(diamSymbol).addClass('redSuit');
    $(group).append(diamSymbol);

    suit = '&clubs;';
    dx = -22 + 55 * index;
    dy = 3;
    let clubSymbol = card.createSuit(dx, dy, suit);
    $(clubSymbol).addClass('blackSuit');
    $(group).append(clubSymbol);
    return group;
  }

  createGroup() {
    let group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    return group;
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
  $('g').empty();
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
  $('#dillerCards').empty();
  let dx = 0;
  let dy0 = -120;
  let index = 0;
  for (let card of diller.items) {
    $('#dillerCards').append(card.createFace(index, dy0));
    index += 1;
  }
}

function addDillerCard(untillimit=false) {
  if (diller.sumOfCards() >= 17) return;
  let card = randomCard(deck)
  diller.add(card);
  let index = diller.count() - 1;
  let dy0 = 0;
  card.createShirt(index, dy0);
  if (untillimit) {
    addDillerCard(true);
  }
}

function addCard() {
  addDillerCard();
  let card = randomCard(deck);
  player.add(card);
  index = player.count() - 1;
  dy0 = 0;
  $('#playerCards').append(card.createFace(index, dy0));
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
