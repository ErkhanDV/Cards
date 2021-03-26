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
        cardImage(dx, dy) {
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
        },
        showCard() {
          return `${this.worth}${this.suit}`;
        },
        cardShort(dx) {
          let svgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          $(rect)
          .addClass('cardRect')
          .attr({
            x: 5 + dx,
            y: 5,
            rx: 15,
            ry: 15,
            width: 50,
            height: 70
          })
          let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          $(path)
          .addClass('shortImage')
          .attr({
            d: `M ${30+dx} 19 L ${50+dx} 40 L ${30+dx} 61 L ${10+dx} 40 z`
          })
          let spadesText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          $(spadesText)
          .attr({
            x: 40 + dx,
            y: 20
          })
          let heartsText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          $(heartsText)
          .addClass('redSuit')
          .attr({
            x: 40 + dx,
            y: 70
          })
          let diamsText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          $(diamsText)
          .addClass('redSuit')
          .attr({
            x: 13 + dx,
            y: 20,
          })
          let clubsText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          $(clubsText)
          .attr({
            x: 13 + dx,
            y: 70
          })
          $(svgGroup).append(rect);
          $(svgGroup).append(path);
          $(svgGroup).append(spadesText);
          $(spadesText).append('&spades;');
          $(svgGroup).append(heartsText);
          $(heartsText).append('&hearts;');
          $(svgGroup).append(diamsText);
          $(diamsText).append('&diams;');
          $(svgGroup).append(clubsText);
          $(clubsText).append('&clubs;');
          $('#cardPicture').append(svgGroup);
          $(svgGroup).addClass('short');
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
  $('.short').remove();
  let dx = 0;
  for (let card of diller) {
    let dy = 0;
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
  $('#player-cards').text(showCards(player));
  if (sumOfCards(player) >= 21) {
    end();
  }
}

function end() {
  addDillerCard(true);
  findWinner();
}
