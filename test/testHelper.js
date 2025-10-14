const find = Array.prototype.find;

const cardChooserFor = container => {
  const chosen = [];

  const newCard = () => {      
    const choice = find.call(
      container.querySelectorAll('.Card'),
      card => {
        const title = card.querySelector('h2').textContent;
        return !chosen.includes(title);
      }
    );

    if (choice) chosen.push(choice.querySelector('h2').textContent); // add card title to `chosen`

    return choice;
  };

  const oldCard = () => {
    return find.call(
      container.querySelectorAll('.Card'),
      card => {
        const title = card.querySelector('h2').textContent;
        return chosen.includes(title);
      }
    );
  };

  return {
    newCard,
    oldCard
  }
};

export { cardChooserFor };
