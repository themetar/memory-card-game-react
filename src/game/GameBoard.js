import './GameBoard.css';
import {useState, useReducer} from 'react';
import permutation from '../util/permutation';
import Card from './Card';

const cardsBase = [
  {contents: "A", clicked: false},
  {contents: "B", clicked: false},
  {contents: "C", clicked: false},
  {contents: "D", clicked: false},
  {contents: "E", clicked: false},
  {contents: "F", clicked: false},
  {contents: "G", clicked: false},
  {contents: "H", clicked: false},
  {contents: "I", clicked: false},
  {contents: "J", clicked: false},
];

const START_COUNT = 5;

const DIFFICULTY_LEVELS = {3:7, 5:8, 7:10};

function shuffleOrder(objects) {
  const getNextIndex = permutation(objects.length);
  objects.forEach(obj => {
    obj.order = getNextIndex();
  });
  return objects;
}

function initCards(count) {
  // deep copy 'count' number of items from cardsBase, then populate their order property
  return shuffleOrder(cardsBase.slice(0, count).map(obj => ({...obj})));
}

function cardsStateReducer(cards, action) {
  switch(true) {
    case action === "reset":
      /* Reset the board: return the cards to initial state */
      return initCards(START_COUNT);

    case typeof action === "number":
      /* Player guessed a correct card */
      const index = action;
      let updatedCards = cards.slice();
      updatedCards[index] = {...cards[index], clicked: true};
      // check for difficulty breakpoint
      const score = cards.reduce((acc, card) => acc + card.clicked, 0) + 1; // get score and calculate update
      const nextLevel = DIFFICULTY_LEVELS[score];
      const attach = nextLevel && cardsBase.slice(updatedCards.length, nextLevel).map(obj => ({...obj})) || [];
      updatedCards = updatedCards.concat(attach);
      return shuffleOrder(updatedCards);

    default:
      /* coding error, unplanned case */
      throw new Error(`action: ${action}`);
  }
}

export default function GameBoard() {
  const [cards, updateCards] = useReducer(cardsStateReducer, START_COUNT, initCards);
  
  const score = cards.reduce((acc, card) => acc + card.clicked, 0); // count clicked cards

  const [bestScore, setBestScore] = useState(0);

  const clickCard = function clickCard(index) {
    const {clicked} = cards[index];
    if (clicked) {
      // reset
      alert("Reset game");
      setBestScore(score > bestScore ? score : bestScore);
      updateCards("reset");
    } else {
      // score up
      updateCards(index);
    }
  };

  return (
    <div className="GameBoard">
      <p>Best Score: {bestScore}</p>
      <p>Score: {score}</p>
      <div className="cards-container">
        {cards.map((cardObj, i) =>
          <Card key={i} {...cardObj} onClick={() => clickCard(i)} />
        )}
      </div>
    </div>
  );
}
