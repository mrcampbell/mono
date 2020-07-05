// https://stackoverflow.com/a/23593099/5194089
export let dateToKey = (date: Date, includeTime: Boolean = false): string => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  let arr = [year, month, day];
  if (includeTime) {
    let nHour = d.getHours(),
      nMinute = d.getMinutes(),
      nSeconds = d.getSeconds(),
      hour = "",
      minute = "",
      second = "";

      hour = (nHour < 10) ? `0${nHour}` : `${nHour}`;
      minute = (nMinute < 10) ? `0${nMinute}` : `${nMinute}`;
      second = (nHour < 10) ? `0${nSeconds}` : `${nSeconds}`;

    arr = arr.concat([hour, minute, second]);
  }

  return arr.join("");
};
