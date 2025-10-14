import './GameBoard.css';
import {useEffect, useReducer, useRef} from 'react';
import permutation from '../util/permutation';
import Card from './Card';


const cardsBase = [
  {contents: {title: "Smurfette",     src: "smurfs/Smurfette.webp"},            clicked: false},
  {contents: {title: "Handy Smurf",   src: "smurfs/Schtroumpf-bricoleur.webp"}, clicked: false},
  {contents: {title: "Vanity Smurf",  src: "smurfs/VanitySmurf.webp"},          clicked: false},
  {contents: {title: "Chef Smurf",    src: "smurfs/Schtroumpf_cuisinier.webp"}, clicked: false},
  {contents: {title: "Jokey Smurf",   src: "smurfs/Schtroumpf_Farceur.webp"},   clicked: false},
  {contents: {title: "Greedy Smurf",  src: "smurfs/greedy-smurf.jpg"},          clicked: false},
  {contents: {title: "Hefty Smurf",   src: "smurfs/Schtroumpf-costaud.webp"},   clicked: false},
  {contents: {title: "Grouchy Smurf", src: "smurfs/Schtroumpf-grognon.webp"},   clicked: false},
  {contents: {title: "Clumsy Smurf",  src: "smurfs/clumsy-smurf.jpg"},          clicked: false},
  {contents: {title: "Papa Smurf",    src: "smurfs/Papa_smurf.jpg"},            clicked: false},
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
    lastCard: null,
  }
}

function stateReducer(state, action) {
  switch(true) {
    case action === "reset":
      /* Reset the board: return the cards to initial state */
      return {
        ...initState(START_COUNT),
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
      const nextLevel = DIFFICULTY_LEVELS[score];
      const attach = (nextLevel && cardsBase.slice(updatedCards.length, nextLevel)) || [];
      updatedCards = updatedCards.concat(attach.map(obj => ({...obj})));
      // update best score if needed
      const bestScore = score > state.bestScore ? score : state.bestScore;
      // new state:
      return {
        score,
        bestScore,
        lastCard,
        cards: updatedCards,
        gameOver: score === cardsBase.length, // all cards already clicked
      };

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

    if (gameOver) return; // unless the game ended

    const cardElems = cardGrid.current.querySelectorAll(".Card");
    const getNextIndex = permutation(cardElems.length);
    cardElems.forEach(elem => {
        elem.style.order = getNextIndex();
    });
  });

  const {score, bestScore, gameOver, lastCard} = state;
  const allCount = cardsBase.length;

  return (
    <div className="GameBoard">
      <div className="scores">
        <p>Score: {score} / {allCount}</p>
        <p>Best Score: {bestScore} / {allCount}</p>
      </div>  
      <div className="cards-container" ref={cardGrid}>
        {state.cards.map((cardObj, i) =>
          <Card key={i} {...cardObj} onClick={() => dispatch(i)} enabled={!gameOver} won={score === allCount && lastCard === i} wrong={score !== allCount && lastCard === i} />
        )}
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
