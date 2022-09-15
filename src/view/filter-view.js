import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

const isFuture = (waypoints) => waypoints.some((element) => dayjs(element.dateFrom).diff(dayjs(), 'second') >= 0);

const isPast = (waypoints) => waypoints.some((element) => dayjs(dayjs()).diff(element.dateTo, 'second') >= 0);

const createFiltersTemplate = (waypoints) => (`
  <form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${isFuture(waypoints) ? '' : 'disabled'}>
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" ${isPast(waypoints) ? '' : 'disabled'}>
      <label class="trip-filters__filter-label" for="filter-past">Past</label>
    </div>

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`);

export default class FiltersView extends AbstractView {
  #waypoints = null;

  constructor (waypointsArray) {
    super();
    this.#waypoints = waypointsArray;
  }

  get template() {
    return createFiltersTemplate(this.#waypoints);
  }
}
