import dayjs from 'dayjs';

const MINUTES_PER_HOUR = 60;
const TIME_COUNT = 10;

const humanizeTime = (date) => dayjs(date).format('HH:mm');
const humanizeDate = (date) => dayjs(date).format('MMM D');
const humanizeFullDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const compareTime = (dateFrom, dateTo) => {
  const date1 = dayjs(dateFrom);
  const date2 = dayjs(dateTo);
  const diff = date2.diff(date1, 'minutes');

  let duration = '';

  if (diff >= MINUTES_PER_HOUR) {
    const hours = Math.trunc(diff / MINUTES_PER_HOUR);
    if (hours < TIME_COUNT) {
      duration += '0';
    }
    duration += `${hours}H `;
  }

  const minutes = diff % MINUTES_PER_HOUR;
  if (minutes < TIME_COUNT) {
    duration += '0';
  }
  duration += `${minutes}M`;

  return duration;
};

export {humanizeDate, humanizeTime, compareTime, humanizeFullDate};
