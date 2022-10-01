import {render, remove, RenderPosition} from '../framework/render.js';
import TripListView from '../view/trip-list-view.js';
import SortView from '../view/sort-view.js';
import NewWaypointPresenter from './new-waypoint-presenter.js';
import NoWaypointView from '../view/no-waypoints-view.js';
import WaypointPresenter from './waypoint-presenter.js';
import {SortType, UpdateType, UserAction, FilterType} from '../utils/const.js';
import {sortByTime, sortByPrice} from '../utils/waypoint.js';
import {filter} from '../utils/filter.js';
import LoadingView from '../view/loading-view.js';

export default class TripListPresenter {
  #tripListContainer = null;
  #waypointsModel = null;
  #sortComponent = null;
  #filterModel = null;
  #noWaypointView = null;
  #newWaypointPresenter = null;
  #destinationsModel = null;
  #offersModel = null;

  #tripListComponent = new TripListView();
  #loadingComponent = new LoadingView();
  #waypointsPresenter = new Map();

  #filterType = FilterType.ALL;
  #currentSortType = SortType.DEFAULT;
  #isLoading = true;

  constructor(tripListContainer, waypointsModel, filterModel) {
    this.#tripListContainer = tripListContainer;
    this.#waypointsModel = waypointsModel;
    this.#filterModel = filterModel;
    this.#newWaypointPresenter = new NewWaypointPresenter(this.#tripListComponent.element, this.#handleViewAction);

    this.#waypointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

  }

  get destinations() {
    return this.#waypointsModel.destinations;
  }

  get offers() {
    return this.#waypointsModel.offers;
  }

  get waypoints() {
    this.#filterType = this.#filterModel.filter;
    const waypoints = this.#waypointsModel.waypoints;
    const filteredWaypoints = filter[this.#filterType](waypoints);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return filteredWaypoints.sort(sortByPrice);
      case SortType.TIME:
        return filteredWaypoints.sort(sortByTime);
    }

    return filteredWaypoints;
  }

  init = () => {
    this.#renderBoard();
  };

  createWaypoint = (callback) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    this.#newWaypointPresenter.init(callback);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#tripListContainer, RenderPosition.AFTERBEGIN);
  };

  #renderNoWaypointView = () => {
    this.#noWaypointView = new NoWaypointView(this.#filterType);
    render(this.#noWaypointView, this.#tripListContainer,RenderPosition.AFTERBEGIN);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#tripListContainer, RenderPosition.AFTERBEGIN);
  };

  #renderWaypoint = (waypoint) => {
    const waypointPresenter = new WaypointPresenter(this.#tripListComponent.element, this.#handleViewAction, this.#handleModeChange, this.destinations, this.offers);
    waypointPresenter.init(waypoint);
    this.#waypointsPresenter.set(waypoint.id, waypointPresenter);
  };

  #renderWaypoints = (waypoints) => {
    waypoints.forEach((waypoint) => this.#renderWaypoint(waypoint));
  };

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newWaypointPresenter.destroy();
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

    this.#newWaypointPresenter.destroy();
    this.#waypointsPresenter.forEach((presenter) => presenter.destroy());
    this.#waypointsPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#noWaypointView);
    remove(this.#loadingComponent);

    if (this.#noWaypointView) {
      remove(this.#noWaypointView);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };
}
