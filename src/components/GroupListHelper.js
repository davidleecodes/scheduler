import React from "react";

import { groupRulesCollection } from "./GroupRulesCollection";
import { Select } from "antd";

const filterOption = (input, option) =>
  (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

const AddEmployeeField = ({ employees, handleAddEmployee, groupId, group }) => {
  const filterEmployeesEnteries = () => {
    if (group?.employees) {
      const array = Object.entries(employees).filter(
        ([employeeId, employee]) => !group.employees.includes(employeeId)
      );
      return Object.fromEntries(array);
    } else return employees;
  };

  const filterEmployees = filterEmployeesEnteries();
  const options = Object.keys(filterEmployees).map((employeeId) => ({
    value: employeeId,
    label: employees[employeeId].name,
    className: employees[employeeId].group && "selected-opt",
  }));

  return (
    <>
      <Select
        value={null}
        onSelect={(value) => {
          handleAddEmployee(groupId, value);
        }}
        options={options}
        placeholder="add employee"
        filterOption={filterOption}
        showSearch
      />
    </>
  );
};

const AddRuleField = ({ handleAddRule, groupId, group }) => {
  const filteredgroupRulesCollection = group.groupRules
    ? Object.keys(groupRulesCollection).filter(
        (ruleId) => !Object.keys(group.groupRules).includes(ruleId)
      )
    : Object.keys(groupRulesCollection);

  const options = filteredgroupRulesCollection.map((ruleId) => ({
    value: ruleId,
    label: ruleId,
  }));

  return (
    <>
      <Select
        value={null}
        onSelect={(value) => {
          handleAddRule(groupId, value);
        }}
        options={options}
        placeholder="add rule"
        filterOption={filterOption}
        showSearch
      />
    </>
  );
};

export { AddEmployeeField, AddRuleField };
