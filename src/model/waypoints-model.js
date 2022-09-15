import {generateWaypoint} from '../mock/waypoint.js';

export default class WaypointsModel {
  #waypoints = Array.from({length: 2}, generateWaypoint);

  get waypoints() {
    return this.#waypoints;
  }
}
