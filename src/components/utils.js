import dayjs from "dayjs";

const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);

const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrBefore);

const isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

const weekday = require("dayjs/plugin/weekday");
dayjs.extend(weekday);

const updateLocale = require("dayjs/plugin/updateLocale");
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekStart: 1,
});

const daysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 *
 * @param {string[]} array array of current ids
 * @param {string} startKey what the id should starts with
 * @returns {string} startKey + (last number +1)
 */

function iterateArrayId(array, startKey) {
  if (!array || array.length === 0) return `${startKey}1`;
  const string = array[array.length - 1];
  const match = string.match(/([a-zA-Z]+)([0-9]+)/);
  if (match) {
    // const lettersPart = match[1];
    const numbersPart = match[2];
    return [startKey, parseInt(numbersPart) + 1].join("");
  }
}

export { daysShort, iterateArrayId };
