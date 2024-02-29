import { Button } from "antd";

import { shuffleArray, daysShort } from "./utils";
import dayjs from "dayjs";
import { groupRulesCollection } from "./GroupRulesCollection";

const generateSchedule = (dateRange, groupEmployeeIds, data) => {
  // let employeeShiftCount = {};
  const {
    employeesWithGroupData,
    codes,
    schedule,
    employeeShiftCount,
    codesPerDay,
  } = data;

  // only employees in groups
  // const groupEmployeeIds = Object.values(groups).flatMap(
  //   (group) => group.employees
  // );

  const shuffledEmployeeIds = shuffleArray(groupEmployeeIds);
  // const updatedUserAdjustedSchedule = {};
  dateRange.forEach((day) => {
    const dayJsDay = dayjs(day.date);
    const prevDay = dayJsDay.subtract(1, "day");
    const prevDayDate = prevDay.format("MM-DD-YYYY");
    const prevDayWeekday = daysShort[prevDay.weekday()];
    const weekYear = dayJsDay.week() + "-" + dayJsDay.year();
    const nextDay = dayJsDay.add(1, "day");
    const nextDayDate = nextDay.format("MM-DD-YYYY");
    const nextDayWeekday = daysShort[nextDay.weekday()];

    let filterCodes = Object.keys(codes[day.dayOfWeek]).filter((codeId) => {
      if (codesPerDay[day.date] && codesPerDay[day.date].includes(codeId))
        return false;
      return true;
    });
    const shuffledCodes = shuffleArray(filterCodes);

    shuffledCodes.forEach((codeId) => {
      let index = 0;
      let employeeId = shuffledEmployeeIds[index];
      let isCurrShiftMorning = codes[day.dayOfWeek][codeId].shift === "morning";
      let isCurrShiftEvening = codes[day.dayOfWeek][codeId].shift === "evening";

      function genLogicCheck(employeeId) {
        const empGroupData = employeesWithGroupData[employeeId]?.groupData;
        let isValid = true;

        if (empGroupData) {
          isValid = Object.keys(empGroupData)
            .map((rule) => {
              return groupRulesCollection[rule].group.genLogic(
                employeeId,
                employeeShiftCount,
                {
                  ...empGroupData[rule].data,
                  weekYear: weekYear,
                }
              );
            })
            .every((val) => val);
        }
        return isValid;
      }

      // while employee on layer 1 has something, or if on layer 2 employee had night day before and current code is day shift,  pick another employee
      while (
        (index < shuffledEmployeeIds.length &&
          data.updatedUserAdjustedSchedule[employeeId] &&
          data.updatedUserAdjustedSchedule[employeeId][day.date]) ||
        (index < shuffledEmployeeIds.length &&
          schedule[employeeId] &&
          schedule[employeeId][day.date]) ||
        (index < shuffledEmployeeIds.length &&
          isCurrShiftMorning &&
          data.updatedUserAdjustedSchedule[employeeId] &&
          data.updatedUserAdjustedSchedule[employeeId][prevDayDate] &&
          codes[prevDayWeekday][
            data.updatedUserAdjustedSchedule[employeeId][prevDayDate]
          ].shift === "evening") ||
        (index < shuffledEmployeeIds.length &&
          isCurrShiftEvening &&
          data.updatedUserAdjustedSchedule[employeeId] &&
          data.updatedUserAdjustedSchedule[employeeId][nextDayDate] &&
          codes[nextDayWeekday][
            data.updatedUserAdjustedSchedule[employeeId][nextDayDate]
          ].shift === "morning") ||
        (index < shuffledEmployeeIds.length && !genLogicCheck(employeeId))
      ) {
        index++;
        employeeId = shuffledEmployeeIds[index];
      }
      if (index <= shuffledEmployeeIds.length - 1) {
        employeeId = shuffledEmployeeIds[index];

        let removedEmployee = shuffledEmployeeIds.splice(index, 1);
        shuffledEmployeeIds.push(removedEmployee[0]);

        if (!employeeShiftCount[employeeId])
          employeeShiftCount[employeeId] = {};
        employeeShiftCount[employeeId][weekYear] = employeeShiftCount[
          employeeId
        ][weekYear]
          ? employeeShiftCount[employeeId][weekYear] + 1
          : 1;

        codesPerDay[day.date] = codesPerDay[day.date]
          ? [...codesPerDay[day.date], codeId]
          : [codeId];

        console.log(day.date, employeeShiftCount[employeeId][weekYear]);
        data.updatedUserAdjustedSchedule[employeeId] = {
          ...data.updatedUserAdjustedSchedule[employeeId],
          [day.date]: codeId,
        };
      }
    });
  });
  // setuserAdjustedSchedule(updatedUserAdjustedSchedule);
};

const Generator = ({
  groups,
  codes,
  schedule,
  setuserAdjustedSchedule,
  dateRange,
  employees,
  startDate,
  endDate,
}) => {
  const handleGenerate = () => {
    let employeesWithGroupData = Object.values(groups).flatMap((group) => {
      let groupRulesAdd = {};

      if (group.groupRules) {
        let rules = Object.keys(group.groupRules).filter(
          (rule) => groupRulesCollection[rule].group.genGroupToEmployee
        );
        rules.forEach((rule) => {
          groupRulesAdd[rule] = group.groupRules[rule];
        });
      }
      return group.employees.map((employeeId) => [
        employeeId,
        {
          ...employees[employeeId],
          groupData: groupRulesAdd,
        },
      ]);
    });
    employeesWithGroupData = Object.fromEntries(employeesWithGroupData);
    const data = {
      updatedUserAdjustedSchedule: {},
      employeeShiftCount: {},
      codesPerDay: {},
      employeesWithGroupData,
      codes,
      schedule,
    };

    let employeeAlwaysShift = {};
    Object.values(groups).forEach((group) => {
      group.employees &&
        group.employees.forEach((employeeId) => {
          employees[employeeId].shiftDays &&
            Object.entries(employees[employeeId].shiftDays).forEach(
              ([day, status]) => {
                if (status === "always") {
                  employeeAlwaysShift[day] = employeeAlwaysShift[day]
                    ? [...employeeAlwaysShift[day], employeeId]
                    : [employeeId];
                }
              }
            );
        });
    });
    console.log(employeeAlwaysShift);

    let currentDate = startDate;

    let datesOfDateRange = {};
    while (currentDate.isSameOrBefore(endDate)) {
      for (let idx = 0; idx < 7; idx++) {
        let date = currentDate.day(idx);
        let dateFormated = date.format("MM-DD-YYYY");
        let day = date.format("ddd");
        let obj = { date: dateFormated, dayOfWeek: day };
        datesOfDateRange[day] = datesOfDateRange[day]
          ? [...datesOfDateRange[day], obj]
          : [obj];
      }
      currentDate = currentDate.add(1, "week");
    }
    console.log(datesOfDateRange);
    Object.entries(employeeAlwaysShift).forEach(([day, employees]) => {
      console.log(datesOfDateRange[day]);
      generateSchedule(datesOfDateRange[day], employees, data);
    });

    // console.log(data.employeeShiftCount);
    // console.log(data.updatedUserAdjustedSchedule);
    // console.log(data.codesPerDay);
    const groupEmployeeIds = Object.values(groups).flatMap(
      (group) => group.employees
    );
    generateSchedule(
      [...datesOfDateRange.Sat, ...datesOfDateRange.Sun],
      groupEmployeeIds,
      data
    );

    generateSchedule(dateRange, groupEmployeeIds, data);
    setuserAdjustedSchedule(data.updatedUserAdjustedSchedule);
  };

  return (
    <>
      <Button type="primary" onClick={handleGenerate}>
        Generate
      </Button>
    </>
  );
};

export default Generator;
