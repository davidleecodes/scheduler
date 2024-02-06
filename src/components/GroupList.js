import React, { useState } from "react";

import ListNavContiner from "./ListNavContainer";

import { groupRulesCollection } from "./GroupRulesCollection";
import { AddEmployeeField, AddRuleField } from "./GroupListHelper";
import { iterateArrayId } from "./utils";
import { geekblue } from "@ant-design/colors";
import {
  Button,
  Form,
  Input,
  Flex,
  Collapse,
  theme,
  Typography,
  Empty,
} from "antd";
import { MinusOutlined } from "@ant-design/icons";
const { Title, Paragraph, Text } = Typography;

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
    const updatedGroupEmployees = updatedGroups[groupId].employees.filter(
      (employee) => employee !== employeeId
    );
    updatedGroups[groupId].employees = updatedGroupEmployees;
    setGroups(updatedGroups);
    const updatedEmployees = { ...employees };
    updatedEmployees[employeeId] = {
      ...updatedEmployees[employeeId],
      group: "",
    };
    setEmployees(updatedEmployees);
  };
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

  // console.log("group list");
  const groupId = selectedId;
  const group = groups[groupId];
  const {
    token: { colorBgElevated, borderRadiusSM, colorPrimary },
  } = theme.useToken();
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
        {group && (
          <>
            <Flex vertical gap="small">
              <Form
                {...formItemLayout}
                layout="horizontal"
                style={{ maxWidth: 500 }}
              >
                <Form.Item label="name">
                  <Input
                    value={group.name}
                    onChange={(event) => handleOnChange(groupId, event)}
                    name="name"
                  />
                </Form.Item>
              </Form>

              {/* <Collapse
                ghost
                items={[
                  {
                    key: "1",
                    label: "rules",
                    children: (
                      <> */}
              <Flex gap="small" vertical>
                <Title level={5}>rules</Title>
                {!group.groupRules && (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
                {group.groupRules &&
                  Object.keys(group.groupRules).map((ruleId) => {
                    const Rule = groupRulesCollection[ruleId].group.component;
                    return (
                      <Flex gap="small" key={ruleId} align="center">
                        <Flex
                          gap="small"
                          vertical
                          style={{
                            background: geekblue[0],
                            borderRadius: borderRadiusSM,
                            padding: "2px 8px",
                            flexGrow: 1,
                          }}
                        >
                          <Rule
                            ruleData={group.groupRules[ruleId]?.data}
                            setGroups={setGroups}
                            groupId={groupId}
                            groups={groups}
                          />
                        </Flex>

                        <Button
                          onClick={() => handleRuleDelete("interval", groupId)}
                          icon={<MinusOutlined />}
                          shape="circle"
                          size="small"
                        />
                      </Flex>
                    );
                  })}
                <AddRuleField
                  group={group}
                  handleAddRule={handleAddRule}
                  groupId={groupId}
                />
              </Flex>
              {/* </>
                    ),
                  },
                ]}
              /> */}

              {/* <Collapse
                ghost
                items={[
                  {
                    key: "1",
                    label: "employees",
                    children: (
                      <> */}
              <Flex gap="small" vertical>
                <Title level={5}>employees</Title>
                {!group.employees && (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
                {group.employees &&
                  group.employees.map((employeeId) => {
                    if (employees[employeeId]) {
                      return (
                        <Flex gap="small" align="center" key={employeeId}>
                          <Flex
                            gap="small"
                            vertical
                            style={{
                              background: geekblue[0],
                              borderRadius: borderRadiusSM,
                              padding: "2px 8px",
                              flexGrow: 1,
                            }}
                          >
                            <Text strong>{employees[employeeId].name}</Text>
                            <Form
                              // {...formItemLayout}
                              layout="horizontal"
                              style={{ maxWidth: 500 }}
                              // size="small"
                            >
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
                                        employees[employeeId].groupRules[ruleId]
                                          .data
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
                            </Form>
                          </Flex>

                          <Button
                            onClick={(event) =>
                              handleDeleteEmployee(employeeId, groupId, event)
                            }
                            icon={<MinusOutlined />}
                            shape="circle"
                            size="small"
                          />
                        </Flex>
                      );
                    }
                  })}

                <AddEmployeeField
                  employees={employees}
                  handleAddEmployee={handleAddEmployee}
                  groupId={groupId}
                  group={group}
                />
              </Flex>
              {/* </>
                    ),
                  },
                ]}
              /> */}
            </Flex>
          </>
        )}
      </ListNavContiner>
    </>
  );
};

export default GroupList;
