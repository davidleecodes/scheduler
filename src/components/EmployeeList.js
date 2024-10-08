import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  DatePicker,
  Space,
  Button,
  Form,
  Input,
  Checkbox,
  Select,
  Flex,
  Col,
  Row,
} from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

import ListNavContiner from "./ListNavContainer";
import { iterateArrayId, daysShort } from "./utils";

const { RangePicker } = DatePicker;

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

const EmployeeList = ({
  employees,
  setEmployees,
  groups,
  setGroups,
  setuserAdjustedSchedule,
  scheduleMappedCodes,
  daysOffPerWeek,
  codes,
}) => {
  const [selectedId, setSelectedId] = useState(Object.keys(employees)[0]);
  const [error, setError] = useState();

  const deleteEmployeeFromGroup = (employeeId) => {
    const updatedGroups = { ...groups };
    Object.entries(updatedGroups).forEach(([groupId, group]) => {
      updatedGroups[groupId].employees = updatedGroups[
        groupId
      ].employees.filter((employee) => employee !== employeeId);
    });
    setGroups(updatedGroups);
  };

  const deleteEmployeeFromSchedule = (employeeId) => {
    setuserAdjustedSchedule((prev) => {
      const { [employeeId]: employee, ...rest } = prev;
      return rest;
    });
  };

  const onDeleteEmployee = (employeeId) => {
    const { [employeeId]: employee, ...rest } = employees;
    setSelectedId(Object.keys(rest)[0]);
    setEmployees(rest);
    deleteEmployeeFromGroup(employeeId);
    deleteEmployeeFromSchedule(employeeId);
  };

  const handleAddEmployee = (data) => {
    const employeeIds = Object.keys(employees);
    const newId = iterateArrayId(employeeIds, "e");
    setEmployees({ ...employees, [newId]: data });
    setSelectedId(newId);
  };

  const handleOnChange = (employeeId, event) => {
    const { name, value } = event.target;
    setEmployees((prev) => ({
      ...prev,
      [employeeId]: { ...prev[employeeId], [name]: value },
    }));
  };

  // console.log("employee list");

  const employeeId = selectedId;

  return (
    <>
      <ListNavContiner
        collection={employees}
        onAddItem={handleAddEmployee}
        addLabel={"new employee name"}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        deleteLabel={"delete employee"}
        onDeleteItem={onDeleteEmployee}
      >
        {employees[employeeId] && (
          <>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Form
              {...formItemLayout}
              layout="horizontal"
              style={{ maxWidth: 500 }}
              // size="small"
            >
              <Form.Item label="name">
                <Input
                  value={employees[employeeId].name}
                  onChange={(event) => handleOnChange(employeeId, event)}
                  name="name"
                />
              </Form.Item>
              <Form.Item label="shift days">
                <ShiftDays
                  employee={employees[employeeId]}
                  employeeId={employeeId}
                  setEmployees={setEmployees}
                />
              </Form.Item>

              <Form.Item label="off days">
                <OffDays
                  employee={employees[employeeId]}
                  employeeId={employeeId}
                  setEmployees={setEmployees}
                  setError={setError}
                  scheduleMappedCodes={scheduleMappedCodes}
                  daysOffPerWeek={daysOffPerWeek}
                  codes={codes}
                />
              </Form.Item>
            </Form>
          </>
        )}
      </ListNavContiner>
    </>
  );
};

const ShiftDays = ({ employee, employeeId, setEmployees }) => {
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };
  const shiftOptions = [
    { value: "always", label: "always" },
    { value: "normal", label: "normal" },
    { value: "never", label: "never" },
  ];

  const handleChange = (day, value) => {
    setEmployees((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        shiftDays: { ...prev[employeeId].shiftDays, [day]: value },
      },
    }));
  };

  return (
    <>
      {/* <Form {...formItemLayout} layout="horizontal" style={{ maxWidth: 400 }}> */}
      <Row gutter={24}>
        {daysShort.map((day) => (
          <Col span={12} key={day}>
            <Form.Item label={`${day} `} {...formItemLayout}>
              <Select
                placeholder="chose shift"
                options={shiftOptions}
                onChange={(value) => handleChange(day, value)}
                value={
                  (employee.shiftDays && employee.shiftDays[day]) || "normal"
                }
              />
            </Form.Item>
          </Col>
        ))}
      </Row>
      {/* </Form> */}
    </>
  );
};

const OffDays = ({
  employee,
  employeeId,
  setEmployees,
  setError,
  scheduleMappedCodes,
  daysOffPerWeek,
  codes,
}) => {
  const offDays = employee?.offDays || [];
  const [dates, setDates] = useState(["", ""]);

  useEffect(() => {
    setError("");
  }, [employee, employeeId, setError]);

  const isOffDaysValid = (dates, prevDates) => {
    const start = dayjs(dates[0]);
    const end = dayjs(dates[1]);
    let prevStart;
    let prevEnd;
    if (prevDates) {
      prevStart = dayjs(prevDates[0]);
      prevEnd = dayjs(prevDates[1]);
    }

    let currentDate = start.day(0);

    while (currentDate.isSameOrBefore(end)) {
      let codesObject = {};
      let offDayinWeekCount = 0;
      let prevOffDayinWeekCount = 0;

      for (let i = 0; i <= 6; i++) {
        const day = currentDate.day(i);
        offDayinWeekCount += day.isBetween(start, end, null, "[]") ? 1 : 0;
        if (prevDates)
          prevOffDayinWeekCount += day.isBetween(prevStart, prevEnd, null, "[]")
            ? 1
            : 0;
        const formatedDay = day.format("MM-DD-YYYY");
        const currSchDay = scheduleMappedCodes[formatedDay];
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
      let offCount = Object.keys(codes.Leave).reduce((acc, code) => {
        if (code in codesObject) return acc + codesObject[code];
        return acc;
      }, 0);
      if (
        offCount + offDayinWeekCount - prevOffDayinWeekCount >
        daysOffPerWeek
      ) {
        setError(
          `max num of days off per week reached 
          ${currentDate.day(0).format("MM-DD-YYYY")} -
           ${currentDate.day(6).format("MM-DD-YYYY")}`
        );
        return false;
      }
      currentDate = currentDate.add(1, "week");
    }
    return true;
  };

  const handleAddOffDay = () => {
    setError("");
    if (!isOffDaysValid(dates)) return;

    const offDayIds = Object.keys(offDays);
    setEmployees((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        offDays: {
          ...prev[employeeId].offDays,
          [iterateArrayId(offDayIds, "o")]: {
            days: [
              dates[0].format("MM/DD/YYYY"),
              dates[1].format("MM/DD/YYYY"),
            ],
            code: "v",
          },
        },
      },
    }));
    setDates(["", ""]);
  };

  const handleOffDayDelete = (offDayId) => {
    setError("");
    const updatedOffDays = { ...offDays };
    delete updatedOffDays[offDayId];
    setEmployees((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        offDays: updatedOffDays,
      },
    }));
  };

  const handleChange = (data, name, offDayId) => {
    if (name === "days") {
      if (!isOffDaysValid(data, employee.offDays[offDayId].days)) return;
    }

    setError("");
    setEmployees((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        offDays: {
          ...prev[employeeId].offDays,
          [offDayId]: { ...prev[employeeId].offDays[offDayId], [name]: data },
        },
      },
    }));
  };

  const optionCodes = codes.Leave;

  const options = Object.keys(optionCodes).map((codeId) => ({
    value: codeId,
    label: optionCodes[codeId].name,
    className: optionCodes[codeId].group && "selected-opt",
  }));

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <>
      <Space direction="vertical">
        {offDays &&
          Object.entries(offDays).map(([offDayId, offDay]) => (
            <Space size="small" key={offDayId}>
              <RangePicker
                value={[dayjs(offDay.days[0]), dayjs(offDay.days[1])]}
                onChange={(date, dateString) =>
                  handleChange(dateString, "days", offDayId)
                }
              />
              <Select
                placeholder=" code"
                options={options}
                filterOption={filterOption}
                showSearch
                value={offDay.code}
                onSelect={(value) => handleChange(value, "code", offDayId)}
              />
              <Button
                onClick={() => handleOffDayDelete(offDayId)}
                icon={<MinusOutlined />}
                shape="circle"
                size="small"
              />
            </Space>
          ))}
        <Space>
          <RangePicker
            value={dates}
            onChange={(dateStrings) => setDates(dateStrings)}
            disabledDate={(d) => d.isBefore(dayjs().subtract("1", "days"))}
          />

          <Button
            onClick={handleAddOffDay}
            disabled={!dates[0] && !dates[1]}
            icon={<PlusOutlined />}
            shape="circle"
            type="primary"
            size="small"
          />
        </Space>
      </Space>
    </>
  );
};

export default EmployeeList;
