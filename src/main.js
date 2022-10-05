import TripListPresenter from './presenter/trip-list-presenter.js';
import WaypointsModel from './model/waypoints-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewWaypointButtonView from './view/new-waypoint-button-view.js';
import {render} from './framework/render.js';
import PointsApiService from './api-service/points-api-service.js';
import DestinationsApiService from './api-service/destinations-api-service.js';
import OffersApiService from './api-service/offers-api-service.js';

const END_POINT = 'https://18.ecmascript.pages.academy/big-trip/';
const AUTHORIZATION = 'Basic n65ldkms54003k';

const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteTripListElement = document.querySelector('.trip-events');
const siteHeaderElement = document.querySelector('.trip-main');

const newWaypointButtonComponent = new NewWaypointButtonView();
const destinationsApiService = new DestinationsApiService(END_POINT, AUTHORIZATION);
const offersApiService = new OffersApiService(END_POINT, AUTHORIZATION);
const waypointsModel = new WaypointsModel(new PointsApiService(END_POINT, AUTHORIZATION), destinationsApiService, offersApiService);
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

tripListPresenter.init();
filterPresenter.init();
waypointsModel.init().finally (() => {
  render(newWaypointButtonComponent, siteHeaderElement);
  newWaypointButtonComponent.setClickHandler(handleNewWaypointButtonClick);
});
