import React, { useEffect, useState, memo, useCallback } from "react";
import { Sheet as Paper } from "@mui/joy";

import {
  Box,
  Grid,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TableBody,
  TableCell,
  Select,
  MenuItem,
} from "@mui/material";
import { groupRulesCollection } from "./GroupRulesCollection";
import { yellow } from "@mui/material/colors";
import dayjs from "dayjs";

// {emp1:{
//     date:'code'
// }}

const ScheduleTable = ({
  dateRange,
  startDate,
  endDate,
  employees,
  scheduleRange,
  groups,
  codes,
  schedule,
  setSchedule,
  userAdjustedSchedule,
  setuserAdjustedSchedule,
  employeeCodeCount,
}) => {
  useEffect(() => {
    const newSchedule = { ...schedule };
    Object.values(groups).forEach((group) => {
      group.employees &&
        group.employees.forEach((employeeId) => {
          const employee = employees[employeeId];
          if (employee) {
            if (employee.offDays) {
              Object.entries(employee.offDays).forEach(([offDayId, offDay]) => {
                const offDayStart = dayjs(offDay.start);
                const offDayEnd = dayjs(offDay.end);

                if (
                  startDate.isSameOrBefore(offDayStart) ||
                  endDate.isSameOrAfter(offDayEnd)
                ) {
                  let currentDate = offDayStart;
                  while (currentDate.isSameOrBefore(offDayEnd)) {
                    const formattedDate = currentDate.format("MM-DD-YYYY");
                    newSchedule[formattedDate] = {
                      ...newSchedule[formattedDate],
                      [employeeId]: "v",
                    };

                    currentDate = currentDate.add(1, "day");
                  }

                  setSchedule(newSchedule);
                }
              });
            }

            // if (employee.groupRules) {
            //   Object.entries(employee.groupRules).forEach(
            //     ([groupRuleId, employeeGroupRule]) => {
            //       if (group.groupRules && group.groupRules[groupRuleId]) {
            //         const employeeGroupRuleData = employeeGroupRule.data;
            //         const groupRule = groupRulesCollection[groupRuleId];
            //         const groupGroupRuleData =
            //           group.groupRules[groupRuleId].data;

            //         if (Object.keys(groupGroupRuleData).length === 0) return;
            //         const result = groupRule.group.onChange(
            //           startDate,
            //           endDate,
            //           employeeGroupRuleData,
            //           groupGroupRuleData
            //         );
            //         newSchedule[employeeId] = {
            //           ...newSchedule[employeeId],
            //           ...result,
            //         };

            //         setSchedule(newSchedule);
            //       }
            //     }
            //   );
            // } else {
            //   newSchedule[employeeId] = {};
            //   setSchedule(newSchedule);
            // }
          }
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees, endDate, groups, startDate]);

  // const codesMatch = (day) => {
  //   const scheduleDayCodes = Object.values(userAdjustedSchedule[day.date]);
  //   const dayCodes = Object.keys(codes[day.dayOfWeek]);
  //   return dayCodes.every((c) => scheduleDayCodes.includes(c));
  // };

  const groupEmployeesIdArray = Object.values(groups).flatMap(
    (group) => group.employees
  );
  // console.log(groupEmployeesIdArray, schedule);
  console.log("table");
  return (
    <>
      <Grid container sx={{ flexWrap: "nowrap" }}>
        {dateRange.map((day) => (
          <Grid
            container
            direction="row"
            key={day.date}
            sx={{
              display: "flex !important",
              flexDirection: "row",
            }}
          >
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: 30,
              }}
            >
              <ColumnData
                day={day}
                groupEmployeesIdArray={groupEmployeesIdArray}
                codes={codes}
                schedule={schedule}
                userAdjustedSchedule={userAdjustedSchedule}
                setuserAdjustedSchedule={setuserAdjustedSchedule}
              />
            </Grid>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

const ColumnData = ({
  day,
  groupEmployeesIdArray,
  codes,
  schedule,
  userAdjustedSchedule,
  setuserAdjustedSchedule,
  // handleCellChange,
}) => {
  const handleCellChange = useCallback(
    (event, date, employeeId) => {
      const codeId = event.target.value;
      const schDay = userAdjustedSchedule[date];
      const codeIndex = schDay ? Object.values(schDay).indexOf(codeId) : -1;

      setuserAdjustedSchedule((prev) => {
        const newSchedule = { ...prev };
        //swap codeId
        if (codeIndex !== -1 && !codes.Add[codeId]) {
          const swapEmployeeId = Object.keys(schDay)[codeIndex];
          delete newSchedule[date][swapEmployeeId];
        }

        newSchedule[date] = newSchedule[date] ? { ...newSchedule[date] } : {};
        newSchedule[date][employeeId] = codeId;
        console.log(newSchedule);
        return newSchedule;
      });
    },
    [codes.Add, setuserAdjustedSchedule, userAdjustedSchedule]
  );
  const splitDate = day.date.split("-");
  // console.log("column");

  return (
    <>
      <div
        style={{
          // border:
          //   scheduleMappedCodes[day.date] && codesMatch(day)
          //     ? "lightgreen 3px solid"
          //     : "",
          // borderRadius: 2,
          backgroundColor:
            day.dayOfWeek === "Sun" || day.dayOfWeek === "Sat"
              ? "#FFC0CB"
              : "transparent",
        }}
      >
        <div>{splitDate[0]}</div>
        <div>{splitDate[1]}</div>
        <div>{day.dayOfWeek}</div>
      </div>
      {groupEmployeesIdArray.map((employeeId) => (
        <div key={employeeId}>
          <CodeSelect
            employeeId={employeeId}
            day={day}
            codes={codes}
            daySchedule={schedule[day.date]}
            dayUserAdjustedSchedule={userAdjustedSchedule[day.date]}
            handleCellChange={handleCellChange}
          />
        </div>
      ))}
    </>
  );
};
const CodeSelect = memo(
  ({
    employeeId,
    day,
    codes,
    daySchedule,
    dayUserAdjustedSchedule,
    handleCellChange,
  }) => {
    const dayOfWeek = day.dayOfWeek;
    const highLight =
      (dayOfWeek === "Sat" || dayOfWeek === "Sun") &&
      ((daySchedule && !daySchedule[employeeId]) || !daySchedule);

    // const dayCodes = dayUserAdjustedSchedule
    //   ? Object.values(dayUserAdjustedSchedule)
    //   : [];

    return (
      <div
        key={day.date}
        align="center"
        style={{
          padding: 1,
          backgroundColor: highLight ? yellow[200] : "initial",
        }}
      >
        <Select
          labelId="demo-simple-select-standard-label"
          value={
            (dayUserAdjustedSchedule && dayUserAdjustedSchedule[employeeId]) ||
            (daySchedule && daySchedule[employeeId]) ||
            ""
          }
          sx={{
            "& div.MuiSelect-select.MuiInputBase-input": {
              padding: 0,
            },
            "& svg": { display: "none" },
          }}
          onChange={(event) => handleCellChange(event, day.date, employeeId)}
          variant="standard"
        >
          {daySchedule && daySchedule[employeeId] && (
            <MenuItem value=" ">" "</MenuItem>
          )}
          {Object.entries(codes[day.dayOfWeek]).map(([codeId, code]) => (
            <MenuItem
              key={codeId}
              value={codeId}
              // style={
              //   dayCodes && dayCodes.includes(codeId)
              //     ? { color: "lightgrey" }
              //     : {}
              // }
            >
              {code.name}
            </MenuItem>
          ))}
          {Object.entries(codes.Add).map(([codeId, code]) => (
            <MenuItem key={codeId} value={codeId}>
              {code.name}
            </MenuItem>
          ))}
          {Object.entries(codes.Internal).map(([codeId, code]) => (
            <MenuItem key={codeId} value={codeId} style={{ display: "none" }}>
              {code.name}
            </MenuItem>
          ))}

          <MenuItem value="">clear</MenuItem>
        </Select>
      </div>
    );
  }
);
export default ScheduleTable;
