import React, { useState } from "react";
import { Grid } from "@mui/material";
import {
  AccordionGroup,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/joy";

import EmployeeList from "./EmployeeList";
import GroupList from "./GroupList";
import CodeList from "./CodeList";
import { ImportExport } from "./ExportImportSetting";
import TableSection from "./TableSection";

const employeesInit = {
  e1: {
    name: "amy",
    groupRules: {
      interval: { data: { startDay: "12/31/2023" } },
    },
    group: "g1",
  },
  e2: {
    name: "bran",
    groupRules: {
      interval: { data: { startDay: "01/06/2024" } },
    },
  },
  e3: {
    name: "carl",
    groupRules: {
      interval: { data: { startDay: "01/06/2024" } },
    },
    group: "g1",
  },
  e4: {
    name: "dawn",
    group: "g3",
  },
};

const groupsInit = {
  g1: {
    name: "group A",
    employees: ["e1", "e3"],
    groupRules: {
      interval: { data: { days: ["Sat", "Sun"], everyNumberOfWeeks: 3 } },
    },
  },
  // g2: {
  //   name: "group B",
  //   employees: ["e2"],
  //   groupRules: {
  //     interval: { data: { days: ["Sat", "Sun"], everyNumberOfWeeks: 2 } },
  //   },
  // },
  g3: {
    name: "group C",
    employees: ["e4"],
  },
};

const scheduleRangeInt = {
  // selectedDate: "",

  // selectedDate: "12/12/2023",
  numOfWks: 6,
};

const codeInt = {
  Sun: {
    Sun1: { name: "a10", shift: "morning" },
    Sun2: { name: "b10", shift: "morning" },
    Sun3: { name: "b30", shift: "evening" },
  },
  Mon: {
    Mon1: { name: "a10", shift: "morning" },
    Mon2: { name: "b10", shift: "morning" },
    Mon3: { name: "b30", shift: "evening" },
  },
  Tue: {
    Tue1: { name: "a10", shift: "morning" },
    Tue2: { name: "b10", shift: "morning" },
    Tue3: { name: "b30", shift: "evening" },
  },
  Wed: {
    Wed1: { name: "a10", shift: "morning" },
    Wed2: { name: "b10", shift: "morning" },
    Wed3: { name: "b30", shift: "evening" },
  },
  Thu: {
    Thu1: { name: "a10", shift: "morning" },
    Thu2: { name: "b10", shift: "morning" },
    Thu3: { name: "b30", shift: "evening" },
  },
  Fri: {
    Fri1: { name: "a10", shift: "morning" },
    Fri2: { name: "b10", shift: "morning" },
    Fri3: { name: "b30", shift: "evening" },
  },
  Sat: {
    Sat1: { name: "a10", shift: "morning" },
    Sat2: { name: "b10", shift: "morning" },
    Sat3: { name: "b30", shift: "evening" },
  },
  Add: {
    Add1: { name: "x", shift: "none" },
    Add2: { name: "v", shift: "none" },
    Add3: { name: "h", shift: "none" },
  },
  Internal: { x: { name: "x" }, h: { name: "h" } },
  // Add: ["x", "y", "z"],
};

const Settings = () => {
  const [employees, setEmployees] = useState(employeesInit);
  const [groups, setGroups] = useState(groupsInit);
  const [scheduleRange, setScheduleRange] = useState(scheduleRangeInt);
  const [codes, setCodes] = useState(codeInt);
  const [schedule, setSchedule] = useState({});
  const [userAdjustedSchedule, setuserAdjustedSchedule] = useState({});

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <ImportExport
          employees={employees}
          groups={groups}
          scheduleRange={scheduleRange}
          codes={codes}
          setEmployees={setEmployees}
          setGroups={setGroups}
          setScheduleRange={setScheduleRange}
          setCodes={setCodes}
        />
      </Grid>
      <Grid item xs={12}>
        <AccordionGroup size={"sm"}>
          <Accordion>
            <AccordionSummary>
              <Typography variant="h6">Codes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <CodeList
                codes={codes}
                setCodes={setCodes}
                userAdjustedSchedule={userAdjustedSchedule}
                setuserAdjustedSchedule={setuserAdjustedSchedule}
              />
            </AccordionDetails>
          </Accordion>
          {/*  */}
          <Accordion>
            <AccordionSummary>
              <Typography variant="h6">Employees</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <EmployeeList
                employees={employees}
                setEmployees={setEmployees}
                groups={groups}
                setGroups={setGroups}
                userAdjustedSchedule={userAdjustedSchedule}
                setuserAdjustedSchedule={setuserAdjustedSchedule}
              />
            </AccordionDetails>
          </Accordion>
          {/*  */}
          <Accordion>
            <AccordionSummary>
              <Typography variant="h6">Groups</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <GroupList
                groups={groups}
                employees={employees}
                setGroups={setGroups}
                setEmployees={setEmployees}
              />
            </AccordionDetails>
          </Accordion>
        </AccordionGroup>
        {/*  */}

        <Grid item sx={{ mt: 5 }}>
          <TableSection
            scheduleRange={scheduleRange}
            setScheduleRange={setScheduleRange}
            employees={employees}
            groups={groups}
            codes={codes}
            schedule={schedule}
            setSchedule={setSchedule}
            userAdjustedSchedule={userAdjustedSchedule}
            setuserAdjustedSchedule={setuserAdjustedSchedule}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Settings;
