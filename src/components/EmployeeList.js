import React, { useState } from "react";
import { TextField, IconButton, Grid } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

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
    // console.log(groups);
    // console.log(userAdjustedSchedule);
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

  return (
    <>
      <Grid item container direction={"column"} spacing={1}>
        {Object.keys(employees).map((employeeId) => (
          <Grid item container key={employeeId} style={{ flexWrap: "nowrap" }}>
            <TextField
              value={employees[employeeId].name}
              onChange={(event) => handleOnChange(employeeId, event)}
              size="small"
              variant="standard"
              name="name"
            />
            <IconButton
              onClick={() => onDeleteEmployee(employeeId)}
              color="secondary"
            >
              <RemoveCircleOutlineIcon />
            </IconButton>

            {/* <Typography variant="h6">Employee Rules:</Typography>
          {employees[employeeId].groupRules.interval && (
            <EmployeeRulesComponent
              employeeRule={employees[employeeId].groupRules.interval}
            />
          )} */}
          </Grid>
        ))}

        {/* <Typography variant="h6">Add Employee:</Typography> */}
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
