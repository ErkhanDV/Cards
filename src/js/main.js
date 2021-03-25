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
  let deck = [];
  let worth = [ '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A' ];
  let suit = [ 'c', 'd', 's', 'h'];
  let value = [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11 ];
  let cardColor = [ 'dark', 'red', 'dark', 'red' ];
  for (let i = 0; i < suit.length; i++) {
    for (let j = 0; j < worth.length; j++) {
      deck.push({
        worth: worth[j],
        suit: suit[i],
        value: value[j],
        color: cardColor[i], 
        cardImage(dx, dy, visibility = true) {
          let svgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          $(rect)
          .addClass('cardRect')
          .attr({
            x: 5 + dx,
            y: 5 + dy,
            rx: 15,
            ry: 15,
            width: 50,
            height: 70
          })
          let worthText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          $(worthText)
          .addClass('cardWorth')
          .attr({
            x: 30 + dx,
            y: 60 + dy
          })
          let suitText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          $(suitText)
          .addClass('cardSuit')
          .attr({
            x: 40 + dx,
            y: 20 + dy
          })
          $(svgGroup).append(rect);
          $('#cardPicture').append(svgGroup);
          $(svgGroup).append(worthText);
          $(worthText).append(this.worth);
          $(svgGroup).append(suitText);
          $(suitText).append(suitVisual[this.suit]);
          $(svgGroup).addClass(color[this.color]);
          if (visibility == false) {
            $(svgGroup).addClass('shortDiller');
          }
        },
        showCard() {
          return `${this.worth}${this.suit}`;
        }
      });
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
    if (sum > 21) {
      sum -= acesCount * 10;
      acesCount = 0;
    }
  }
  return sum;
}

function showCards(cards) {
  let cardsOnHand = cards.map(card => card.showCard()).join(' ');
  return `${sumOfCards(cards)} (${cardsOnHand})`;
}

function start() {
  $('svg').empty();
  $('span').text('');
  $('.buttons').removeClass('buttons-start');
  deck = createDeck();
  diller = [];
  player = [];
  addCard();
  addCard();
  $('#player-cards').text(showCards(player));
  if (sumOfCards(player) == 21) {
    findWinner();
  }
}

function findWinner() {
  let sumOfPlayer = sumOfCards(player);
  let sumOfDiller = sumOfCards(diller);
  if (sumOfPlayer > 21 && sumOfDiller > 21 || sumOfPlayer == sumOfDiller) {
    $('#result').text('Tied!');
  } else if (sumOfPlayer > 21) {
    $('#result').text('Diller WIN!');
  } else if (sumOfDiller > 21 || sumOfPlayer > sumOfDiller) {
    $('#result').text('Player WIN!');
  } else {
    $('#result').text('Diller WIN!');
  }
  $('#diller-cards').text(showCards(diller));
  $('.buttons').addClass('buttons-start');
  $('g').removeClass('shortDiller');
}

function addDillerCard(untillimit=false) {
  if (sumOfCards(diller) >= 17) return;
  let card = randomCard(deck);
  diller.push(card);
  dx = 55 * (diller.length - 1);
  dy = 80;
  visibility = false;
  card.cardImage(dx, dy, visibility);
  if (untillimit) {
    addDillerCard(true);
  }
}

function addCard() {
  addDillerCard();
  let card = randomCard(deck);
  player.push(card);
  dx = 55 * (player.length - 1);
  dy = 0;
  visibility = true;
  card.cardImage(dx, dy, visibility);
  $('#player-cards').text(showCards(player));
  if (sumOfCards(player) >= 21) {
    end();
  }
}

function end() {
  addDillerCard(true);
  findWinner();
}
