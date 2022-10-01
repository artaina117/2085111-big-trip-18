import ApiService from './framework/api-service.js';

export default class PointsApiService extends ApiService {
  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }
}
