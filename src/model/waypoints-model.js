import Observable from '../framework/observable.js';
import {generateWaypoint} from '../mock/waypoint.js';

export default class WaypointsModel extends Observable {
  #waypoints = Array.from({length: 5}, generateWaypoint);

  get waypoints() {
    return this.#waypoints;
  }

  updateWaypoint = (updateType, update) => {
    const index = this.#waypoints.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }

    this.#waypoints = [
      ...this.#waypoints.slice(0, index),
      update,
      ...this.#waypoints.slice(index + 1),
    ];

    this._notify(updateType, update);
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
      throw new Error('Can\'t delete unexisting task');
    }

    this.#waypoints = [
      ...this.#waypoints.slice(0, index),
      ...this.#waypoints.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
