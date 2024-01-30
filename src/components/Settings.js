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
            daysOffPerWeek={daysOffPerWeek}
            setDaysOffPerWeek={setDaysOffPerWeek}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Settings;
