import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import App from './App';

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

    const clicked = [];

    for(let i = 0; i < N_CARDS; i++) {
      const cards = container.querySelectorAll('.Card');
      
      const choice = Array.prototype.find.call(cards, card => {
        const title = card.querySelector('h2').textContent;
        return !clicked.includes(title);
      });

      await user.click(choice);
      clicked.push(choice.querySelector('h2').textContent); // add card title to `clicked`

      const [score] = container.querySelector('.scores').children;
      expect(score.textContent).toEqual(`Score: ${i + 1} / 10`);
    }

    let gameOverPopup = container.querySelector('.popup');
    expect(gameOverPopup).toBeNull();

    // click a previously clicked card
    const cards = container.querySelectorAll('.Card');
    const choice = Array.prototype.find.call(cards, card => {
      const title = card.querySelector('h2').textContent;
      return clicked.includes(title);
    });
    await user.click(choice);

    gameOverPopup = container.querySelector('.popup');
    expect(gameOverPopup).toBeInTheDocument();

  });
});

