import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../utils/const.js';

const NoWaypointsTextType = {
  [FilterType.ALL]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const createNoWaypointTemplate = (filterType) => {
  const noWaypointTextValue = NoWaypointsTextType[filterType];

  return (`
    <p class="trip-events__msg">${noWaypointTextValue}</p>
  `);
};

export default class NoWaypointView extends AbstractView {
  #filterType = null;

  constructor (filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoWaypointTemplate(this.#filterType);
  }
}
