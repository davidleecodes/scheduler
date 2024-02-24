import React, { useState, useEffect } from "react";
import { Collapse, Flex, Tabs } from "antd";

import EmployeeList from "./EmployeeList";
import GroupList from "./GroupList";
import CodeList from "./CodeList";
import { ImportExport } from "./ImportExportSetting";
import TableSection from "./TableSection";
import {
  employeesInit,
  groupsInit,
  scheduleRangeInt,
  codeInt,
  daysOffPerWeekInt,
} from "./initalStates";

const Settings = () => {
  const [employees, setEmployees] = useState(employeesInit);
  const [groups, setGroups] = useState(groupsInit);
  const [scheduleRange, setScheduleRange] = useState(scheduleRangeInt);
  const [codes, setCodes] = useState(codeInt);
  const [schedule, setSchedule] = useState({});
  const [userAdjustedSchedule, setuserAdjustedSchedule] = useState({});
  const [daysOffPerWeek, setDaysOffPerWeek] = useState(daysOffPerWeekInt);
  const [scheduleMappedCodes, setScheduleMappedCodes] = useState({});

  useEffect(() => {
    let scheduleMappedCodes = {};
    Object.entries(schedule).forEach(([employeeId, employee]) => {
      Object.entries(employee).forEach(([date, codeId]) => {
        if (codeId) {
          scheduleMappedCodes[date] = {
            ...scheduleMappedCodes[date],
            [codeId]:
              scheduleMappedCodes[date] && scheduleMappedCodes[date][codeId]
                ? [...scheduleMappedCodes[date][codeId], employeeId]
                : [employeeId],
          };
        }
      });
    });
    setScheduleMappedCodes(scheduleMappedCodes);
  }, [schedule]);

  const items = [
    {
      key: "1",
      label: "Codes",
      children: (
        <CodeList
          codes={codes}
          setCodes={setCodes}
          userAdjustedSchedule={userAdjustedSchedule}
          setuserAdjustedSchedule={setuserAdjustedSchedule}
        />
      ),
    },
    {
      key: "2",
      label: "Employees",
      children: (
        <EmployeeList
          employees={employees}
          setEmployees={setEmployees}
          groups={groups}
          setGroups={setGroups}
          setuserAdjustedSchedule={setuserAdjustedSchedule}
          scheduleMappedCodes={scheduleMappedCodes}
          daysOffPerWeek={daysOffPerWeek}
          codes={codes}
        />
      ),
    },
    {
      key: "3",
      label: "Groups",
      children: (
        <GroupList
          groups={groups}
          employees={employees}
          setGroups={setGroups}
          setEmployees={setEmployees}
        />
      ),
    },
  ];

  return (
    <>
      <Flex gap="middle" vertical>
        <div style={{ maxWidth: 1200, margin: "auto", width: "100%" }}>
          <ImportExport
            employees={employees}
            groups={groups}
            scheduleRange={scheduleRange}
            codes={codes}
            setEmployees={setEmployees}
            setGroups={setGroups}
            setScheduleRange={setScheduleRange}
            setCodes={setCodes}
            daysOffPerWeek={daysOffPerWeek}
          />

          {/* <Collapse items={items} ghost /> */}
          <Tabs defaultActiveKey="1" items={items} />
        </div>
        <TableSection
          scheduleRange={scheduleRange}
          setScheduleRange={setScheduleRange}
          employees={employees}
          groups={groups}
          setCodes={setCodes}
          codes={codes}
          schedule={schedule}
          setSchedule={setSchedule}
          userAdjustedSchedule={userAdjustedSchedule}
          setuserAdjustedSchedule={setuserAdjustedSchedule}
          daysOffPerWeek={daysOffPerWeek}
          setDaysOffPerWeek={setDaysOffPerWeek}
          scheduleMappedCodes={scheduleMappedCodes}
        />
      </Flex>
    </>
  );
};

export default Settings;
