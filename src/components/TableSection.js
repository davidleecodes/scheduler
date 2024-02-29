import React, { useMemo } from "react";
import dayjs from "dayjs";

import { Flex, Form, Button } from "antd";
import ScheduleTable from "./ScheduleTable";
import ScheduleRange from "./ScheduleRange";
import ExportCsv from "./ExportCsv";
import Generator from "./Generator";
import WeekDaysOff from "./WeekDaysOff";
import { daysShort } from "./utils";
import { ConfigProvider } from "antd";

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
  setCodes,
  schedule,
  setSchedule,
  userAdjustedSchedule,
  setuserAdjustedSchedule,
  daysOffPerWeek,
  setDaysOffPerWeek,
  scheduleMappedCodes,
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

  const employeeCodeCount = (employeeId) => {
    const codeCounts = {};
    const count = (employeeSchedule) => {
      Object.entries(employeeSchedule).forEach(([date, codeId]) => {
        const dayjsDate = dayjs(date);
        if (dayjsDate.isBetween(startDate, endDate, null, "[]")) {
          const day = daysShort[dayjsDate.weekday()];
          if (
            (day === "Sun" || day === "Sat") &&
            codeId !== "x" &&
            !(codeId in codes.Leave)
          ) {
            codeCounts.wknd = codeCounts.wknd ? codeCounts.wknd + 1 : 1;
          }
          if (codeId !== "" && codeId !== " ") {
            let codeShift;
            if (codes[day][codeId]) {
              codeShift = codes[day][codeId].shift;
            } else if (codes.Add[codeId]) {
              codeShift = codes.Add[codeId].shift;
            } else if (codes.Leave[codeId]) {
              codeShift = codes.Leave[codeId].shift;
            }
            if (codeShift && codeShift !== "none") {
              codeCounts[codeShift] = codeCounts[codeShift]
                ? codeCounts[codeShift] + 1
                : 1;
            }
          }
        }
      });
    };

    if (userAdjustedSchedule[employeeId]) {
      count(userAdjustedSchedule[employeeId]);
    }
    if (schedule[employeeId]) {
      count(schedule[employeeId]);
    }
    const res = Object.entries(codeCounts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([code, num]) => `${code} : ${num}`)
      .join(" , ");

    return res;
  };

  return (
    <>
      <Flex gap="small" vertical>
        <div style={{ maxWidth: 1200, margin: "auto", width: "100%" }}>
          <Flex gap="small">
            <Form layout="inline">
              <ScheduleRange
                scheduleRange={scheduleRange}
                setScheduleRange={setScheduleRange}
              />
              <WeekDaysOff
                daysOffPerWeek={daysOffPerWeek}
                setDaysOffPerWeek={setDaysOffPerWeek}
              />
            </Form>
          </Flex>

          <Flex gap="small" justify="flex-end">
            <Button type="primary" onClick={() => setuserAdjustedSchedule({})}>
              Reset
            </Button>
            <Generator
              groups={groups}
              codes={codes}
              employees={employees}
              schedule={schedule}
              dateRange={dateRange}
              setuserAdjustedSchedule={setuserAdjustedSchedule}
              startDate={startDate}
              endDate={endDate}
            />
            <ExportCsv
              dateRange={dateRange}
              groups={groups}
              employees={employees}
              schedule={schedule}
              userAdjustedSchedule={userAdjustedSchedule}
              employeeCodeCount={employeeCodeCount}
              codes={codes}
            />
          </Flex>
        </div>
        <ConfigProvider
          theme={{
            token: {
              fontSize: 12,
              // marginLG: 0,
            },
            components: {
              // Divider: {
              //   orientationMargin: 0,
              //   verticalMarginInline: 0,
              //   textPaddingInline: 0,
              // },
            },
          }}
        >
          <ScheduleTable
            dateRange={dateRange}
            startDate={startDate}
            endDate={endDate}
            employees={employees}
            groups={groups}
            codes={codes}
            setCodes={setCodes}
            schedule={schedule}
            setSchedule={setSchedule}
            userAdjustedSchedule={userAdjustedSchedule}
            setuserAdjustedSchedule={setuserAdjustedSchedule}
            employeeCodeCount={employeeCodeCount}
            daysOffPerWeek={daysOffPerWeek}
            scheduleMappedCodes={scheduleMappedCodes}
          />
        </ConfigProvider>
      </Flex>
    </>
  );
};

export default TableSection;
