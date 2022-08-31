import {render} from '../render.js';
import TripListView from '../view/trip-list-view.js';
import CreationFormView from '../view/creation-form-view.js';
import SortView from '../view/sort-view.js';
import WaypointView from '../view/waypoint-view.js';
import EditFormView from '../view/edit-form-view.js';

export default class TripListPresenter {
  #tripListContainer = null;
  #waypointsModel = null;
  #waypoints = [];

  #tripListComponent = new TripListView();

  init = (tripListContainer, waypointsModel) => {
    this.#tripListContainer = tripListContainer;
    this.#waypointsModel = waypointsModel;
    this.#waypoints = [...this.#waypointsModel.waypoints];

    render(new SortView(), this.#tripListContainer);
    render(new CreationFormView(), this.#tripListContainer);

    render(this.#tripListComponent, this.#tripListContainer);

    for (let i = 0; i < this.#waypoints.length; i++) {
      this.#renderWaypoint(this.#waypoints[i]);
    }
  };

  #renderWaypoint = (waypoint) => {
    const waypointComponent = new WaypointView(waypoint);
    const waypointEditComponent = new EditFormView(waypoint);

    const replacePointToForm = () => {
      this.#tripListComponent.element.replaceChild(waypointEditComponent.element, waypointComponent.element);
    };

    const replaceFormToPoint = () => {
      this.#tripListComponent.element.replaceChild(waypointComponent.element, waypointEditComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    waypointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    waypointEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    waypointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(waypointComponent, this.#tripListComponent.element);
  };
}
