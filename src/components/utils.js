import dayjs from "dayjs";
const weekOfYear = require("dayjs/plugin/weekOfYear");
dayjs.extend(weekOfYear);

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

const daysShortLong = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
  Add: "Additional",
};

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

/**
 *
 * @param {string[]} array  array to be shuffled
 * @returns
 */
const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

export { daysShort, iterateArrayId, daysShortLong, shuffleArray };
