import React, { useState } from "react";
import { Typography } from "@mui/joy";
import { Sheet as Paper } from "@mui/joy";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionGroup,
} from "@mui/joy";
import { TextField, Grid, IconButton, Button } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ListNavContiner from "./ListNavContainer";

import { groupRulesCollection } from "./GroupRulesCollection";
import { AddEmployeeField, AddRuleField } from "./GroupListHelper";
import { iterateArrayId } from "./utils";

const GroupList = ({ groups, employees, setGroups, setEmployees }) => {
  const [selectedId, setSelectedId] = useState(Object.keys(groups)[0]);

  const handleAddGroup = (data) => {
    const groupIds = Object.keys(groups);
    const newId = iterateArrayId(groupIds, "g");
    setGroups({ ...groups, [newId]: data });
    setSelectedId(newId);
  };

  const addGroupToEmployee = (groupId, employeeId) => {
    const groupRules = groups[groupId].groupRules;
    const updatedEmployees = { ...employees };
    const updatedEmployee = { ...updatedEmployees[employeeId] };

    if (updatedEmployee.group) {
      //do swap
      handleDeleteEmployee(employeeId, updatedEmployee.group);
      updatedEmployee.group = "";
    }
    updatedEmployee.group = groupId;

    if (groupRules) {
      Object.keys(groupRules).forEach((selectedRule) => {
        updatedEmployees[employeeId] = {
          ...updatedEmployee,
          groupRules: updatedEmployee?.groupRules
            ? {
                ...updatedEmployee.groupRules,
                [selectedRule]:
                  groupRulesCollection[selectedRule].employee.defaultValues,
              }
            : {
                [selectedRule]:
                  groupRulesCollection[selectedRule].employee.defaultValues,
              },
        };
      });
    } else {
      const { groupRules, ...rest } = updatedEmployees[employeeId];
      updatedEmployees[employeeId] = rest;
    }

    setEmployees(updatedEmployees);
  };

  const handleAddEmployee = (groupId, employeeId) => {
    addGroupToEmployee(groupId, employeeId);

    const updatedGroups = { ...groups };
    updatedGroups[groupId] = {
      ...updatedGroups[groupId],
      employees: updatedGroups[groupId].employees
        ? [...updatedGroups[groupId].employees, employeeId]
        : [employeeId],
    };
    setGroups(updatedGroups);
  };

  const handleAddRule = (groupId, selectedRule) => {
    const updatedGroups = { ...groups };
    updatedGroups[groupId] = {
      ...updatedGroups[groupId],
      groupRules: updatedGroups[groupId]?.groupRules
        ? { ...updatedGroups[groupId].groupRules, [selectedRule]: {} }
        : {
            [selectedRule]:
              groupRulesCollection[selectedRule].group.defaultValues,
          },
    };
    setGroups(updatedGroups);

    const groupEmployees = groups[groupId].employees;
    const updatedEmployees = { ...employees };
    if (groupEmployees) {
      groupEmployees.forEach((employeeId) => {
        const updatedEmployee = { ...updatedEmployees[employeeId] };
        updatedEmployees[employeeId] = {
          ...updatedEmployee,
          groupRules: updatedEmployee?.groupRules
            ? {
                ...updatedEmployee.groupRules,
                [selectedRule]:
                  groupRulesCollection[selectedRule].employee.defaultValues,
              }
            : {
                [selectedRule]:
                  groupRulesCollection[selectedRule].employee.defaultValues,
              },
        };
      });
      setEmployees(updatedEmployees);
    }
  };

  const handleRemoveGroup = (groupId) => {
    const { [groupId]: group, ...rest } = groups;
    setSelectedId(Object.keys(rest)[0]);

    setGroups(rest);
  };
  const handleRuleDelete = (ruleId, groupId) => {
    const updatedGroups = { ...groups };
    const updatedGroupRules = updatedGroups[groupId].groupRules;

    const { [ruleId]: rule, ...rest } = updatedGroupRules;
    updatedGroups[groupId].groupRules = rest;
    setGroups(updatedGroups);

    const groupEmployees = groups[groupId].employees;
    const updatedEmployees = { ...employees };

    groupEmployees.forEach((employeeId) => {
      const updatedEmployeeRules = updatedEmployees[employeeId].groupRules;

      const { [ruleId]: employeeRule, ...employeeRest } = updatedEmployeeRules;
      updatedEmployees[employeeId].groupRules = employeeRest;
    });

    setEmployees(updatedEmployees);
  };

  const handleOnChange = (groupId, event) => {
    const { name, value } = event.target;
    setGroups((prev) => ({
      ...prev,
      [groupId]: { ...prev[groupId], [name]: value },
    }));
  };
  const handleDeleteEmployee = (employeeId, groupId) => {
    const updatedGroups = { ...groups };
    const updatedEmployees = updatedGroups[groupId].employees.filter(
      (employee) => employee !== employeeId
    );
    updatedGroups[groupId].employees = updatedEmployees;
    setGroups(updatedGroups);
  };

  // console.log("group list");
  const groupId = selectedId;
  const group = groups[groupId];

  return (
    <>
      <ListNavContiner
        collection={groups}
        onAddItem={handleAddGroup}
        addLabel={"new group Name"}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        deleteLabel={"delete group"}
        onDeleteItem={handleRemoveGroup}
      >
        <Grid item style={{ flexGrow: 1 }}>
          <Grid item container direction={"column"} spacing={1}>
            <Grid item key={groupId}>
              <TextField
                name="name"
                value={group.name}
                onChange={(event) => handleOnChange(groupId, event)}
                variant="standard"
                label="Group Name"
              />

              <AccordionGroup size={"sm"}>
                <Accordion defaultExpanded={true}>
                  <AccordionSummary>
                    <Typography variant="h6"> Rules:</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid item container spacing={1}>
                      {group.groupRules &&
                        Object.keys(group.groupRules).map((ruleId) => {
                          const Rule =
                            groupRulesCollection[ruleId].group.component;
                          return (
                            <Grid
                              item
                              container
                              key={ruleId}
                              style={{ flexWrap: "nowrap" }}
                              spacing={1}
                            >
                              <Grid item style={{ flexGrow: 1 }}>
                                <Paper sx={{ mb: 1, p: 1 }}>
                                  <Rule
                                    ruleData={group.groupRules[ruleId]?.data}
                                    setGroups={setGroups}
                                    groupId={groupId}
                                    groups={groups}
                                  />
                                </Paper>
                              </Grid>
                              <Grid item>
                                <IconButton
                                  color="secondary"
                                  onClick={() =>
                                    handleRuleDelete("interval", groupId)
                                  }
                                >
                                  <RemoveCircleOutlineIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          );
                        })}
                      <AddRuleField
                        group={group}
                        handleAddRule={handleAddRule}
                        groupId={groupId}
                      />
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                {/*  */}
                <Accordion defaultExpanded={true}>
                  <AccordionSummary>
                    <Typography variant="h6"> Employees:</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid item container spacing={1}>
                      {group.employees &&
                        group.employees.map((employeeId) => {
                          if (employees[employeeId]) {
                            return (
                              <Grid
                                item
                                key={employeeId}
                                container
                                style={{ flexWrap: "nowrap" }}
                                spacing={1}
                              >
                                <Grid item style={{ flexGrow: 1 }}>
                                  <Paper sx={{ mb: 1, p: 1 }}>
                                    <Typography variant="subtitle1">
                                      {employees[employeeId].name}
                                    </Typography>
                                    {employees[employeeId].groupRules &&
                                      Object.keys(
                                        employees[employeeId].groupRules
                                      ).map((ruleId) => {
                                        const Rule =
                                          groupRulesCollection[ruleId].employee
                                            .component;
                                        return (
                                          <Rule
                                            key={ruleId}
                                            ruleData={
                                              employees[employeeId].groupRules[
                                                ruleId
                                              ].data
                                            }
                                            employees={employees}
                                            setEmployees={setEmployees}
                                            employeeId={employeeId}
                                            groupRuleData={
                                              group.groupRules &&
                                              group.groupRules[ruleId] &&
                                              group.groupRules[ruleId].data
                                            }
                                          />
                                        );
                                      })}
                                  </Paper>
                                </Grid>
                                <Grid item>
                                  <IconButton
                                    onClick={(event) =>
                                      handleDeleteEmployee(
                                        employeeId,
                                        groupId,
                                        event
                                      )
                                    }
                                    color="secondary"
                                  >
                                    <RemoveCircleOutlineIcon />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            );
                          }
                          return <></>;
                        })}

                      <AddEmployeeField
                        employees={employees}
                        handleAddEmployee={handleAddEmployee}
                        groupId={groupId}
                        group={group}
                      />
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </AccordionGroup>
            </Grid>
          </Grid>
        </Grid>
      </ListNavContiner>
    </>
  );
};

export default GroupList;
