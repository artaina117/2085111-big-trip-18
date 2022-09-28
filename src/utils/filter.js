import dayjs from 'dayjs';
import {FilterType} from './const.js';

const isFuture = (waypoint) => dayjs(waypoint.dateFrom).diff(dayjs(), 'second') >= 0;
const isPast = (waypoint) => dayjs(dayjs()).diff(waypoint.dateTo, 'second') >= 0;

const filter = {
  [FilterType.ALL]: (waypoints) => (waypoints),
  [FilterType.PAST]: (waypoints) => waypoints.filter((waypoint) => isPast(waypoint)),
  [FilterType.FUTURE]: (waypoints) => waypoints.filter((waypoint) => isFuture(waypoint)),
};

export {filter};
