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
