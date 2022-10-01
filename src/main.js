import TripListPresenter from './presenter/trip-list-presenter.js';
import WaypointsModel from './model/waypoints-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewWaypointButtonView from './view/new-waypoint-button-view.js';
import {render} from './framework/render.js';
import PointsApiService from './points-api-service.js';
import DestinationsApiService from './destination-api-server.js';
import DestinationsModel from './model/destinatios-model.js';
import OffersApiService from './offers-api-server.js';
import OffersModel from './model/offers.model.js';

const END_POINT = 'https://18.ecmascript.pages.academy/big-trip/';
const AUTHORIZATION = 'Basic n65ldkms54003k';

const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteTripListElement = document.querySelector('.trip-events');
const siteHeaderElement = document.querySelector('.trip-main');

const newWaypointButtonComponent = new NewWaypointButtonView();
const waypointsModel = new WaypointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new DestinationsApiService(END_POINT, AUTHORIZATION));
const offersModel = new OffersModel(new OffersApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const tripListPresenter = new TripListPresenter(siteTripListElement, waypointsModel, filterModel, destinationsModel);
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
waypointsModel.init();
destinationsModel.init();
offersModel.init();
