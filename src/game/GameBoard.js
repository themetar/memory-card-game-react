import './GameBoard.css';
import {useState} from 'react';
import permutation from '../util/permutation';
import Card from './Card';

const cardsBase = [
  {contents: "A", clicked: false},
  {contents: "B", clicked: false},
  {contents: "C", clicked: false},
  {contents: "D", clicked: false},
  {contents: "E", clicked: false},
];

function shuffleOrder(objects) {
  const getNextIndex = permutation(objects.length);
  objects.forEach(obj => {
    obj.order = getNextIndex();
  });
  return objects;
}

export default function GameBoard() {
  const [cards, setCards] = useState(shuffleOrder(cardsBase));
  
  const score = cards.reduce((acc, card) => acc + card.clicked, 0); // count clicked cards

  const [bestScore, setBestScore] = useState(0);

  const clickCard = function clickCard(index) {
    const {clicked} = cards[index];
    if (clicked) {
      // reset
      alert("Reset game");
      setBestScore(score > bestScore ? score : bestScore);
      setCards(shuffleOrder(cards.map(card => ({...card, clicked: false}))));
    } else {
      // score up
      const updatedCards = cards.slice();
      updatedCards[index] = {...cards[index], clicked: true};
      setCards(shuffleOrder(updatedCards));
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
