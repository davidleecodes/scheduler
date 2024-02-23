import React, { useEffect, useState } from "react";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";

import {
  Table,
  Flex,
  Typography,
  Select,
  theme,
  Divider,
  Space,
  Input,
  Button,
} from "antd";
import { groupRulesCollection } from "./GroupRulesCollection";
import dayjs from "dayjs";
import { daysShort } from "./utils";

// {emp1:{
//     date:'code'
// }}
import { yellow, green } from "@ant-design/colors";
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
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const getCodeName = (weekDay, codeId) => {
    const name = codes[weekDay][codeId]
      ? codes[weekDay][codeId].name
      : codes.Add[codeId] && codes.Add[codeId].name;
    return name;
  };

  const handleCellChange = (codeId, date, employeeId) => {
    const schDay = userScheduleMappedCodes[date];
    setError("");
    const newSchedule = { ...userAdjustedSchedule };

    //check validation for offDays per week
    if (codeId in codes.Leave) {
      console.log(codeId);
      const dayjsDate = dayjs(date);
      let codesObject = {};

      //0= sun, sat =6
      for (let i = 0; i <= 6; i++) {
        const currDate = dayjsDate.day(i).format("MM-DD-YYYY");
        const currUserSchDay = userScheduleMappedCodes[currDate];

        if (currUserSchDay) {
          Object.keys(currUserSchDay).forEach((codeId) => {
            const num = currUserSchDay[codeId].length;
            if (num) {
              codesObject[codeId] = codesObject[codeId]
                ? codesObject[codeId] + num
                : num;
            }
          });
        }
        const currSchDay = scheduleMappedCodes[currDate];
        if (currSchDay) {
          Object.keys(currSchDay).forEach((codeId) => {
            const num = currSchDay[codeId].length;
            if (num) {
              codesObject[codeId] = codesObject[codeId]
                ? codesObject[codeId] + num
                : num;
            }
          });
        }
      }
      console.log(codesObject);

      let offCount = Object.keys(codes.Leave).reduce((acc, code) => {
        if (code in codesObject) return acc + codesObject[code];
        return acc;
      }, 0);
      console.log(offCount);

      if (offCount >= daysOffPerWeek) {
        setError(
          `max num of days off per week reached 
        ${dayjsDate.day(0).format("MM-DD-YYYY")} - 
        ${dayjsDate.day(6).format("MM-DD-YYYY")}`
        );
        return;
      }
    }
    //swap codeId
    if (
      schDay &&
      schDay[codeId] &&
      !codes.Leave[codeId] &&
      !codes.Add[codeId]
    ) {
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
            if (employee.shiftDays) {
              let nonShiftDays = daysShort.reduce((acc, day, index) => {
                if (
                  day in employee.shiftDays &&
                  employee.shiftDays[day] == "never"
                ) {
                  return [...acc, index];
                }
                return acc;
              }, []);
              let currDate = startDate;

              while (currDate.isSameOrBefore(endDate.add(1, "day"))) {
                for (const dayIndex of nonShiftDays) {
                  // console.log(currDate.day(dayIndex).format("MM-DD-YYYY"));
                  // console.log(nonShiftDays, currDate, endDate);

                  newSchedule[employeeId] = {
                    ...newSchedule[employeeId],
                    [currDate.weekday(dayIndex).format("MM-DD-YYYY")]: "x",
                  };
                }

                currDate = currDate.add(1, "week");
              }
            }

            if (employee.offDays) {
              Object.entries(employee.offDays).forEach(([offDayId, offDay]) => {
                const offDayStart = dayjs(offDay.days[0]);
                const offDayEnd = dayjs(offDay.days[1]);

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
                      [formattedDate]: offDay.code,
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
          borderTop:
            userScheduleMappedCodes[day.date] && codesMatch(day)
              ? `${green[2]} thick solid`
              : `${colorBgContainer} thick solid`,
          borderRadius: 2,
          backgroundColor:
            day.dayOfWeek === "Sun" || day.dayOfWeek === "Sat"
              ? yellow[1]
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
    width: 220,
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
        scroll={{ x: 1400, y: 1000 }}
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
    // {
    // label: <Divider size="small" />,
    // options: [
    ...Object.entries(codes.Leave).map(([codeId, code]) => ({
      value: codeId,
      label: code.name,
      className: " selected-opt-center",
    }))
    //   ],
    // }
  );

  options.push(
    // {
    // label: <Divider size="small" />,
    // options: [
    ...Object.entries(codes.Add).map(([codeId, code]) => ({
      value: codeId,
      label: code.name,
    }))
    //   ],
    // }
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
    <div style={{ backgroundColor: highLight ? yellow[1] : "initial" }}>
      <Select
        // style={{ width: 200 }}
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
        dropdownRender={(menu) => (
          <>
            {menu}
            <Divider style={{ margin: "8px 0" }} />
            <Space style={{ padding: "0 8px 4px" }}>
              <Input
                placeholder="temp code"
                // ref={inputRef}
                // value={name}
                // onChange={onNameChange}
                onKeyDown={(e) => e.stopPropagation()}
                style={{ width: 90 }}
              />
              <Select style={{ width: 40 }} />
              <Button
                icon={<PlusOutlined />}
                // onClick={addItem}
                shape="circle"
                type="primary"
                size="small"
              />
            </Space>
          </>
        )}
      />
    </div>
  );
};

export default ScheduleTable;
