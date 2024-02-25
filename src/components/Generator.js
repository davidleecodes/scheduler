import { Button } from "antd";

import { shuffleArray, daysShort } from "./utils";
import dayjs from "dayjs";
import { groupRulesCollection } from "./GroupRulesCollection";

const Generator = ({
  groups,
  codes,
  schedule,
  setuserAdjustedSchedule,
  dateRange,
  employees,
}) => {
  const handleGenerate = () => {
    let employeeShiftCount = {};

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

    // only employees in groups
    const groupEmployeeIds = Object.values(groups).flatMap(
      (group) => group.employees
    );

    const shuffledEmployeeIds = shuffleArray(groupEmployeeIds);
    const updatedUserAdjustedSchedule = {};
    dateRange.forEach((day) => {
      const dayJsDay = dayjs(day.date);
      const prevDay = dayJsDay.subtract(1, "day");
      const prevDayDate = prevDay.format("MM-DD-YYYY");
      const prevDayWeekday = daysShort[prevDay.weekday()];
      const weekYear = dayJsDay.week() + "-" + dayJsDay.year();

      const shuffledCodes = shuffleArray(Object.keys(codes[day.dayOfWeek]));

      shuffledCodes.forEach((codeId) => {
        let index = 0;
        let employeeId = shuffledEmployeeIds[index];
        let isCurrShiftMorning =
          codes[day.dayOfWeek][codeId].shift === "morning";

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
            schedule[employeeId] &&
            schedule[employeeId][day.date]) ||
          (index < shuffledEmployeeIds.length &&
            isCurrShiftMorning &&
            updatedUserAdjustedSchedule[employeeId] &&
            updatedUserAdjustedSchedule[employeeId][prevDayDate] &&
            codes[prevDayWeekday][
              updatedUserAdjustedSchedule[employeeId][prevDayDate]
            ].shift === "evening") ||
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

          updatedUserAdjustedSchedule[employeeId] = {
            ...updatedUserAdjustedSchedule[employeeId],
            [day.date]: codeId,
          };
        }
      });
    });
    setuserAdjustedSchedule(updatedUserAdjustedSchedule);
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
