import ApiService from '../framework/api-service.js';
import {Method} from '../utils/const.js';

export default class PointsApiService extends ApiService {
  get waypoints() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  updateWaypoint = async (point) => {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (waypoint) => {
    const adaptedPoint = {...waypoint,
      'base_price': waypoint.basePrice,
      'date_from': waypoint.dateFrom,
      'date_to': waypoint.dateTo,
      'is_favorite': waypoint.isFavorite,
    };

    // Ненужные ключи мы удаляем
    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  };
}
