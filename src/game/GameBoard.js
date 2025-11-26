import './GameBoard.css';
import {useEffect, useReducer, useRef} from 'react';
import permutation from '../util/permutation';
import Card from './Card';
import { CARDS_BASE } from './data';

const DIFFICULTY_LEVELS = {0: 5, 3: 7, 5: 8, 7: 10};

const GRID_ELEMENTS_MAX_COUNT = 12; // 4 x 3 >= CARDS_BASE.length

function initCards(count) {
  // deep copy 'count' number of items from CARDS_BASE
  return CARDS_BASE.slice(0, count).map(obj => ({...obj}));
}

function initState(count) {
  return {
    cards: initCards(count),
    score: 0,
    bestScore: 0,
    gameOver: false,
    lastCard: null,
  }
}

function stateReducer(state, action) {
  switch(true) {
    case action === "reset":
      /* Reset the board: return the cards to initial state */
      return {
        ...initState(DIFFICULTY_LEVELS[0]),
        bestScore: state.bestScore, // copy best score from previous state
      };

    case typeof action === "number" && state.gameOver:
      /* 'Ignore' if is game has ended */
      return state;

    case typeof action === "number" && state.cards[action].clicked:
      /* Player guessed an incorrect card */
      return {
        ...state,
        lastCard: action,
        gameOver: true,
      }
    
    case typeof action === "number":
      /* Player guessed a correct card */
      const lastCard = action;
      const card = state.cards[lastCard];
      // update score
      const score = state.score + 1;
      // set card to clicked
      let updatedCards = state.cards.slice();
      updatedCards[lastCard] = {...card, clicked: true};
      // check for difficulty breakpoint
      const nextLevel = DIFFICULTY_LEVELS[score] || state.cards.length;
      const attach = CARDS_BASE.slice(updatedCards.length, nextLevel);
      updatedCards = updatedCards.concat(attach.map(obj => ({...obj})));
      // update best score if needed
      const bestScore = score > state.bestScore ? score : state.bestScore;
      // new state:
      return {
        score,
        bestScore,
        lastCard,
        cards: updatedCards,
        gameOver: score === CARDS_BASE.length, // all cards already clicked
      };

    default:
      /* coding error, unplanned case */
      throw new Error(`action: ${action}`);
  }
}

function placeholders(size) {
  return Array.from({length: size}, (_, i) => <div key={`placeholder-${i}`}></div>);
}

export default function GameBoard() {
  const [state, dispatch] = useReducer(stateReducer, DIFFICULTY_LEVELS[0], initState);
  const cardGrid = useRef();

  useEffect(() => {
    /* Shuffle Cards in the DOM, using CSS grid order property */

    if (gameOver) return; // unless the game ended

    const cardsAndPlaceholders = cardGrid.current.children;
    const getNextIndex = permutation(GRID_ELEMENTS_MAX_COUNT);
    for(const element of cardsAndPlaceholders) {
        element.style.order = getNextIndex();
    }
  });

  const {score, bestScore, gameOver, lastCard} = state;
  const allCount = CARDS_BASE.length;
  const gameWon = gameOver && score === allCount;
  const gameLost = gameOver && score !== allCount;

  return (
    <div className="GameBoard">
      <div className="scores">
        <p>Score: {score} / {allCount}</p>
        <p>Best Score: {bestScore} / {allCount}</p>
      </div>  
      <div className="cards-container" ref={cardGrid}>
        {state.cards.map((cardObj, i) =>
          <Card key={i} {...cardObj} onClick={() => dispatch(i)} enabled={!gameOver} won={gameWon && lastCard === i} wrong={gameLost && lastCard === i} />
        )}
        {placeholders(GRID_ELEMENTS_MAX_COUNT - state.cards.length)}
      </div>
      {state.gameOver && (
        <div className="popup">
          <p>You got {score === allCount ? "all of them!" : `${score} out of ${allCount}.` }</p>
          <button onClick={() => dispatch("reset")}>
            {score === allCount ? "Play" : "Try"} Again
          </button>
        </div>
      )}
    </div>
  );
}
