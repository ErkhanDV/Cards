var diller = [];
var player = [];
var deck = [];

$( document ).ready(function(evt) {

  let svgGroupOne = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  let firstRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  $(firstRect)
  .addClass('cardRect')
  .attr({
    x: 5,
    y: 5,
    rx: 15,
    ry: 15,
    width: 50,
    height: 70
  })
  let worthOne = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  $(worthOne)
  .addClass('cardWorthBlack')
  .attr({
    x: 30,
    y: 60
  })
  let suitOne = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  $(suitOne)
  .addClass('cardSuitBlack')
  .attr({
    x: 40,
    y: 20
  })
  $(svgGroupOne).append(firstRect);
  $('#cardPicture').append(svgGroupOne);
  $(svgGroupOne).append(worthOne);
  $(worthOne).append('J');
  $(svgGroupOne).append(suitOne);
  $(suitOne).append('&spades;');

  let svgGroupTwo = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  let secondRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  $(secondRect)
  .addClass('cardRect')
  .attr({
    x: 60,
    y: 5,
    rx: 15,
    ry: 15,
    width: 50,
    height: 70
  })
  let worthTwo = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  $(worthTwo)
  .addClass('cardWorthBlack')
  .attr({
    x: 85,
    y: 60
  })
  let suitTwo = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  $(suitTwo)
  .addClass('cardSuitBlack')
  .attr({
    x: 95,
    y: 20
  })
  $(svgGroupTwo).append(secondRect);
  $('#cardPicture').append(svgGroupTwo);
  $(svgGroupTwo).append(worthTwo);
  $(worthTwo).append('Q');
  $(svgGroupTwo).append(suitTwo);
  $(suitTwo).append('&clubs;');

  let svgGroupThree = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  let thirdRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  $(thirdRect)
  .addClass('cardRect')
  .attr({
    x: 115,
    y: 5,
    rx: 15,
    ry: 15,
    width: 50,
    height: 70
  })
  let worthThree = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  $(worthThree)
  .addClass('cardWorthRed')
  .attr({
    x: 140,
    y: 60
  })
  let suitThree = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  $(suitThree)
  .addClass('cardSuitRed')
  .attr({
    x: 150,
    y: 20
  })
  $(svgGroupThree).append(thirdRect);
  $('#cardPicture').append(svgGroupThree);
  $(svgGroupThree).append(worthThree);
  $(worthThree).append('K');
  $(svgGroupThree).append(suitThree);
  $(suitThree).append('&hearts;');

  let svgGroupFour = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  let fourRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  $(fourRect)
  .addClass('cardRect')
  .attr({
    x: 170,
    y: 5,
    rx: 15,
    ry: 15,
    width: 50,
    height: 70
  })
  let worthFour = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  $(worthFour)
  .addClass('cardWorthRed')
  .attr({
    x: 195,
    y: 60
  })
  let suitFour = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  $(suitFour)
  .addClass('cardSuitRed')
  .attr({
    x: 205,
    y: 20
  })
  $(svgGroupFour).append(fourRect);
  $('#cardPicture').append(svgGroupFour);
  $(svgGroupFour).append(worthFour);
  $(worthFour).append('A');
  $(svgGroupFour).append(suitFour);
  $(suitFour).append('&diams;');

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
  for (let i = 0; i < suit.length; i++) {
    for (let j = 0; j < worth.length; j++) {
      deck.push({
        worth: worth[j],
        suit: suit[i],
        value: value[j]
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

function showCard(card) {
  return `${card.worth}${card.suit}`;
}

function showCards(cards) {
  let cardsOnHand = cards.map(showCard).join(' ');
  return `${sumOfCards(cards)} (${cardsOnHand})`;
}

function start() {
  $('span').text('');
  $('.buttons').removeClass('buttons-start');
  deck = createDeck();
  diller = [];
  player = [];
  player.push(randomCard(deck), randomCard(deck));
  diller.push(randomCard(deck), randomCard(deck));
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
  $('#player-cards').text(showCards(player));
  if (sumOfCards(player) >= 21) {
    end();
  }
}

function end() {
  addDillerCard(true);
  findWinner();
}
