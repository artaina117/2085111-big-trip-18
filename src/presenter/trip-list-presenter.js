import {render, RenderPosition} from '../framework/render.js';
import TripListView from '../view/trip-list-view.js';
import SortView from '../view/sort-view.js';
import NoWaypointView from '../view/no-waypoints-view.js';
import WaypointPresenter from './waypoint-presenter.js';
import {updateItem} from '../utils/common.js';

export default class TripListPresenter {
  #tripListContainer = null;
  #waypointsModel = null;
  #waypoints = [];

  #tripListComponent = new TripListView();
  #sortComponent = new SortView();
  #noWaypointView = new NoWaypointView();
  #waypointsPresenter = new Map();

  constructor(tripListContainer, waypointsModel) {
    this.#tripListContainer = tripListContainer;
    this.#waypointsModel = waypointsModel;
  }

  init = () => {
    this.#waypoints = [...this.#waypointsModel.waypoints];
    this.#renderWaypointsList();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#tripListContainer, RenderPosition.AFTERBEGIN);
  };

  #renderNoWaypointView = () => {
    render(this.#noWaypointView, this.#tripListContainer,RenderPosition.AFTERBEGIN);
  };

  #renderTripListComponent = () => {
    render(this.#tripListComponent, this.#tripListContainer, RenderPosition.BEFOREEND);
  };

  #renderWaypoint = (waypoint) => {
    const waypointPresenter = new WaypointPresenter(this.#tripListComponent.element, this.#handleTaskChange, this.#handleModeChange);
    waypointPresenter.init(waypoint);
    this.#waypointsPresenter.set(waypoint.id, waypointPresenter);
  };

  #renderWaypoints = () => {
    for (let i = 0; i < this.#waypoints.length; i++) {
      this.#renderWaypoint(this.#waypoints[i]);
    }
  };

  #renderWaypointsList = () => {
    if (this.#waypoints.length === 0) {
      this.#renderNoWaypointView();
    } else {
      this.#renderSort();
      this.#renderTripListComponent();
      this.#renderWaypoints();
    }
  };

  #clearWaypointsList = () => {
    this.#waypointsPresenter.forEach((presenter) => presenter.destroy());
    this.#waypointsPresenter.clear();
  };

  #handleTaskChange = (updatedPoint) => {
    this.#waypoints = updateItem(this.#waypoints, updatedPoint);
    this.#waypointsPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#waypointsPresenter.forEach((presenter) => presenter.resetView());
  };
}
