import {render, replace, remove} from '../framework/render.js';
import WaypointView from '../view/waypoint-view.js';
import EditFormView from '../view/edit-form-view.js';
import {UserAction, UpdateType} from '../utils/const.js';
import {isDatesEqual} from '../utils/waypoint.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class WaypointPresenter {
  #waypointComponent = null;
  #waypointEditComponent = null;
  #waypoint = null;
  #waypointListContainer = null;
  #changeData = null;
  #changeMode = null;
  #destinations = null;
  #offers = null;

  #mode = Mode.DEFAULT;

  constructor(waypointListContainer, changeData, changeMode, destinations, offers) {
    this.#waypointListContainer = waypointListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  init = (waypoint) => {
    this.#waypoint = waypoint;

    const prevWaypointComponent = this.#waypointComponent;
    const prevWaypointEditComponent = this.#waypointEditComponent;

    this.#waypointComponent = new WaypointView(this.#waypoint, this.#destinations, this.#offers);
    this.#waypointEditComponent = new EditFormView(this.#waypoint, this.#destinations, this.#offers);

    this.#waypointComponent.setEditClickHandler(this.#handleEditClick);
    this.#waypointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#waypointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#waypointEditComponent.setCloseEditFormClickHandler(this.#handleCloseEditClick);
    this.#waypointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevWaypointComponent === null || prevWaypointEditComponent === null) {
      render(this.#waypointComponent, this.#waypointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#waypointEditComponent, prevWaypointEditComponent);
    }

    remove(prevWaypointComponent);
    remove(prevWaypointEditComponent);
  };

  destroy = () => {
    remove(this.#waypointComponent);
    remove(this.#waypointEditComponent);
  };

  #replacePointToForm = () => {
    replace(this.#waypointEditComponent, this.#waypointComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#waypointComponent, this.#waypointEditComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#waypointEditComponent.reset(this.#waypoint);
      this.#replaceFormToPoint();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleDeleteClick = (waypoint) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      waypoint,
    );
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate =
    !isDatesEqual(this.#waypoint, update) ||
    this.#waypoint.basePrice !== update.basePrice;

    this.#changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this.#replaceFormToPoint();
  };

  #handleCloseEditClick = () => {
    this.#waypointEditComponent.reset(this.#waypoint);
    this.#replaceFormToPoint();
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#waypoint, isFavorite: !this.#waypoint.isFavorite},
    );
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#waypointEditComponent.reset(this.#waypoint);
      this.#replaceFormToPoint();
    }
  };
}
