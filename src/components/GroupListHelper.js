import React, { useState } from "react";

import {
  Grid,
  MenuItem,
  IconButton,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { groupRulesCollection } from "./GroupRulesCollection";

const AddEmployeeField = ({ employees, handleAddEmployee, groupId, group }) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const handleAdd = () => {
    if (selectedEmployee) {
      handleAddEmployee(groupId, selectedEmployee);
      setSelectedEmployee("");
    }
  };
  const filterEmployeesEnteries = () => {
    if (group?.employees) {
      const array = Object.entries(employees).filter(
        ([employeeId, employee]) => !group.employees.includes(employeeId)
      );
      return Object.fromEntries(array);
    } else return employees;
  };

  const filterEmployees = filterEmployeesEnteries();
  // const filterEmployees = employees;

  return (
    <>
      <Grid
        item
        container
        spacing={1}
        alignItems="center"
        style={{ flexWrap: "nowrap" }}
      >
        <Grid item style={{ flexGrow: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="employee-add-label">add employee</InputLabel>
            <Select
              labelId="employee-add-label"
              fullWidth
              value={selectedEmployee}
              label="add employee"
              onChange={(e) => setSelectedEmployee(e.target.value)}
              // variant="standard"
            >
              <MenuItem value="">None</MenuItem>
              {Object.keys(filterEmployees).map((employeeId) => (
                <MenuItem
                  key={employeeId}
                  value={employeeId}
                  style={
                    employees[employeeId].group ? { color: "lightgrey" } : {}
                  }
                >
                  {employees[employeeId].name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <IconButton
            variant="contained"
            color="primary"
            onClick={handleAdd}
            disabled={!selectedEmployee}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Grid>
      </Grid>
    </>
  );
};

const AddRuleField = ({ handleAddRule, groupId, group }) => {
  const [selectedRule, setSelectedRule] = useState("");

  const handleAdd = () => {
    if (selectedRule) {
      handleAddRule(groupId, selectedRule);
      setSelectedRule("");
    }
  };
  const filteredgroupRulesCollection = group.groupRules
    ? Object.keys(groupRulesCollection).filter(
        (ruleId) => !Object.keys(group.groupRules).includes(ruleId)
      )
    : Object.keys(groupRulesCollection);

  return (
    <>
      <Grid
        item
        container
        spacing={1}
        alignItems="center"
        style={{ flexWrap: "nowrap" }}
      >
        <Grid item style={{ flexGrow: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="rule-add-label">add rule</InputLabel>

            <Select
              labelId="rule-add-label"
              label="add rule"
              fullWidth
              value={selectedRule}
              onChange={(e) => setSelectedRule(e.target.value)}
              // size="small"
              // variant="standard"
            >
              <MenuItem value="">None</MenuItem>

              {filteredgroupRulesCollection.map((ruleId) => (
                <MenuItem key={ruleId} value={ruleId}>
                  {ruleId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <IconButton
            variant="contained"
            color="primary"
            onClick={handleAdd}
            disabled={!selectedRule}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Grid>
      </Grid>
    </>
  );
};

export { AddEmployeeField, AddRuleField };
