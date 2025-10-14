import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { cardChooserFor } from './testHelper';
import App from '../src/App';

describe('App', () => {
  it('renders header', () => {
    render(<App />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header.querySelector('h1').textContent).toEqual('The Smurfs Memory Game');
  });

  it('renders score', () =>{
    const {container} = render(<App />);
    const scoreElement = container.querySelector('.scores');
    const [score, bestScore] = scoreElement.children;
    expect(score.textContent).toEqual('Score: 0 / 10');
    expect(bestScore.textContent).toEqual('Best Score: 0 / 10');
  });

  it('updates scores', async () => {
    const user = userEvent.setup();

    const {container} = render(<App />);

    const card = container.querySelector('.Card');
    const [score, bestScore] = container.querySelector('.scores').children;

    await user.click(card);

    expect(score.textContent).toEqual('Score: 1 / 10');
    expect(bestScore.textContent).toEqual('Best Score: 1 / 10');
  });

  it('reaches game over when a card is clicked twice (game lost)', async () => {
    const user = userEvent.setup();

    const {container} = render(<App />);
    const N_CARDS = 5;

    const cardChooser = cardChooserFor(container);

    for(let i = 0; i < N_CARDS; i++) {
      await user.click(cardChooser.newCard());

      const [score] = container.querySelector('.scores').children;
      expect(score.textContent).toEqual(`Score: ${i + 1} / 10`);
    }

    let gameOverPopup = container.querySelector('.popup');
    expect(gameOverPopup).toBeNull();

    await user.click(cardChooser.oldCard());

    gameOverPopup = container.querySelector('.popup');
    expect(gameOverPopup).toBeInTheDocument();
    expect(gameOverPopup.querySelector('p').textContent).toEqual(`You got ${N_CARDS} out of 10.`); // lost!
  });

  it('reaches game over when all cards are clicked (game won)', async () => {
    const user = userEvent.setup();

    const {container} = render(<App />);
    const cardChooser = cardChooserFor(container);

    let gameOverPopup = container.querySelector('.popup');
    expect(gameOverPopup).toBeNull();
    
    let choice;

    while ((choice = cardChooser.newCard())) {
      await user.click(choice);
      
      const [score] = container.querySelector('.scores').children;
    }

    gameOverPopup = container.querySelector('.popup');
    expect(gameOverPopup).toBeInTheDocument();
    expect(gameOverPopup.querySelector('p').textContent).toEqual('You got all of them!'); // won!
  });
});

