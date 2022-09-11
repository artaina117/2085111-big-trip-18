import {render, replace} from '../framework/render.js';
import TripListView from '../view/trip-list-view.js';
import SortView from '../view/sort-view.js';
import WaypointView from '../view/waypoint-view.js';
import EditFormView from '../view/edit-form-view.js';
import NoWaypointView from '../view/no-waypoints-view.js';

export default class TripListPresenter {
  #tripListContainer = null;
  #waypointsModel = null;
  #waypoints = [];

  #tripListComponent = new TripListView();

  constructor(tripListContainer, waypointsModel) {
    this.#tripListContainer = tripListContainer;
    this.#waypointsModel = waypointsModel;
  }

  init = () => {
    this.#waypoints = [...this.#waypointsModel.waypoints];
    this.#renderWaypointsList();
  };

  #renderWaypointsList = () => {
    if (this.#waypoints.length === 0) {
      render(new NoWaypointView(), this.#tripListContainer);
    } else {
      render(new SortView(), this.#tripListContainer);

      render(this.#tripListComponent, this.#tripListContainer);

      for (let i = 0; i < this.#waypoints.length; i++) {
        this.#renderWaypoint(this.#waypoints[i]);
      }
    }
  };

  #renderWaypoint = (waypoint) => {
    const waypointComponent = new WaypointView(waypoint);
    const waypointEditComponent = new EditFormView(waypoint);

    const replacePointToForm = () => {
      replace(waypointEditComponent, waypointComponent);
    };

    const replaceFormToPoint = () => {
      replace(waypointComponent, waypointEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    waypointComponent.setEditClickHandler(() => {
      replacePointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    waypointEditComponent.setFormSubmitHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    waypointEditComponent.setSaveEditFormClickHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(waypointComponent, this.#tripListComponent.element);
  };
}
