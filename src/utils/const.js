const SortType = {
  DEFAULT: 'default',
  TIME: 'time',
  PRICE: 'price',
};

const FilterType = {
  ALL: 'ALL',
  PAST: 'PAST',
  FUTURE: 'FUTURE',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export {SortType, UserAction, UpdateType, FilterType, Method};
