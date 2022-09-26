import {getRandomInteger} from '../utils/common.js';

const names = [
  'Chamonix', 'Singapore', 'Milan', 'Shanghai', 'Barcelona', 'San Diego', 'Rome', 'Birmingham', 'Paris', 'London'
];

let ordinalDescriptionId = 0;
const IncDescriptionId = () => ordinalDescriptionId++;

const generateDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
  ];

  const description = [];
  const amountOfDescriptions = getRandomInteger(1, 5);

  for (let i = 0; i <= amountOfDescriptions; i++) {
    const randomIndex = getRandomInteger(0, descriptions.length - 1);
    description[i] = descriptions[randomIndex];
  }

  return description;
};

const generatePictureSrc = () => `img/photos/${getRandomInteger(1, 5)}.jpg`;

const generateDestination = () => {
  IncDescriptionId();

  return ({
    id: ordinalDescriptionId,
    description : generateDescription(),
    name : names[ordinalDescriptionId],
    pictures : [
      {
        src : generatePictureSrc(),
        description : 'Chamonix parliament building'
      }
    ]
  });
};

export const destinations = Array.from({length: 9}, generateDestination);
