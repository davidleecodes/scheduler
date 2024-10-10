import React, { useEffect, useState } from "react";

import dayjs from "dayjs";
import { daysShort } from "./utils";
import {
  Form,
  InputNumber,
  Button,
  DatePicker,
  Space,
  Checkbox,
  Typography,
} from "antd";
const { Title, Paragraph, Text } = Typography;
const IntervalGroup = ({ ruleData, setGroups, groupId, groups }) => {
  const [selectedDays, setSelectedDays] = useState();
  const [everyNumberOfWeeks, setEveryNumberOfWeeks] = useState();

  useEffect(() => {
    setSelectedDays(ruleData?.days || []);
    setEveryNumberOfWeeks(ruleData?.everyNumberOfWeeks || "");
  }, [groupId, ruleData]);

  const handleDayChange = (checkedDays) => {
    setSelectedDays(checkedDays);
    const updatedGroups = { ...groups };
    updatedGroups[groupId].groupRules.interval.data.days = checkedDays;
    setGroups(updatedGroups);
  };

  const handleEveryNumberOfWeeksChange = (value) => {
    setEveryNumberOfWeeks(value);
    const updatedGroups = { ...groups };
    updatedGroups[groupId].groupRules.interval.data.everyNumberOfWeeks = value;

    setGroups(updatedGroups);
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  return (
    <>
      <Text strong>group interval</Text>
      <Form layout="horizontal" style={{ maxWidth: 500 }}>
        <Form.Item label="num of weeks">
          <InputNumber
            value={everyNumberOfWeeks}
            onChange={handleEveryNumberOfWeeksChange}
            min={2}
            max={10}
          />
        </Form.Item>
        {/* <Form.Item label="days"> */}
        <Checkbox.Group
          options={daysShort}
          value={selectedDays}
          onChange={handleDayChange}
        />
        {/* </Form.Item> */}
      </Form>
    </>
  );
};

const IntervalEmployee = ({
  ruleData,
  employees,
  setEmployees,
  employeeId,
  groupRuleData,
}) => {
  const [selectedDate, setSelectedDate] = useState();

  useEffect(() => {
    setSelectedDate(dayjs(ruleData.startDay) || "");
  }, [employeeId, ruleData]);
  const selectedDaysIndex =
    groupRuleData &&
    groupRuleData.days &&
    groupRuleData.days.map((day) => daysShort.indexOf(day));

  const handleDateChange = (date) => {
    // console.log(employeeId);
    setSelectedDate(date);

    const updatedEmployee = { ...employees[employeeId] };
    const updatedGroupRules = {
      ...updatedEmployee.groupRules,
      interval: { data: { startDay: date } },
    };
    updatedEmployee.groupRules = updatedGroupRules;

    setEmployees({ ...employees, [employeeId]: updatedEmployee });
  };
  function disableDay(date) {
    return selectedDaysIndex
      ? !selectedDaysIndex.includes(dayjs(date).weekday())
      : false;
  }
  return (
    <>
      {/* <Form layout="inline"> */}
      <Form.Item label="group interval">
        <DatePicker
          format="MM/DD/YYYY"
          value={selectedDate}
          onChange={handleDateChange}
          allowClear={false}
        />
      </Form.Item>
      {/* </Form> */}
    </>
  );
};

const intervalGroupOnChange = (startDate, endDate, employeeData, groupData) => {
  const { days, everyNumberOfWeeks } = groupData;
  const { startDay } = employeeData;

  const selectedDaysIndex = days.map((day) => daysShort.indexOf(day));
  let startDateMod = startDate.subtract(1, "day");
  const endDateMod = dayjs(endDate).add(1, "day");

  const result = {};
  let currentDate = dayjs(startDay).subtract(1, "day");

  const end = dayjs(endDate).startOf("day");

  let count = 1;
  while (currentDate.isSameOrBefore(end)) {
    // eslint-disable-next-line no-loop-func

    // eslint-disable-next-line no-loop-func
    selectedDaysIndex.forEach((index) => {
      const newDate = currentDate.weekday(index);
      const newDateFormated = newDate.format("MM-DD-YYYY");

      if (newDate.isBetween(startDateMod, endDateMod)) {
        if (count < everyNumberOfWeeks) {
          result[newDateFormated] = "x";
        } else if (count >= everyNumberOfWeeks) {
          // result[newDateFormated] = "h";
        }
      }
    });
    if (count >= everyNumberOfWeeks) count = 0;
    currentDate = currentDate.add(1, "week");
    count += 1;

    // currentDate = currentDate.add(everyNumberOfWeeks, "week");
  }
  return result;
};

const maxShiftGenLogic = (employeeId, employeeShiftCount, data) => {
  const { numberOfShifts, weekYear } = data;

  if (!employeeShiftCount[employeeId]) return true;
  if (employeeShiftCount[employeeId][weekYear] >= numberOfShifts) return false;
  return true;
};

const MaxShiftGroup = ({ ruleData, setGroups, groupId, groups }) => {
  const [numberOfShifts, setNumberOfShifts] = useState();

  useEffect(() => {
    setNumberOfShifts(ruleData?.numberOfShifts || "");
  }, [groupId, ruleData]);
  // console.log(ruleData?.numberOfShifts);

  const handleNumberOfShiftsChange = (value) => {
    setNumberOfShifts(value);
    const updatedGroups = { ...groups };
    updatedGroups[groupId].groupRules.maxShift.data.numberOfShifts = value;

    setGroups(updatedGroups);
  };

  return (
    <>
      <Text strong>max shifts per employee per week</Text>
      <Form layout="horizontal" style={{ maxWidth: 500 }}>
        <Form.Item label="number of shifts">
          <InputNumber
            value={numberOfShifts}
            onChange={handleNumberOfShiftsChange}
            min={2}
            max={10}
          />
        </Form.Item>
      </Form>
    </>
  );
};

const groupRulesCollection = {
  interval: {
    group: {
      component: IntervalGroup,
      onChange: intervalGroupOnChange,
      defaultValues: { data: { days: ["Sat", "Sun"], everyNumberOfWeeks: 2 } },
    },
    employee: {
      component: IntervalEmployee,
      defaultValues: { data: { startDay: dayjs() } },
    },
  },
  maxShift: {
    group: {
      component: MaxShiftGroup,
      defaultValues: { data: { numberOfShifts: 4 } },
      genLogic: maxShiftGenLogic,
      genGroupToEmployee: true,
    },
  },
};

export { groupRulesCollection };
