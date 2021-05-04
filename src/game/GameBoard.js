import './GameBoard.css';
import {useEffect, useReducer, useRef} from 'react';
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

function initCards(count) {
  // deep copy 'count' number of items from cardsBase
  return cardsBase.slice(0, count).map(obj => ({...obj}));
}

function initState(count) {
  return {
    cards: initCards(count),
    score: 0,
    bestScore: 0,
    gameOver: false,
  }
}

function stateReducer(state, action) {
  switch(true) {
    case action === "reset":
      /* Reset the board: return the cards to initial state */
      return {
        ...state,
        cards: initCards(START_COUNT),
        score: 0,
        gameOver: false,
      };

    case typeof action === "number":
      /* Ignore if is game has ended */
      if (state.gameOver) return state;
      /* Player guessed a card */
      const index = action;
      const card = state.cards[index];
      if (card.clicked) {
        /* Player guessed an incorrect card */
        return {
          ...state,
          gameOver: true,
        }
      } else {
        /* Player guessed a correct card */
        let updatedCards = state.cards.slice();
        updatedCards[index] = {...state.cards[index], clicked: true};
        // check for difficulty breakpoint
        const score = state.score + 1;
        const nextLevel = DIFFICULTY_LEVELS[score];
        const attach = (nextLevel && cardsBase.slice(updatedCards.length, nextLevel).map(obj => ({...obj}))) || [];
        updatedCards = updatedCards.concat(attach);
        const bestScore = score > state.bestScore ? score : state.bestScore;
        return {
          score,
          bestScore,
          cards: updatedCards,
          gameOver: score === cardsBase.length, // all cards already clicked
        };
      }

    default:
      /* coding error, unplanned case */
      throw new Error(`action: ${action}`);
  }
}

export default function GameBoard() {
  const [state, dispatch] = useReducer(stateReducer, START_COUNT, initState);
  const cardGrid = useRef();

  useEffect(() => {
    /* Shuffle Cards in the DOM, using CSS grid order property */
    const cardElems = cardGrid.current.querySelectorAll(".Card");
    const getNextIndex = permutation(cardElems.length);
    cardElems.forEach(elem => {
        elem.style.order = getNextIndex();
    });
  });

  return (
    <div className="GameBoard">
      <p>Best Score: {state.bestScore}</p>
      <p>Score: {state.score}</p>
      <div className="cards-container" ref={cardGrid}>
        {state.cards.map((cardObj, i) =>
          <Card key={i} {...cardObj} onClick={() => dispatch(i)} />
        )}
      </div>
      {state.gameOver && (
        <div>
          <p>Game over</p>
          <button onClick={() => dispatch("reset")}>Play Again</button>
        </div>
      )}
    </div>
  );
}
