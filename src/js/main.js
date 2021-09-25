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


function createSVG(name) {
  return document.createElementNS('http://www.w3.org/2000/svg', name);
}


class Card {
  constructor(worth, suit) {
    this.worth = worth;
    this.suit = suit;
    this.value = VALUES[worth];
    this.color = COLORS_BY_SUITS[suit];
  }

  get id() {
    return `card_${this.string}`;
  }

  get string() {
    return `${this.worth}${this.suit}`;
  }

  createRect(dx, dy) {
    let rect = createSVG('rect');
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
    let worthText = createSVG('text');
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
    let suitText = createSVG('text');
    $(suitText)
    .attr({
      x: 80 + dx,
      y: 20 + dy
    })
    .append(suit);
    return suitText;
  }

  createFace(index, dy0) {
    let dx = 30 * index;
    let dy = dy0;
    let group = this.createGroup(index);

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
    let dx = 30 * index;
    let dy = dy0;
    let group = this.createGroup();

    $(group).append(this.createRect(dx, dy));

    let suit = SUITS_DISPLAY.h;
    dx = 3 + 30 * index;
    dy = dy0 + 46;
    let heartSymbol = this.createSuit(dx, dy, suit);
    $(heartSymbol).addClass('redSuit');
    $(group).append(heartSymbol);

    suit = SUITS_DISPLAY.s;
    dx = 3 + 30 * index;
    dy = dy0 + 7;
    let spadeSymbol = this.createSuit(dx, dy, suit);
    $(spadeSymbol).addClass('blackSuit');
    $(group).append(spadeSymbol);

    suit = SUITS_DISPLAY.d;
    dx = -22 + 30 * index;
    dy = dy0 + 7;
    let diamSymbol = this.createSuit(dx, dy, suit);
    $(diamSymbol).addClass('redSuit');
    $(group).append(diamSymbol);

    suit = SUITS_DISPLAY.c;
    dx = -22 + 30 * index;
    dy = dy0 + 46;
    let clubSymbol = this.createSuit(dx, dy, suit);
    $(clubSymbol).addClass('blackSuit');
    $(group).append(clubSymbol);

    return group;
  }

  highlight() {
    $('use').remove();
    let highlight = createSVG('use');
    $('#cardPicture').append(highlight);
    $(highlight).attr('href', `#${this.id}`);
  }

  createGroup() {
    let group = createSVG('g');
    $(group)
    .attr('id', this.id)
    .addClass('card')
    .click((evt) => this.highlight());
    return group;
  }
}


class Cards {
  constructor(dy, groupId) {
    this.items = [];
    this.dy = dy;
    this.groupId = groupId;
  }

  get value() {
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

  get string() {
    let cardsOnHand = this.items.map(card => card.string).join(' ');
    return `${this.value} (${cardsOnHand})`;
  }

  get count() {
    return this.items.length;
  }

  add(card, hided=false) {
    this.items.push(card);
    this.drawLatest(hided);
  }

  clean() {
    this.items = [];
    this.removeAll();
  }

  drawLatest(hided=false) {
    let cardVisual;
    if (this.count == 0) return;
    let lastIndex = this.count - 1;
    if (hided) {
      cardVisual = this.items[lastIndex].createShirt(lastIndex, this.dy);
    } else {
      cardVisual = this.items[lastIndex].createFace(lastIndex, this.dy);
    }
    $(`#${this.groupId}`).append(cardVisual);
  }

  drawAll() {
    for (let item of this.items) {
      let index = this.items.indexOf(item);
      let cardVisual = item.createFace(index, this.dy);
      $(`#${this.groupId}`).append(cardVisual);
    }
  }

  removeAll() {
    $(`#${this.groupId}`).empty();
  }
}


class Deck {
  constructor() {
    this.items = [];
    this.create();
  }

  create() {
    for (let i = 0; i < SUITS.length; i++) {
      for (let j = 0; j < WORTHS.length; j++) {
        this.items.push(new Card(WORTHS[j], SUITS[i]));
      }
    }
  }

  getCard() {
    let index = Math.floor(Math.random() * this.items.length);
    return this.items.splice(index, 1)[0];
  }
}


var diller = new Cards(0, 'dillerCards');
var player = new Cards(120, 'playerCards');
var deck;


function start() {
  $('g').empty();
  $('text').empty();
  $('.buttons').removeClass('buttons-start');
  deck = new Deck();
  diller.clean();
  player.clean();
  addCard();
  addCard();
}


function findWinner() {
  let sumOfPlayer = player.value;
  let sumOfDiller = diller.value;
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
  $('#dillerResult').append(diller.value);
  console.log(`Diler: ${diller.string}`);
  $('.buttons').addClass('buttons-start');
  $('#dillerCards').empty();
  diller.drawAll();
}


function addDillerCard(untillimit=false) {
  if (diller.value >= 17) return;
  let card = deck.getCard();
  diller.add(card, true);
  if (untillimit) {
    addDillerCard(true);
  }
}


function addCard() {
  addDillerCard();
  addPlayerCard();  
}


function addPlayerCard () {
  let card = deck.getCard();
  player.add(card);
  $('#playerResult').empty();
  $('#playerResult').append(player.value);
  if (player.value >= 21) {
    end();
  }
  console.log(`Player: ${player.string}`);
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