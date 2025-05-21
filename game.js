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

  const suitSymbols = { S: '♠', H: '♥', D: '♦', C: '♣' };

  function cardArt(card) {
    const w = 7;
    const top = '┌' + '─'.repeat(w) + '┐';
    const bottom = '└' + '─'.repeat(w) + '┘';
    const rank = card.rank;
    const suit = suitSymbols[card.suit] || card.suit;
    const line1 = `│${rank.padEnd(w, ' ')}│`;
    const line2 = `│${' '.repeat((w - 1) / 2)}${suit}${' '.repeat((w - 1) / 2)}│`;
    const line3 = `│${rank.padStart(w, ' ')}│`;
    return [top, line1, line2, line3, bottom];
  }

  function cardBack() {
    const w = 7;
    const top = '┌' + '─'.repeat(w) + '┐';
    const bottom = '└' + '─'.repeat(w) + '┘';
    const pattern = `│${'░'.repeat(w)}│`;
    return [top, pattern, pattern, pattern, bottom];
  }

  function handString(hand, hideSecond) {
    const lines = ['', '', '', '', ''];
    hand.forEach((card, index) => {
      const art = hideSecond && index === 1 ? cardBack() : cardArt(card);
      art.forEach((l, i) => {
        lines[i] += l + ' ';
      });
    });
    return lines.map(l => l.trimEnd()).join('\n');
  }

  function updateDisplay() {
    const dealerDiv = document.getElementById('dealer');
    const playerDiv = document.getElementById('player');
    const statusDiv = document.getElementById('status');

    dealerDiv.textContent = 'Dealer' + (gameOver ? ' (' + handValue(dealerHand) + ')' : '') +
      '\n' + handString(dealerHand, dealerHidden);

    playerDiv.textContent = 'Player (' + handValue(playerHand) + ')\n' +
      handString(playerHand, false);

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
