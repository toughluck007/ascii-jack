(function() {
  const suits = ['S', 'H', 'D', 'C'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  let deck = [];
  let playerHand = [];
  let dealerHand = [];
  let gameOver = false;
  let dealerHidden = true;

  function createDeck() {
    deck = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({suit, rank});
      }
    }
  }

  function shuffle() {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  function startGame() {
    createDeck();
    shuffle();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    dealerHidden = true;
    gameOver = false;
    updateDisplay();
  }

  function cardValue(card) {
    if (card.rank === 'A') return 11; // will adjust later
    if (['K','Q','J'].includes(card.rank)) return 10;
    return parseInt(card.rank, 10);
  }

  function handValue(hand) {
    let val = 0;
    let aces = 0;
    for (const card of hand) {
      val += cardValue(card);
      if (card.rank === 'A') aces++;
    }
    while (val > 21 && aces > 0) {
      val -= 10; // count Ace as 1 instead of 11
      aces--;
    }
    return val;
  }

  function cardString(card) {
    return `[${card.rank}${card.suit}]`;
  }

  function handString(hand, hideSecond) {
    let result = '';
    hand.forEach((card, index) => {
      if (hideSecond && index === 1) {
        result += '[??] ';
      } else {
        result += cardString(card) + ' ';
      }
    });
    return result.trim();
  }

  function updateDisplay() {
    const dealerDiv = document.getElementById('dealer');
    const playerDiv = document.getElementById('player');
    const statusDiv = document.getElementById('status');

    dealerDiv.textContent = 'Dealer: ' + handString(dealerHand, dealerHidden);
    playerDiv.textContent = 'Player: ' + handString(playerHand, false) +
      ' (' + handValue(playerHand) + ')';

    if (gameOver) {
      dealerDiv.textContent = 'Dealer: ' + handString(dealerHand, false) +
        ' (' + handValue(dealerHand) + ')';
    }

    if (handValue(playerHand) > 21) {
      statusDiv.textContent = 'Player busts! Dealer wins.';
      gameOver = true;
    } else if (handValue(dealerHand) > 21) {
      statusDiv.textContent = 'Dealer busts! Player wins.';
      gameOver = true;
    } else if (gameOver) {
      const playerVal = handValue(playerHand);
      const dealerVal = handValue(dealerHand);
      if (playerVal > dealerVal) statusDiv.textContent = 'Player wins!';
      else if (playerVal < dealerVal) statusDiv.textContent = 'Dealer wins!';
      else statusDiv.textContent = "It's a tie.";
    } else {
      statusDiv.textContent = 'Choose Hit or Stand';
    }

    document.getElementById('hit').disabled = gameOver;
    document.getElementById('stand').disabled = gameOver;
  }

  function hit() {
    if (gameOver) return;
    playerHand.push(deck.pop());
    if (handValue(playerHand) > 21) {
      gameOver = true;
    }
    updateDisplay();
  }

  function stand() {
    if (gameOver) return;
    dealerHidden = false;
    while (handValue(dealerHand) < 17) {
      dealerHand.push(deck.pop());
    }
    gameOver = true;
    updateDisplay();
  }

  document.getElementById('hit').addEventListener('click', hit);
  document.getElementById('stand').addEventListener('click', stand);
  document.getElementById('new').addEventListener('click', startGame);

  startGame();
})();
