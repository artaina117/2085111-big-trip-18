import {getRandomInteger} from '../utils.js';
import dayjs from 'dayjs';
import {destinations} from './destinations.js';
import {arrayOfOffers} from './offers.js';

let idWaipoint = 1;
const generateIdWaipoint = () => idWaipoint++;

const generateType = () => {
  const types = [
    'taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'
  ];

  const randomIndex = getRandomInteger(0, types.length - 1);

  return types[randomIndex];
};

const generateDate = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  const maxDuration = 300;
  const duration = getRandomInteger(1, maxDuration);

  const dateFrom = dayjs().add(daysGap, 'day').toDate();
  const dateTo = dayjs(dateFrom).add(duration, 'minutes').toDate();
  return {
    dateFrom, dateTo
  };
};

export const generateWaypoint = () => {
  const type = generateType();
  const currentTypeOffers = arrayOfOffers.find((element) => element.type === type).offers;
  const offersArray = [];
  const amountOfOffers = getRandomInteger(0, currentTypeOffers.length);

  for (let i = 0; i <= amountOfOffers - 1; i++) {
    offersArray.push(currentTypeOffers[i].id);
  }

  return ({
    basePrice : getRandomInteger(1, 1999),
    ...generateDate(),
    destination : getRandomInteger(1, destinations.length),
    id : generateIdWaipoint(),
    isFavorite : getRandomInteger(0, 1),
    offers : offersArray,
    type,
  });
};
