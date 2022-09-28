import TripListPresenter from './presenter/trip-list-presenter.js';
import WaypointsModel from './model/waypoints-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteTripListElement = document.querySelector('.trip-events');

const waypointsModel = new WaypointsModel();
const filterModel = new FilterModel();
const tripListPresenter = new TripListPresenter(siteTripListElement, waypointsModel, filterModel);
const filterPresenter = new FilterPresenter(siteFilterElement, filterModel, waypointsModel);

tripListPresenter.init();
filterPresenter.init();
