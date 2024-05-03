const parseDate = (date: Date): string => {
  let month: string = `${date.getMonth() + 1}`;
  let day: string = `${date.getDate()}`;
  const year: number = date.getFullYear();
  let hour: string = `${date.getHours()}`;
  let minute: string = `${date.getMinutes()}`;

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;
  if (hour.length < 2) hour = `0${hour}`;
  if (minute.length < 2) minute = `0${minute}`;

  const dateStr: string = [year, month, day].join('-');
  const time: string = [hour, minute].join(':');

  return `${dateStr} ${time}`;
};

/**
 * Convert a Unix timestamp into a human-readable datetime (local time zone)
 * @param  {string|number} timestamp
 * @return {string}
 */
const parseUnixTimestamp = (timestamp: string | number): string => {
  timestamp = parseInt(`${timestamp}`);
  const d = new Date(timestamp);
  return formatDate(d);
};

const formatDate = (d: Date): string => {
  let month: string = `${d.getMonth() + 1}`;
  let day: string = `${d.getDate()}`;
  const year: number = d.getFullYear();
  let hour: string = `${d.getHours()}`;
  let minute: string = `${d.getMinutes()}`;

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;
  if (hour.length < 2) hour = `0${hour}`;
  if (minute.length < 2) minute = `0${minute}`;

  const date: string = [year, month, day].join('-');
  const time: string = [hour, minute].join(':');

  return `${date} ${time}`;
};

export { parseDate, parseUnixTimestamp, formatDate };
