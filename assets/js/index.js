'use strict';

const cardsContainer = document.getElementById('root');
const loadingDiv = document.querySelector('#loading');
const errorDiv = document.querySelector('#error');

loadingDiv.textContent = 'LOADING ...';
fetch('./data.json')
  .then(
    (response) => response.json(),
    (err) => {
      console.log('error loading data');
    }
  )
  .then((users) => {
    const cards = users.map((user) => generateUserCard(user));

    cardsContainer.append(...cards);
  })
  .catch((err) => {
    errorDiv.textContent = 'ERROR';
    console.log('error happened', err);
  })
  .finally(() => {
    loadingDiv.textContent = '';
  });

function generateUserCard(userObj) {
  const fullName =
    `${userObj.firstName} ${userObj.lastName}`.trim() ||
    CARD_CONSTANTS.userName;

  const card = document.createElement('li');
  card.classList.add('userCardWrapper');

  const cardArticle = document.createElement('article');
  cardArticle.classList.add('cardContainer');

  const imgWrapper = createUserCardImageWrapper(userObj, fullName);

  const cardName = document.createElement('h2');
  cardName.classList.add('cardName');
  cardName.textContent = fullName;

  const cardDescription = document.createElement('p');
  cardDescription.classList.add('cardDescription');
  cardDescription.textContent =
    userObj.description || CARD_CONSTANTS.cardDescription;

  cardArticle.append(imgWrapper, cardName, cardDescription);

  card.append(cardArticle);
  return card;
}

function createUserCardImageWrapper(userObj, fullName) {
  const userImgElem = createElement('img', {
    classNames: ['cardImg'],
    attributes: {
      src: userObj.profilePicture,
      alt: fullName,
      'data-id': userObj.id,
    },
  });

  userImgElem.addEventListener('error', errorHandler);
  userImgElem.addEventListener('load', loadHandler);

  const initialsElem = createElement(
    'div',
    { classNames: ['initials'] },
    getInitials(fullName)
  );

  const imgWrapperElem = createElement(
    'div',
    {
      classNames: ['cardImgWrapper'],
      attributes: { id: `imgWrapper${userObj.id}` },
    },
    initialsElem
  );

  return imgWrapperElem;
}

function errorHandler({ target }) {
  target.remove();
}

function loadHandler({
  target,
  target: {
    dataset: { id },
  },
}) {
  document.getElementById(`imgWrapper${id}`).append(target);
}
