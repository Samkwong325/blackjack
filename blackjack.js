import React, { useState } from 'react';
import './App.css';

function App() {
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const createDeck = () => {
    const deck = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ suit, rank });
      }
    }
    return deck;
  };

  const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  const getCardValue = (card) => {
    if (card.rank === 'A') {
      return 11; // Ace can be 1 or 11
    } else if (['J', 'Q', 'K'].includes(card.rank)) {
      return 10;
    } else {
      return parseInt(card.rank);
    }
  };

  const calculateHandValue = (hand) => {
    let value = 0;
    let hasAce = false;
    for (const card of hand) {
      value += getCardValue(card);
      if (card.rank === 'A') {
        hasAce = true;
      }
    }
    // Adjust for Ace value if needed
    if (value > 21 && hasAce) {
      value -= 10;
    }
    return value;
  };

  const dealCard = () => {
    const newCard = deck.pop();
    setDeck([...deck]);
    return newCard;
  };

  const hit = () => {
    const newCard = dealCard();
    setPlayerHand([...playerHand, newCard]);
  };

  const stand = () => {
    setPlayerTurn(false);
    dealerTurn();
  };

  const dealerTurn = () => {
    while (calculateHandValue(dealerHand) < 17) {
      const newCard = dealCard();
      setDealerHand([...dealerHand, newCard]);
    }
    checkWinner();
  };

  const checkWinner = () => {
    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);

    if (playerValue > 21) {
      setMessage("You busted! Dealer wins.");
    } else if (dealerValue > 21) {
      setMessage("Dealer busted! You win.");
    } else if (playerValue > dealerValue) {
      setMessage("You win!");
    } else if (dealerValue > playerValue) {
      setMessage("Dealer wins!");
    } else {
      setMessage("Push! It's a tie.");
    }
    setGameOver(true);
  };

  const newGame = () => {
    setDeck(shuffleDeck(createDeck()));
    setPlayerHand([dealCard(), dealCard()]);
    setDealerHand([dealCard(), dealCard()]);
    setPlayerTurn(true);
    setGameOver(false);
    setMessage('');
  };

  const [deck, setDeck] = useState(shuffleDeck(createDeck()));
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <div className="App">
      <h1>Blackjack</h1>
      <div className="hands">
        <div className="player-hand">
          <h2>Player</h2>
          {playerHand.map((card, index) => (
            <div key={index} className="card">
              <span>{card.rank}</span>
              <span>{card.suit}</span>
            </div>
          ))}
          <p>Value: {calculateHandValue(playerHand)}</p>
        </div>
        <div className="dealer-hand">
          <h2>Dealer</h2>
          {dealerHand.map((card, index) => (
            <div key={index} className="card">
              <span>{card.rank}</span>
              <span>{card.suit}</span>
            </div>
          ))}
          <p>Value: {calculateHandValue(dealerHand)}</p>
        </div>
      </div>
      <div className="buttons">
        {!gameStarted && <button onClick={newGame}>New Game</button>}
        {gameStarted && !gameOver && playerTurn && (
          <>
            <button onClick={hit}>Hit</button>
            <button onClick={stand}>Stand</button>
          </>
        )}
        {gameOver && <button onClick={newGame}>Play Again</button>}
      </div>
      <p className="message">{message}</p>
    </div>
  );
}

export default App;
