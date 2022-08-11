import {render} from '../render.js';
import TripListView from '../view/trip-list-view.js';
import CreationFormView from '../view/creation-form-view.js';
import EditFormView from '../view/edit-form-view.js';
import SortView from '../view/sort-view.js';
import WaypointView from '../view/waypoint-view.js';

export default class TripListPresenter {
  tripListComponent = new TripListView();

  init = (tripListContainer) => {
    this.tripListContainer = tripListContainer;

    render(this.tripListComponent, this.tripListContainer);
    render(new SortView(), this.tripListComponent.getElement());
    render(new CreationFormView(), this.tripListComponent.getElement());
    render(new EditFormView(), this.tripListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new WaypointView(), this.tripListComponent.getElement());
    }
  };
}
