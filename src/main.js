import FiltersView from './view/filter-view.js';
import TripListPresenter from './presenter/trip-list-presenter.js';
import {render} from './render.js';
import WaypointsModel from './model/waypoints-model.js';

const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteTripListElement = document.querySelector('.trip-events');

const tripListPresenter = new TripListPresenter();
const waypointsModel = new WaypointsModel();

render(new FiltersView(), siteFilterElement);

tripListPresenter.init(siteTripListElement, waypointsModel);
