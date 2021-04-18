class Card {
  constructor(worth, suit) {
    this.worth = worth;
    this.suit = suit;
    this.value = VALUES[worth];
    this.color = COLORS_BY_SUITS[suit];
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
      y: 60 + dy
    })
    .append(this.worth)
    .addClass(COLORS_CLASSES[this.color]);
    return worthText;
  }

  createSuit(dx, dy, suit) {
    let suitText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    $(suitText)
    .attr({
      x: 80 + dx,
      y: 20 + dy
    })
    .append(suit);
    return suitText;
  }

  createFace(index, dy0) {
    let dx = 55 * index;
    let dy = dy0;
    let group = this.createGroup();

    $(group).append(this.createRect(dx, dy));

    $(group).append(this.createWorth(dx, dy));

    let suit = SUITS_DISPLAY[this.suit];
    let cardSuit = this.createSuit(dx, dy, suit);
    $(cardSuit)
    .addClass('cardSuit')
    .addClass(COLORS_CLASSES[this.color]);
    $(group).append(cardSuit);

    return group;
  }

  createShirt(index, dy0) {
    let dx = 55 * index;
    let dy = dy0;
    let group = this.createGroup();

    $(group).append(this.createRect(dx, dy));

    let suit = SUITS_DISPLAY.h;
    dx = 3 + 55 * index;
    dy = dy0 + 46;
    let heartSymbol = this.createSuit(dx, dy, suit);
    $(heartSymbol).addClass('redSuit');
    $(group).append(heartSymbol);

    suit = SUITS_DISPLAY.s;
    dx = 3 + 55 * index;
    dy = dy0 + 7;
    let spadeSymbol = this.createSuit(dx, dy, suit);
    $(spadeSymbol).addClass('blackSuit');
    $(group).append(spadeSymbol);

    suit = SUITS_DISPLAY.d;
    dx = -22 + 55 * index;
    dy = dy0 + 7;
    let diamSymbol = this.createSuit(dx, dy, suit);
    $(diamSymbol).addClass('redSuit');
    $(group).append(diamSymbol);

    suit = SUITS_DISPLAY.c;
    dx = -22 + 55 * index;
    dy = dy0 + 46;
    let clubSymbol = this.createSuit(dx, dy, suit);
    $(clubSymbol).addClass('blackSuit');
    $(group).append(clubSymbol);

    return group;
  }

  createGroup() {
    return document.createElementNS('http://www.w3.org/2000/svg', 'g');
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


const WORTHS = [ '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A' ];
const SUITS = [ 'c', 'd', 's', 'h' ];
const SUITS_DISPLAY = {
  c: '&clubs;',
  d: '&diams;',
  s: '&spades;',
  h: '&hearts;'
};
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
const RED_COLOR = 'red';
const BLACK_COLOR = 'black';
const COLORS_BY_SUITS = {
  c: BLACK_COLOR,
  d: RED_COLOR,
  s: BLACK_COLOR,
  h: RED_COLOR
};
const COLORS_CLASSES = {
  [BLACK_COLOR]: 'color-card-black',
  [RED_COLOR]: 'color-card-red'
};


var diller = new Cards;
var player = new Cards;
var deck = [];


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
  let dy0 = 0;
  for (let index = 0; index < diller.count(); index++) {
    let card = diller.items[index];
    $('#dillerCards').append(card.createFace(index, dy0));
  }
}


function addDillerCard(untillimit=false) {
  if (diller.sumOfCards() >= 17) return;
  let card = randomCard(deck)
  diller.add(card);
  let index = diller.count() - 1;
  let dy0 = 0;
  $('#dillerCards').append(card.createShirt(index, dy0));
  if (untillimit) {
    addDillerCard(true);
  }
}


function addCard() {
  addDillerCard();
  let card = randomCard(deck);
  player.add(card);
  let index = player.count() - 1;
  let dy0 = 120;
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
