import React, { useState } from "react";
import { TextField, IconButton, Grid } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Typography } from "@mui/joy";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";

const EmployeeList = ({
  employees,
  setEmployees,
  groups,
  setGroups,
  userAdjustedSchedule,
  setuserAdjustedSchedule,
}) => {
  const [newEmployeeName, setNewEmployeeName] = useState("");

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
    const { [employeeId]: employee, ...rest } = userAdjustedSchedule;
    setuserAdjustedSchedule(rest);
  };

  const onDeleteEmployee = (id) => {
    const { [id]: employee, ...rest } = employees;
    setEmployees(rest);
    deleteEmployeeFromGroup(id);
    deleteEmployeeFromSchedule(id);
  };
  const onAddEmployee = (data) => {
    const employeeIds = Object.keys(employees);
    const lastId = employeeIds[employeeIds.length - 1];
    const newId = lastId ? `e${parseInt(lastId.slice(1)) + 1}` : "e1";
    setEmployees({ ...employees, [newId]: data });
  };

  const handleAddEmployee = () => {
    onAddEmployee({ name: newEmployeeName });
    setNewEmployeeName("");
  };

  const handleOnChange = (employeeId, event) => {
    const { name, value } = event.target;
    setEmployees((prev) => ({
      ...prev,
      [employeeId]: { ...prev[employeeId], [name]: value },
    }));
  };

  const OffDays = ({ employee, employeeId }) => {
    const offDays = employee?.offDays;
    const [start, setStart] = useState();
    const [end, setEnd] = useState();

    const handleAddOffDay = () => {
      const offDayId = Object.keys(offDays).length + 1;
      setEmployees((prev) => ({
        ...prev,
        [employeeId]: {
          ...prev[employeeId],
          offDays: {
            ...prev[employeeId].offDays,
            [offDayId]: {
              start: start.format("MM/DD/YYYY"),
              end: end.format("MM/DD/YYYY"),
            },
          },
        },
      }));
      setStart(null);
      setEnd(null);
    };

    const handleOffDayDelete = (offDayId) => {
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
    const handleDateChange = (offDayId, value, name) => {
      setEmployees((prev) => ({
        ...prev,
        [employeeId]: {
          ...prev[employeeId],
          offDays: {
            ...prev[employeeId].offDays,
            [offDayId]: {
              ...prev[employeeId].offDays[offDayId],
              [name]: value.format("MM/DD/YYYY"),
            },
          },
        },
      }));
    };

    return (
      <>
        {offDays &&
          Object.entries(offDays).map(([offDayId, offDay]) => (
            <Grid key={offDayId}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="MM/DD/YYYY"
                  value={dayjs(offDay.start)}
                  onChange={(value) =>
                    handleDateChange(offDayId, value, "start")
                  }
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
              </LocalizationProvider>
            </Grid>
          ))}
        <Grid>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          </LocalizationProvider>
          <IconButton
            variant="contained"
            color="primary"
            onClick={handleAddOffDay}
            disabled={!start || !end}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Grid>
      </>
    );
  };

  return (
    <>
      <Grid item container direction={"column"} spacing={1}>
        {Object.keys(employees).map((employeeId) => (
          <Grid item container key={employeeId} spacing={3}>
            <Grid item>
              <TextField
                value={employees[employeeId].name}
                onChange={(event) => handleOnChange(employeeId, event)}
                size="small"
                variant="standard"
                name="name"
              />

              <Typography>off days</Typography>
              <OffDays
                employee={employees[employeeId]}
                employeeId={employeeId}
              />
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
        ))}

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
      </Grid>
    </>
  );
};

export default EmployeeList;
