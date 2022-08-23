import {createElement} from '../render.js';
import {humanizeDate, humanizeTime, compareTime} from '../utils.js';
import {destinations} from '../mock/destinations.js';
import {arrayOfOffers} from '../mock/offers.js';

const getOffers = (offersByType, offersIds) => {
  const offersArray = [];
  for (let i = 0; i < offersIds.length; i++) {
    const offer = offersByType.filter((element) => element.id === offersIds[i]);
    offersArray.push(...offer);
  }
  return offersArray;
};

const createWaipointOffersTemplate = (offers) =>`
  <ul class="event__selected-offers">
    ${offers.map((offer) => `
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>
      `)}
  </ul>
  `.split(',').join('\n');

const createWaypointTemplate = (waypoint) => {
  const {basePrice, dateFrom, dateTo, isFavorite, type, destination, offers} = waypoint;

  const destinationById = destinations.filter((item) => item.id === destination);

  const humanizedTimeFrom = dateFrom !== null
    ? humanizeTime(dateFrom)
    : '';

  const humanizedTimeTo = dateTo !== null
    ? humanizeTime(dateTo)
    : '';

  const humanizedDate = dateFrom !== null
    ? humanizeDate(dateFrom)
    : '';

  const timeDiff = compareTime(dateFrom, dateTo);

  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';

  const offersByType = arrayOfOffers.find((element) => element.type === type).offers;
  const neededOffers = getOffers(offersByType, offers);
  const offersTemplate = neededOffers.length !== 0
    ? createWaipointOffersTemplate(neededOffers)
    : '';

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${humanizedDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destinationById[0].name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${humanizedTimeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${humanizedTimeTo}</time>
          </p>
          <p class="event__duration">${timeDiff}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        ${offersTemplate}
        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class WaypointView {
  constructor(waypoint) {
    this.waypoint = waypoint;
  }

  getTemplate() {
    return createWaypointTemplate(this.waypoint);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
