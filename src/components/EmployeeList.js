import React, { useState } from "react";
import dayjs from "dayjs";
import { DatePicker, Space, Button, Form, Input, Checkbox } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

import ListNavContiner from "./ListNavContainer";
import { iterateArrayId, daysShort } from "./utils";

const { RangePicker } = DatePicker;

const EmployeeList = ({
  employees,
  setEmployees,
  groups,
  setGroups,
  setuserAdjustedSchedule,
  scheduleMappedCodes,
  daysOffPerWeek,
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
      <ListNavContiner
        collection={employees}
        onAddItem={handleAddEmployee}
        addLabel={"new Employee Name"}
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
  const [selectedDays, setSelectedDays] = useState(
    employee.shiftDays ? employee.shiftDays : daysShort
  );

  const handleDayChange = (checkedDays) => {
    setSelectedDays(checkedDays);
    setEmployees((prev) => ({
      ...prev,
      [employeeId]: { ...prev[employeeId], shiftDays: checkedDays },
    }));
  };

  return (
    <Checkbox.Group
      options={daysShort}
      value={selectedDays}
      onChange={handleDayChange}
    />
  );
};

const OffDays = ({
  employee,
  employeeId,
  setEmployees,
  setError,
  scheduleMappedCodes,
  daysOffPerWeek,
}) => {
  const offDays = employee?.offDays || [];
  const [dates, setDates] = useState(["", ""]);

  const handleAddOffDay = () => {
    setError("");
    const start = dayjs(dates[0]);
    const end = dayjs(dates[1]);
    let currentDate = start.day(0);

    while (currentDate.isSameOrBefore(end)) {
      // validate find the number of codes v in the same week
      let codesObject = {};

      for (let i = 0; i <= 6; i++) {
        const day = currentDate.day(i);
        const formatedDay = day.format("MM-DD-YYYY");
        const currSchDay = scheduleMappedCodes[formatedDay];
        if (currSchDay) {
          Object.keys(currSchDay).forEach((codeId) => {
            const num =
              currSchDay[codeId].length +
              (day.isBetween(start, end, null, "[]") ? 1 : 0);
            if (num) {
              codesObject[codeId] = codesObject[codeId]
                ? codesObject[codeId] + num
                : num;
            }
          });
        }
      }
      // console.log(codesObject);
      if (codesObject.v >= daysOffPerWeek) {
        setError(
          `max num of days off per week reached 
          ${currentDate.day(0).format("MM-DD-YYYY")} -
           ${currentDate.day(6).format("MM-DD-YYYY")}`
        );
        return;
      }
      currentDate = currentDate.add(1, "week");
    }

    const offDayIds = Object.keys(offDays);
    setEmployees((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        offDays: {
          ...prev[employeeId].offDays,
          [iterateArrayId(offDayIds, "o")]: [
            dates[0].format("MM/DD/YYYY"),
            dates[1].format("MM/DD/YYYY"),
          ],
        },
      },
    }));
    // console.log(offDayIds, employee);
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
  const handleDateChange = (dateStrings, offDayId) => {
    setError("");

    setEmployees((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        offDays: {
          ...prev[employeeId].offDays,
          [offDayId]: dateStrings,
        },
      },
    }));
  };

  return (
    <>
      <Space direction="vertical">
        {offDays &&
          Object.entries(offDays).map(([offDayId, offDay]) => (
            <Space size="small" key={offDayId}>
              <RangePicker
                value={[dayjs(offDay[0]), dayjs(offDay[1])]}
                onChange={(dateStrings) =>
                  handleDateChange(dateStrings, offDayId)
                }
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
