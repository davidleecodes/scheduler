import React, { useState } from "react";
import {
  TextField,
  IconButton,
  Grid,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Typography } from "@mui/joy";

import { iterateArrayId } from "./utils";
import dayjs from "dayjs";
import { DatePicker, Space } from "antd";
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
  const [selectedId, setSelectedId] = React.useState(Object.keys(employees)[0]);
  const [newEmployeeName, setNewEmployeeName] = useState("");
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

  const handleAddEmployee = () => {
    const data = { name: newEmployeeName };
    const employeeIds = Object.keys(employees);
    setEmployees({ ...employees, [iterateArrayId(employeeIds, "e")]: data });
    setNewEmployeeName("");
  };

  const handleOnChange = (employeeId, event) => {
    const { name, value } = event.target;
    setEmployees((prev) => ({
      ...prev,
      [employeeId]: { ...prev[employeeId], [name]: value },
    }));
  };

  const handleListItemClick = (event, id) => {
    setSelectedId(id);
  };
  // console.log("employee list");

  const employeeId = selectedId;

  return (
    <>
      <Grid container>
        <Grid item>
          <Box
            sx={{
              width: "100%",
              minWidth: 200,
              maxWidth: 400,
              bgcolor: "InfoBackground",
            }}
          >
            <Grid item container style={{ flexWrap: "nowrap" }}>
              <TextField
                label="New Employee Name"
                value={newEmployeeName}
                onChange={(e) => setNewEmployeeName(e.target.value)}
                size="small"
                variant="standard"
              />
              <IconButton
                variant="contained"
                color="primary"
                onClick={handleAddEmployee}
                disabled={!newEmployeeName}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Grid>
            <List>
              {Object.entries(employees).map(([id, employee]) => (
                <ListItem key={id}>
                  <ListItemButton
                    selected={selectedId === id}
                    onClick={(event) => handleListItemClick(event, id)}
                  >
                    <ListItemText primary={employee.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
        {/* <Grid item container direction={"column"} spacing={1}>
        {Object.keys(employees).map((employeeId) => ( */}
        <Grid item style={{ flexGrow: 1 }}>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <Grid container key={employeeId} spacing={3} style={{ flexGrow: 1 }}>
            <Grid item>
              <Grid item container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    value={employees[employeeId].name}
                    onChange={(event) => handleOnChange(employeeId, event)}
                    size="small"
                    variant="standard"
                    name="name"
                    label="Name"
                  />
                </Grid>
                <Grid item>
                  <Typography>off days</Typography>
                  <OffDays
                    employee={employees[employeeId]}
                    employeeId={employeeId}
                    setEmployees={setEmployees}
                    setError={setError}
                    scheduleMappedCodes={scheduleMappedCodes}
                    daysOffPerWeek={daysOffPerWeek}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <IconButton
                onClick={() => onDeleteEmployee(employeeId)}
                color="secondary"
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Grid>
          </Grid>
          {/* </Grid>
        ))} */}

          {/* <Grid item container style={{ flexWrap: "nowrap" }}>
            <TextField
              label="New Employee Name"
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
              size="small"
              variant="standard"
            />
            <IconButton
              variant="contained"
              color="primary"
              onClick={handleAddEmployee}
              disabled={!newEmployeeName}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Grid> */}
        </Grid>
      </Grid>
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
}) => {
  const offDays = employee?.offDays || [];
  const [dates, setDates] = useState(["", ""]);

  const handleAddOffDay = () => {
    setError("");
    // console.log(scheduleMappedCodes);
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
      console.log(codesObject);
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
    console.log(offDayIds, employee);
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
      {offDays &&
        Object.entries(offDays).map(([offDayId, offDay]) => (
          <Grid key={offDayId}>
            <RangePicker
              value={[dayjs(offDay[0]), dayjs(offDay[1])]}
              onChange={(dateStrings) =>
                handleDateChange(dateStrings, offDayId)
              }
            />
            <IconButton
              color="secondary"
              onClick={() => handleOffDayDelete(offDayId)}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="MM/DD/YYYY"
                value={dayjs(offDay.start)}
                onChange={(value) => handleDateChange(offDayId, value, "start")}
                name="start"
                slotProps={{ textField: { size: "small" } }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="MM/DD/YYYY"
                value={dayjs(offDay.end)}
                onChange={(value) => handleDateChange(offDayId, value, "end")}
                name="end"
                slotProps={{ textField: { size: "small" } }}
              />
              <IconButton
                color="secondary"
                onClick={() => handleOffDayDelete(offDayId)}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </LocalizationProvider> */}
          </Grid>
        ))}
      <Grid>
        <RangePicker
          value={dates}
          onChange={(dateStrings) => setDates(dateStrings)}
          disabledDate={(d) => d.isBefore(dayjs().subtract("1", "days"))}
        />
        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            format="MM/DD/YYYY"
            value={start}
            onChange={(newValue) => setStart(newValue)}
            slotProps={{ textField: { size: "small" } }}
            disablePast
          />
          <DatePicker
            format="MM/DD/YYYY"
            value={end}
            onChange={(newValue) => setEnd(newValue)}
            slotProps={{ textField: { size: "small" } }}
            disablePast
          />
        </LocalizationProvider> */}
        <IconButton
          variant="contained"
          color="primary"
          onClick={handleAddOffDay}
          disabled={!dates[0] && !dates[1]}
        >
          <AddCircleOutlineIcon />
        </IconButton>
      </Grid>
    </>
  );
};

export default EmployeeList;
