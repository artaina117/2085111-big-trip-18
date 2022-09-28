import {render, remove, RenderPosition} from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import {UserAction, UpdateType} from '../utils/const.js';
import {nanoid} from 'nanoid';

export default class NewWaypointPresenter {
  #waypointEditComponent = null;
  #waypoint = null;
  #waypointListContainer = null;
  #changeData = null;
  #destroyCallback = null;

  constructor(waypointListContainer, changeData) {
    this.#waypointListContainer = waypointListContainer;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#waypointEditComponent !== null) {
      return;
    }

    this.#waypointEditComponent = new EditFormView();

    this.#waypointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#waypointEditComponent.setCloseEditFormClickHandler(this.#handleDeleteClick);
    this.#waypointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#waypointEditComponent, this.#waypointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  destroy = () => {
    if (this.#waypointEditComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#waypointEditComponent);
    this.#waypointEditComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#waypointEditComponent.reset(this.#waypoint);

    }
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #handleFormSubmit = (waypoint) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...waypoint},
    );
    this.destroy();
  };
}
