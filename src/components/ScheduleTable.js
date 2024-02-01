import React, { useEffect, useState, memo, useCallback } from "react";
import { Sheet as Paper } from "@mui/joy";

import {
  Box,
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
  groups,
  codes,
  schedule,
  setSchedule,
  userAdjustedSchedule,
  setuserAdjustedSchedule,
  employeeCodeCount,
  daysOffPerWeek,
}) => {
  const [userScheduleMappedCodes, setUserScheduleMappedCodes] = useState({});
  const [scheduleMappedCodes, setScheduleMappedCodes] = useState({});
  const [error, setError] = useState();

  const getCodeName = (weekDay, codeId) => {
    const name = codes[weekDay][codeId]
      ? codes[weekDay][codeId].name
      : codes.Add[codeId] && codes.Add[codeId].name;
    return name;
  };

  const handleCellChange = (event, date, employeeId) => {
    const codeId = event.target.value;
    const schDay = userScheduleMappedCodes[date];
    const weekDay = dayjs(date).format("ddd");
    setError("");
    const newSchedule = { ...userAdjustedSchedule };

    //check validation for offDays per week
    if (getCodeName(weekDay, codeId) === "v") {
      const dayjsDate = dayjs(date);
      let codesArray = [];
      let codesObj = {};
      //0= sun, sat =6
      for (let i = 0; i <= 6; i++) {
        const currDate = dayjsDate.day(i).format("MM-DD-YYYY");
        const currWeekDay = dayjsDate.day(i).format("ddd");
        const currUserSchDay = userScheduleMappedCodes[currDate];

        if (currUserSchDay) {
          const codeNames = Object.keys(currUserSchDay).flatMap((codeId) => {
            const name = getCodeName(currWeekDay, codeId);
            const nameArray = Array(currUserSchDay[codeId].length).fill(name);
            return nameArray;
          });
          codesArray.push(...codeNames);
        }
        // currUserSchDay && codesArray.push(...Object.keys(currUserSchDay));
        const currSchDay = scheduleMappedCodes[currDate];
        currSchDay && codesArray.push(...Object.keys(currSchDay));
      }
      codesArray.forEach((code) => {
        codesObj[code] = codesObj[code] ? codesObj[code] + 1 : 1;
      });
      // console.log(codesObj, scheduleMappedCodes);

      if (codesObj.v >= daysOffPerWeek) {
        setError(
          `max num of days off per week reached 
        ${dayjsDate.day(0).format("MM-DD-YYYY")} - 
        ${dayjsDate.day(6).format("MM-DD-YYYY")}`
        );
        return;
      }
    }
    //swap codeId
    if (schDay && schDay[codeId] && !codes.Add[codeId]) {
      const swapEmployeeId = schDay[codeId];
      // const { [date]: removeDate, ...rest } = newSchedule[swapEmployeeId];
      // newSchedule[swapEmployeeId] = rest;
      delete newSchedule[swapEmployeeId][date];
    }
    newSchedule[employeeId] = newSchedule[employeeId]
      ? { ...newSchedule[employeeId] }
      : {};
    newSchedule[employeeId][date] = codeId;
    setuserAdjustedSchedule(newSchedule);
  };

  useEffect(() => {
    let userScheduleMappedCodes = {};
    Object.entries(userAdjustedSchedule).forEach(([employeeId, employee]) => {
      Object.entries(employee).forEach(([date, codeId]) => {
        if (codeId) {
          userScheduleMappedCodes[date] = {
            ...userScheduleMappedCodes[date],
            [codeId]:
              userScheduleMappedCodes[date] &&
              userScheduleMappedCodes[date][codeId]
                ? [...userScheduleMappedCodes[date][codeId], employeeId]
                : [employeeId],
          };
        }
      });
    });
    setUserScheduleMappedCodes(userScheduleMappedCodes);
  }, [userAdjustedSchedule]);

  useEffect(() => {
    let scheduleMappedCodes = {};
    Object.entries(schedule).forEach(([employeeId, employee]) => {
      Object.entries(employee).forEach(([date, codeId]) => {
        if (codeId) {
          scheduleMappedCodes[date] = {
            ...scheduleMappedCodes[date],
            [codeId]: employeeId,
          };
        }
      });
    });
    setScheduleMappedCodes(scheduleMappedCodes);
  }, [schedule]);

  useEffect(() => {
    const newSchedule = { ...schedule };
    Object.values(groups).forEach((group) => {
      group.employees &&
        group.employees.forEach((employeeId) => {
          const employee = employees[employeeId];
          if (employee) {
            if (employee.groupRules) {
              Object.entries(employee.groupRules).forEach(
                ([groupRuleId, employeeGroupRule]) => {
                  if (group.groupRules && group.groupRules[groupRuleId]) {
                    const employeeGroupRuleData = employeeGroupRule.data;
                    const groupRule = groupRulesCollection[groupRuleId];
                    const groupGroupRuleData =
                      group.groupRules[groupRuleId].data;

                    if (Object.keys(groupGroupRuleData).length === 0) return;
                    const result = groupRule.group.onChange(
                      startDate,
                      endDate,
                      employeeGroupRuleData,
                      groupGroupRuleData
                    );
                    //Todo: ...rest is overwriting offDays
                    newSchedule[employeeId] = {
                      ...newSchedule[employeeId],
                      ...result,
                    };

                    setSchedule(newSchedule);
                  }
                }
              );
            } else {
              newSchedule[employeeId] = {};
              setSchedule(newSchedule);
            }

            if (employee.offDays) {
              Object.entries(employee.offDays).forEach(([offDayId, offDay]) => {
                const offDayStart = dayjs(offDay[0]);
                const offDayEnd = dayjs(offDay[1]);

                if (
                  startDate.isSameOrBefore(offDayStart) ||
                  endDate.isSameOrAfter(offDayEnd)
                ) {
                  let currentDate = offDayStart;
                  while (currentDate.isSameOrBefore(offDayEnd)) {
                    const formattedDate = currentDate.format("MM-DD-YYYY");
                    newSchedule[employeeId] = {
                      ...newSchedule[employeeId],
                      [formattedDate]: "v",
                    };

                    currentDate = currentDate.add(1, "day");
                  }

                  setSchedule(newSchedule);
                }
              });
            }
          }
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees, endDate, groups, startDate]);

  const dayStack = (date) => {
    const splitDate = date.split("-");
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
        justifyContent="center"
        alignItems="center"
      >
        <Box>{splitDate[0]}</Box>
        <Box>{splitDate[1]}</Box>
      </Box>
    );
  };

  const codesMatch = (day) => {
    const scheduleDayCodes = Object.keys(userScheduleMappedCodes[day.date]);
    const dayCodes = Object.keys(codes[day.dayOfWeek]);
    return dayCodes.every((c) => scheduleDayCodes.includes(c));
  };

  // console.log("table");
  return (
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <TableContainer component={Paper}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {/*  */}
              <TableCell padding="none"></TableCell>
              <TableCell padding="none"></TableCell>
              {/*  */}
              {dateRange.map((day) => (
                <TableCell
                  key={day.date}
                  align="center"
                  padding="none"
                  style={{
                    border:
                      userScheduleMappedCodes[day.date] && codesMatch(day)
                        ? "lightgreen 3px solid"
                        : "",
                    borderRadius: 2,
                    backgroundColor:
                      day.dayOfWeek === "Sun" || day.dayOfWeek === "Sat"
                        ? "#FFC0CB"
                        : "transparent",
                  }}
                >
                  {dayStack(day.date)}

                  {day.dayOfWeek}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {Object.values(groups).map((group) => (
            <TableBody key={group.name}>
              {group.employees &&
                group.employees.map((employeeId, idx) => {
                  if (employees[employeeId]) {
                    return (
                      <TableRow key={employeeId}>
                        {idx === 0 && (
                          <TableCell
                            rowSpan={group.employees.length}
                            style={{ padding: 1 }}
                          >
                            <div
                              style={{
                                writingMode: "vertical-lr",
                                transform: " rotate(180deg)",
                              }}
                            >
                              {group.name}
                            </div>
                          </TableCell>
                        )}

                        <TableCell padding="none">
                          {employees[employeeId].name}
                        </TableCell>
                        {dateRange.map((day) => (
                          <React.Fragment key={day.date}>
                            <CodeSelect
                              employeeId={employeeId}
                              day={day}
                              codes={codes}
                              dayScheduleMappedCodes={
                                userScheduleMappedCodes[day.date]
                              }
                              empSchedule={schedule[employeeId]}
                              empUserAdjustedSchedule={
                                userAdjustedSchedule[employeeId]
                              }
                              handleCellChange={handleCellChange}
                            />
                          </React.Fragment>
                        ))}
                        <TableCell>
                          <div style={{ whiteSpace: "nowrap" }}>
                            {employeeCodeCount(employeeId)}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  } else return <></>;
                })}
            </TableBody>
          ))}
        </Table>
      </TableContainer>
    </>
  );
};

const CodeSelect = ({
  employeeId,
  day,
  codes,
  dayScheduleMappedCodes,
  empSchedule,
  empUserAdjustedSchedule,
  handleCellChange,
}) => {
  // const schDay = userScheduleMappedCodes[day.date];
  const dayOfWeek = day.dayOfWeek;
  const highLight =
    (dayOfWeek === "Sat" || dayOfWeek === "Sun") &&
    empSchedule &&
    !empSchedule[day.date];
  // console.log("cell");
  return (
    <TableCell
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
          (empUserAdjustedSchedule && empUserAdjustedSchedule[day.date]) ||
          (empSchedule && empSchedule[day.date]) ||
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
        {empSchedule && empSchedule[day.date] && (
          <MenuItem value=" ">" "</MenuItem>
        )}
        {Object.entries(codes[day.dayOfWeek]).map(([codeId, code]) => (
          <MenuItem
            key={codeId}
            value={codeId}
            style={
              dayScheduleMappedCodes && dayScheduleMappedCodes[codeId]
                ? { color: "lightgrey" }
                : {}
            }
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
    </TableCell>
  );
};

export default ScheduleTable;
