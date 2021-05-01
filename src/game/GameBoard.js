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
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState(shuffleOrder(cardsBase));

  const clickCard = function clickCard(index) {
    const {clicked} = cards[index];
    if (clicked) {
      // reset
      alert("Reset game");
      setScore(0);
      setCards(shuffleOrder(cards.map(card => ({...card, clicked: false}))));
    } else {
      // score up
      setScore(score + 1);
      const updatedCards = cards.slice();
      updatedCards[index] = {...cards[index], clicked: true};
      setCards(shuffleOrder(updatedCards));
    }
  };

  return (
    <div className="GameBoard">
      <p>Score: {score}</p>
      <div className="cards-container">
        {cards.map((cardObj, i) =>
          <Card key={i} {...cardObj} onClick={() => clickCard(i)} />
        )}
      </div>
    </div>
  );
}
