import React, { useEffect, useState, memo, useCallback } from "react";
import { Space, Table, Tag, Flex, Typography, Select, Input } from "antd";
// import { Select, MenuItem } from "@mui/material";
import { groupRulesCollection } from "./GroupRulesCollection";
import dayjs from "dayjs";
// import "./style.css";
// {emp1:{
//     date:'code'
// }}
import { yellow } from "@ant-design/colors";
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
  scheduleMappedCodes,
}) => {
  const [userScheduleMappedCodes, setUserScheduleMappedCodes] = useState({});
  const [error, setError] = useState();
  const { Title, Paragraph, Text, Link } = Typography;

  const getCodeName = (weekDay, codeId) => {
    const name = codes[weekDay][codeId]
      ? codes[weekDay][codeId].name
      : codes.Add[codeId] && codes.Add[codeId].name;
    return name;
  };

  const handleCellChange = (codeId, date, employeeId) => {
    const schDay = userScheduleMappedCodes[date];
    const weekDay = dayjs(date).format("ddd");
    setError("");
    const newSchedule = { ...userAdjustedSchedule };

    //check validation for offDays per week
    if (getCodeName(weekDay, codeId) === "v") {
      const dayjsDate = dayjs(date);
      let codesObject = {};

      //0= sun, sat =6
      for (let i = 0; i <= 6; i++) {
        const currDate = dayjsDate.day(i).format("MM-DD-YYYY");
        const currWeekDay = dayjsDate.day(i).format("ddd");
        const currUserSchDay = userScheduleMappedCodes[currDate];

        if (currUserSchDay) {
          Object.keys(currUserSchDay).forEach((codeId) => {
            const name = getCodeName(currWeekDay, codeId);
            const num = currUserSchDay[codeId].length;
            if (num) {
              codesObject[name] = codesObject[name]
                ? codesObject[name] + num
                : num;
            }
          });
        }
        const currSchDay = scheduleMappedCodes[currDate];
        if (currSchDay) {
          Object.keys(currSchDay).forEach((codeId) => {
            // const name = getCodeName(currWeekDay, codeId);
            const num = currSchDay[codeId].length;
            if (num) {
              codesObject[codeId] = codesObject[codeId]
                ? codesObject[codeId] + num
                : num;
            }
          });
        }
      }
      if (codesObject.v >= daysOffPerWeek) {
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
    const newSchedule = {};
    // const newSchedule = { ...schedule };
    Object.values(groups).forEach((group) => {
      group.employees &&
        group.employees.forEach((employeeId) => {
          const employee = employees[employeeId];
          if (employee) {
            if (employee.offDays) {
              Object.entries(employee.offDays).forEach(([offDayId, offDay]) => {
                const offDayStart = dayjs(offDay[0]);
                const offDayEnd = dayjs(offDay[1]);

                if (
                  offDayStart.isBetween(startDate, endDate) ||
                  offDayEnd.isBetween(startDate, endDate)
                ) {
                  let currentDate = startDate.isSameOrAfter(offDayStart)
                    ? startDate
                    : offDayStart;
                  let end = endDate.isSameOrBefore(offDayEnd)
                    ? endDate
                    : offDayEnd;
                  while (currentDate.isSameOrBefore(end)) {
                    const formattedDate = currentDate.format("MM-DD-YYYY");
                    newSchedule[employeeId] = {
                      ...newSchedule[employeeId],
                      [formattedDate]: "v",
                    };

                    currentDate = currentDate.add(1, "day");
                  }

                  // setSchedule(newSchedule);
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

                    if (
                      !groupGroupRuleData ||
                      Object.keys(groupGroupRuleData).length === 0
                    )
                      return;
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

                    // setSchedule(newSchedule);
                  }
                }
              );
            }

            setSchedule(newSchedule);
          }
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees, endDate, groups, startDate]);

  const dayStack = (day) => {
    const splitDate = day.date.split("-");
    return (
      <Flex
        vertical
        justify="center"
        align="center"
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
        <span>{splitDate[0]}</span>
        <span>{splitDate[1]}</span>
        <span>{day.dayOfWeek}</span>
      </Flex>
    );
  };

  const codesMatch = (day) => {
    const scheduleDayCodes = Object.keys(userScheduleMappedCodes[day.date]);
    const dayCodes = Object.keys(codes[day.dayOfWeek]);
    // console.log(
    //   day.date,
    //   scheduleDayCodes,
    //   dayCodes,
    //   userScheduleMappedCodes[day.date]
    // );
    return dayCodes.every((c) => scheduleDayCodes.includes(c));
  };

  // console.log("table");
  const allDays = dateRange.map((day) => ({
    [day.date]: "",
  }));

  let columns = dateRange.map((day) => ({
    title: dayStack(day),
    dataIndex: day.date,
    key: day.date,

    // width: 20,
    // onHeaderCell: (column) => {
    //   console.log(column);
    // },
    render: (text, record) => {
      // const { employeeId } = record;
      if (!record) return null;
      return (
        <CodeSelect
          employeeId={record.employeeId}
          day={day}
          codes={codes}
          dayScheduleMappedCodes={userScheduleMappedCodes[day.date]}
          empSchedule={schedule[record.employeeId]}
          empUserAdjustedSchedule={userAdjustedSchedule[record.employeeId]}
          handleCellChange={handleCellChange}
        />
      );
    },
  }));
  columns.unshift({
    dataIndex: "name",
    key: "name",
    width: 60,
    fixed: "left",
  });
  columns.unshift({
    dataIndex: "group",
    key: "group",
    rowScope: "row",
    width: 35,
    fixed: "left",
    onCell: (record) => {
      return {
        rowSpan:
          groups[record.groupId].employees.indexOf(record.employeeId) === 0
            ? groups[record.groupId].employees.length
            : 0,
      };
    },
    render: (text, record) => (
      <div
        style={{
          writingMode: "vertical-lr",
          transform: " rotate(180deg)",
        }}
      >
        {text}
      </div>
    ),
  });
  columns.push({
    title: "count",
    dataIndex: "employeeCodeCount",
    key: "employeeCodeCount",
    width: 200,
    // fixed: "right",
  });

  const data = Object.entries(groups).flatMap(([groupId, group]) =>
    group.employees.map((employeeId) => ({
      key: employeeId,
      group: group.name,
      groupId: groupId,
      employeeId: employeeId,
      name: employees[employeeId].name,
      employeeCodeCount: employeeCodeCount(employeeId),
      ...allDays,
      ...schedule[employeeId],
      ...userAdjustedSchedule[employeeId],
    }))
  );
  // console.log(data);
  return (
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Table
        columns={columns}
        dataSource={data}
        size="small"
        pagination={false}
        scroll={{ x: 1800, y: 1000 }}
        // tableLayout="auto"
      />
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

  let options = Object.entries(codes[dayOfWeek]).map(([codeId, code]) => ({
    value: codeId,
    label: code.name,
    className:
      dayScheduleMappedCodes &&
      dayScheduleMappedCodes[codeId] &&
      "selected-opt",
  }));

  options.unshift({
    value: " ",
    label: "-",
  });

  options.push(
    ...Object.entries(codes.Add).map(([codeId, code]) => ({
      value: codeId,
      label: code.name,
    }))
  );

  // options.push(
  //   ...Object.entries(codes.Internal).map(([codeId, code]) => ({
  //     value: codeId,
  //     label: <div style={{ display: "none" }}>{code.name}</div>,
  //   }))
  // );

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  return (
    //
    <div style={{ backgroundColor: highLight ? yellow[2] : "initial" }}>
      <Select
        size="small"
        variant="borderless"
        options={options}
        popupMatchSelectWidth={false}
        suffixIcon={<></>}
        placeholder="-"
        value={
          (empUserAdjustedSchedule && empUserAdjustedSchedule[day.date]) ||
          (empSchedule && empSchedule[day.date]) ||
          null
        }
        onChange={(value) => handleCellChange(value, day.date, employeeId)}
        filterOption={filterOption}
        showSearch
      />
    </div>
  );
};

export default ScheduleTable;
