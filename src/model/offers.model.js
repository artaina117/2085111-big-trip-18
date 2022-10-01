import Observable from '../framework/observable.js';
import {UpdateType} from '../utils/const.js';

export default class OffersModel extends Observable {
  #offersApiService = null;
  #offers = [];

  constructor(offersApiService) {
    super();
    this.#offersApiService = offersApiService;
  }

  init = async () => {
    try {
      this.#offers = await this.#offersApiService.offers;
    } catch(err) {
      this.#offers = [];
    }

    this._notify(UpdateType.INIT);
  };

  get offers() {
    return this.#offers;
  }
}
