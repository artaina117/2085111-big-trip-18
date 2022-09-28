import TripListPresenter from './presenter/trip-list-presenter.js';
import WaypointsModel from './model/waypoints-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewWaypointButtonView from './view/new-waypoint-button-view.js';
import {render} from './framework/render.js';

const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteTripListElement = document.querySelector('.trip-events');
const siteHeaderElement = document.querySelector('.trip-main');

const newWaypointButtonComponent = new NewWaypointButtonView();
const waypointsModel = new WaypointsModel();
const filterModel = new FilterModel();
const tripListPresenter = new TripListPresenter(siteTripListElement, waypointsModel, filterModel);
const filterPresenter = new FilterPresenter(siteFilterElement, filterModel, waypointsModel);

const handleNewWaypointFormClose = () => {
  newWaypointButtonComponent.element.disabled = false;
};

const handleNewWaypointButtonClick = () => {
  tripListPresenter.createWaypoint(handleNewWaypointFormClose);
  newWaypointButtonComponent.element.disabled = true;
};

render(newWaypointButtonComponent, siteHeaderElement);
newWaypointButtonComponent.setClickHandler(handleNewWaypointButtonClick);

tripListPresenter.init();
filterPresenter.init();
