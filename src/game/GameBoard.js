import './GameBoard.css';
import {useState} from 'react';
import Card from './Card';

export default function GameBoard() {
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState([
    {contents: "A", order: 1, clicked: false},
    {contents: "B", order: 2, clicked: false},
    {contents: "C", order: 3, clicked: false},
    {contents: "D", order: 4, clicked: false},
    {contents: "E", order: 5, clicked: false},
  ]);

  const clickCard = function clickCard(index) {
    const {clicked} = cards[index];
    if (clicked) {
      // reset
      alert("Reset game");
      setScore(0);
      setCards(cards.map(card => ({...card, clicked: false})));
    } else {
      // score up
      setScore(score + 1);
      const updatedCards = cards.slice();
      updatedCards[index] = {...cards[index], clicked: true};
      setCards(updatedCards);
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
