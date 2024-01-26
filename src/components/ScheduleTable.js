import React, { useEffect, useState } from "react";
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
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);

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
  const [scheduleMappedCodes, setScheduleMappedCodes] = useState({});

  const handleCellChange = (event, date, employeeId) => {
    const codeId = event.target.value;
    const schDay = scheduleMappedCodes[date];

    const newSchedule = { ...userAdjustedSchedule };

    //swap codeId
    if (schDay && schDay[codeId] && !codes.Add[codeId]) {
      const swapEmployeeId = schDay[codeId];
      const { [date]: removeDate, ...rest } = newSchedule[swapEmployeeId];
      newSchedule[swapEmployeeId] = rest;
    }
    newSchedule[employeeId] = newSchedule[employeeId]
      ? newSchedule[employeeId]
      : {};
    newSchedule[employeeId][date] = codeId;
    setuserAdjustedSchedule(newSchedule);
  };

  useEffect(() => {
    let scheduleMappedCodes = {};
    Object.entries(userAdjustedSchedule).forEach(([employeeId, employee]) => {
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
  }, [userAdjustedSchedule]);

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
          }
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees, endDate, groups, startDate]);

  const codeSelect = (employeeId, day, codes) => {
    const schDay = scheduleMappedCodes[day.date];
    const dayOfWeek = day.dayOfWeek;
    const highLight =
      (dayOfWeek === "Sat" || dayOfWeek === "Sun") &&
      schedule[employeeId] &&
      !schedule[employeeId][day.date];

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
            (userAdjustedSchedule[employeeId] &&
              userAdjustedSchedule[employeeId][day.date]) ||
            (schedule[employeeId] && schedule[employeeId][day.date]) ||
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
          {schedule[employeeId] && schedule[employeeId][day.date] && (
            <MenuItem value=" ">" "</MenuItem>
          )}
          {Object.entries(codes[day.dayOfWeek]).map(([codeId, code]) => (
            <MenuItem
              key={codeId}
              value={codeId}
              style={schDay && schDay[codeId] ? { color: "lightgrey" } : {}}
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

  const dayStack = (date) => {
    const splitDate = date.split("-");
    return (
      <Box
        sx={{
          // display: { xs: "block", sm: "block", md: "block", lg: "flex" },
          display: "flex",
          flexDirection: "column",
        }}
        justifyContent="center"
        alignItems="center"
      >
        <Box>{splitDate[0]}</Box>
        {/* <Box
          sx={{ display: { xs: "none", sm: "none", md: "none", lg: "block" } }}
        >
          -
        </Box> */}
        <Box>{splitDate[1]}</Box>
      </Box>
    );
  };

  const codesMatch = (day) => {
    const scheduleDayCodes = Object.keys(scheduleMappedCodes[day.date]);
    const dayCodes = Object.keys(codes[day.dayOfWeek]);
    return dayCodes.every((c) => scheduleDayCodes.includes(c));
  };

  return (
    <>
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
                      scheduleMappedCodes[day.date] && codesMatch(day)
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
                        {dateRange.map((day) =>
                          codeSelect(employeeId, day, codes, day.date)
                        )}
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

export default ScheduleTable;
