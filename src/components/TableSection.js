import React, { useMemo } from "react";
import dayjs from "dayjs";
import { Flex, Form } from "antd";
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
        const day = daysShort[dayjs(date).weekday()];
        if (day === "Sun" || day === "Sat") {
          codeCounts.wknd = codeCounts.wknd ? codeCounts.wknd + 1 : 1;
        }
        if (codeId !== "" && codeId !== " ") {
          if (codes[day][codeId]) {
            const codeShift = codes[day][codeId].shift;

            codeCounts[codeShift] = codeCounts[codeShift]
              ? codeCounts[codeShift] + 1
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
            <Generator
              groups={groups}
              codes={codes}
              employees={employees}
              schedule={schedule}
              dateRange={dateRange}
              setuserAdjustedSchedule={setuserAdjustedSchedule}
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
