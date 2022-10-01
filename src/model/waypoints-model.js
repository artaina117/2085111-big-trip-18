import Observable from '../framework/observable.js';
import {UpdateType} from '../utils/const.js';

export default class WaypointsModel extends Observable {
  #pointsApiService = null;
  #destinationsApiService = null;
  #offersApiService = null;
  #waypoints = [];
  #destinations = [];
  #offers = [];

  constructor(pointsApiService, destinationsApiService, offersApiService) {
    super();
    this.#pointsApiService = pointsApiService;
    this.#destinationsApiService = destinationsApiService;
    this.#offersApiService = offersApiService;
  }

  init = async () => {
    try {
      const waypoints = await this.#pointsApiService.waypoints;
      this.#waypoints = waypoints.map(this.#adaptToClient);
      this.#destinations = await this.#destinationsApiService.destinations;
      this.#offers = await this.#offersApiService.offers;
    } catch(err) {
      this.#waypoints = [];
      this.#destinations = [];
      this.#offers = [];
    }

    this._notify(UpdateType.INIT);
  };

  #adaptToClient = (waypoint) => {
    const adaptedPoint = {...waypoint,
      basePrice: waypoint['base_price'],
      dateFrom: waypoint['date_from'],
      dateTo: waypoint['date_to'],
      isFavorite: waypoint['is_favorite'],
    };

    // Ненужные ключи мы удаляем
    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  };

  get waypoints() {
    return this.#waypoints;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  updateWaypoint = async (updateType, update) => {
    const index = this.#waypoints.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }

    try {
      const response = await this.#pointsApiService.updateWaypoint(update);
      const updatedWaypoint = this.#adaptToClient(response);
      this.#waypoints = [
        ...this.#waypoints.slice(0, index),
        updatedWaypoint,
        ...this.#waypoints.slice(index + 1),
      ];

      this._notify(updateType, updatedWaypoint);

    } catch(err) {
      throw new Error('Can\'t update waypoint');
    }
  };

  addWaypoint = (updateType, update) => {
    this.#waypoints = [
      update,
      ...this.#waypoints,
    ];

    this._notify(updateType, update);
  };

  deleteWaypoint = (updateType, update) => {
    const index = this.#waypoints.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting waypoint');
    }

    this.#waypoints = [
      ...this.#waypoints.slice(0, index),
      ...this.#waypoints.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
