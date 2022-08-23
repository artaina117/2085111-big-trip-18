import {generateWaypoint} from '../mock/waypoint.js';

export default class WaypointsModel {
  waypoints = Array.from({length: 5}, generateWaypoint);

  getWaypoints = () => this.waypoints;
}