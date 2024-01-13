import React, { useMemo } from "react";
import dayjs from "dayjs";
import { Grid } from "@mui/material";

import ScheduleTable from "./ScheduleTable";
import ScheduleRange from "./ScheduleRange";
import ExportCsv from "./ExportCsv";

// const dateRangeInt = [
//     {
//       date: "12-12",
//       dayOfWeek: "Wed",
//     },
//   ];
const TableSection = ({
  scheduleRange,
  setScheduleRange,
  employees,
  groups,
  codes,
  schedule,
  setSchedule,
  userAdjustedSchedule,
  setuserAdjustedSchedule,
}) => {
  const dateRange = useMemo(() => {
    const date = [];
    const startOfWeek = dayjs(scheduleRange.selectedDate)
      .startOf("week")
      .subtract(1, "day");

    for (let i = 0; i < scheduleRange.numOfWks * 7; i++) {
      const currentDate = startOfWeek.add(i, "day");
      date.push({
        date: currentDate.format("MM-DD-YYYY"),
        dayOfWeek: currentDate.format("ddd"), // Format to get the day of the week
      });
    }
    return date;
  }, [scheduleRange]);

  const startDate = useMemo(() => {
    return dayjs(scheduleRange.selectedDate).startOf("week").subtract(1, "day");
  }, [scheduleRange]);

  const endDate = useMemo(() => {
    return startDate.add(scheduleRange.numOfWks, "week").subtract(1, "day");
  }, [scheduleRange.numOfWks, startDate]);

  const daysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const employeeCodeCount = (employeeId) => {
    const codeCounts = {};
    const count = (employeeSchedule) => {
      Object.entries(employeeSchedule).forEach(([date, codeId]) => {
        const day = daysShort[dayjs(date).weekday()];
        if (codeId !== "" && codeId !== " ") {
          if (codes[day][codeId]) {
            const codeName = codes[day][codeId].name;

            const match = codeName.match(/([a-zA-Z]+)([0-9]+)/);
            const numbersPart = match[2];

            // console.log(codeName);
            codeCounts[numbersPart] = codeCounts[numbersPart]
              ? codeCounts[numbersPart] + 1
              : 1;
          } else if (codes.Add[codeId]) {
            const codeName = codes.Add[codeId].name;
            codeCounts[codeName] = codeCounts[codeName]
              ? codeCounts[codeName] + 1
              : 1;
          }
        }
      });
    };

    if (userAdjustedSchedule[employeeId]) {
      count(userAdjustedSchedule[employeeId]);
    }
    // if (schedule[employeeId] && userAdjustedSchedule[employeeId]) {
    //   const userAdjustedArray = Object.entries(
    //     userAdjustedSchedule[employeeId]
    //   ).filter(([date, code]) => code !== "");
    //   const userAdjustedObject = Object.fromEntries(userAdjustedArray);

    //   const combined = {
    //     ...schedule[employeeId],
    //     ...userAdjustedObject,
    //   };
    //   count(combined);
    // } else if (schedule[employeeId]) {
    //   count(schedule[employeeId]);
    // } else if (userAdjustedSchedule[employeeId]) {
    //   count(userAdjustedSchedule[employeeId]);
    // }

    const res = Object.entries(codeCounts)
      .map(([code, num]) => `${code} : ${num}`)
      .join(" , ");

    return res;
  };

  return (
    <>
      <Grid container justifyContent="space-between">
        <Grid item>
          <ScheduleRange
            scheduleRange={scheduleRange}
            setScheduleRange={setScheduleRange}
          />
        </Grid>

        <Grid item>
          <ExportCsv
            dateRange={dateRange}
            groups={groups}
            employees={employees}
            schedule={schedule}
            userAdjustedSchedule={userAdjustedSchedule}
            employeeCodeCount={employeeCodeCount}
          />
        </Grid>
      </Grid>
      <Grid item sx={{ mt: 1 }}>
        <ScheduleTable
          dateRange={dateRange}
          startDate={startDate}
          endDate={endDate}
          employees={employees}
          scheduleRange={scheduleRange}
          groups={groups}
          codes={codes}
          schedule={schedule}
          setSchedule={setSchedule}
          userAdjustedSchedule={userAdjustedSchedule}
          setuserAdjustedSchedule={setuserAdjustedSchedule}
          employeeCodeCount={employeeCodeCount}
        />
      </Grid>
    </>
  );
};

export default TableSection;
