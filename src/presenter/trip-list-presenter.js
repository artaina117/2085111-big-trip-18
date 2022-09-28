import {render, remove, RenderPosition} from '../framework/render.js';
import TripListView from '../view/trip-list-view.js';
import SortView from '../view/sort-view.js';
import NoWaypointView from '../view/no-waypoints-view.js';
import WaypointPresenter from './waypoint-presenter.js';
import {SortType, UpdateType, UserAction} from '../utils/const.js';
import {sortByTime, sortByPrice} from '../utils/waypoint.js';
import {filter} from '../utils/filter.js';

export default class TripListPresenter {
  #tripListContainer = null;
  #waypointsModel = null;
  #sortComponent = null;
  #filterModel = null;

  #tripListComponent = new TripListView();
  #noWaypointView = new NoWaypointView();
  #waypointsPresenter = new Map();

  #currentSortType = SortType.DEFAULT;

  constructor(tripListContainer, waypointsModel, filterModel) {
    this.#tripListContainer = tripListContainer;
    this.#waypointsModel = waypointsModel;
    this.#filterModel = filterModel;

    this.#waypointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get waypoints() {
    const filterType = this.#filterModel.filter;
    const waypoints = this.#waypointsModel.waypoints;
    const filteredWaypoints = filter[filterType](waypoints);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return filteredWaypoints.sort(sortByPrice);
      case SortType.TIME:
        return filteredWaypoints.sort(sortByTime);
    }

    return this.#waypointsModel.waypoints;
  }

  init = () => {
    this.#renderBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#tripListContainer, RenderPosition.AFTERBEGIN);
  };

  #renderNoWaypointView = () => {
    render(this.#noWaypointView, this.#tripListContainer,RenderPosition.AFTERBEGIN);
  };

  #renderWaypoint = (waypoint) => {
    const waypointPresenter = new WaypointPresenter(this.#tripListComponent.element, this.#handleViewAction, this.#handleModeChange);
    waypointPresenter.init(waypoint);
    this.#waypointsPresenter.set(waypoint.id, waypointPresenter);
  };

  #renderWaypoints = (waypoints) => {
    waypoints.forEach((waypoint) => this.#renderWaypoint(waypoint));
  };

  #renderBoard = () => {
    const waypoints = this.waypoints;
    const waypointsCount = waypoints.length;

    if (waypointsCount === 0) {
      this.#renderNoWaypointView();
      return;
    }
    this.#renderSort();
    render(this.#tripListComponent, this.#tripListContainer);
    this.#renderWaypoints(this.waypoints);
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#waypointsModel.updateWaypoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#waypointsModel.addWaypoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#waypointsModel.deleteWaypoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#waypointsPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#waypointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearBoard();
    this.#renderBoard();
  };

  #clearBoard = ({resetSortType = false} = {}) => {

    this.#waypointsPresenter.forEach((presenter) => presenter.destroy());
    this.#waypointsPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#noWaypointView);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };
}
