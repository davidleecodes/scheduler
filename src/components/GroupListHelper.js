import React from "react";

import { groupRulesCollection } from "./GroupRulesCollection";

import { Select, Flex, Typography, Form, Button, theme } from "antd";
import { MinusOutlined, HolderOutlined } from "@ant-design/icons";
import { geekblue } from "@ant-design/colors";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const { Text } = Typography;

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
        placeholder="chose employee"
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
        placeholder="chose rule"
        filterOption={filterOption}
        showSearch
      />
    </>
  );
};

const GroupEmployees = ({
  group,
  employees,
  setEmployees,
  handleDeleteEmployee,
  groupId,
  setGroups,
}) => {
  let employeeListIds = group.employees;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getItemPos = (id) =>
    employeeListIds.findIndex((employeeId) => employeeId === id);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    setGroups((prev) => {
      let updateGroups = { ...prev };
      const originalPos = getItemPos(active.id);
      const newPos = getItemPos(over.id);
      updateGroups[groupId] = {
        ...prev[groupId],
        employees: arrayMove(employeeListIds, originalPos, newPos),
      };
      return updateGroups;
    });
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <div>
        <SortableContext
          items={employeeListIds}
          strategy={verticalListSortingStrategy}
        >
          <Flex gap="small" vertical>
            {employeeListIds.map((employeeId) => (
              <Employee
                key={employeeId}
                id={employeeId}
                group={group}
                employees={employees}
                setEmployees={setEmployees}
                handleDeleteEmployee={handleDeleteEmployee}
                groupId={groupId}
                employeeId={employeeId}
              />
            ))}
          </Flex>
        </SortableContext>
      </div>
    </DndContext>
  );
};

const Employee = ({
  id,
  group,
  employees,
  setEmployees,
  handleDeleteEmployee,
  groupId,
  employeeId,
}) => {
  const {
    token: { borderRadiusSM },
  } = theme.useToken();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    touchAction: "none",
  };
  return (
    <div ref={setNodeRef} style={style}>
      <Flex gap="small" align="center">
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
          <Flex justify="space-between">
            <Text strong>{employees[employeeId].name}</Text>
            <Button
              {...attributes}
              {...listeners}
              icon={<HolderOutlined />}
              type="text"
            />
          </Flex>

          <Form layout="horizontal" style={{ maxWidth: 500 }}>
            {employees[employeeId].groupRules &&
              Object.keys(employees[employeeId].groupRules).map((ruleId) => {
                const Rule = groupRulesCollection[ruleId].employee.component;
                return (
                  <Rule
                    key={ruleId}
                    ruleData={employees[employeeId].groupRules[ruleId].data}
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
          onClick={(event) => handleDeleteEmployee(employeeId, groupId, event)}
          icon={<MinusOutlined />}
          shape="circle"
          size="small"
        />
      </Flex>
    </div>
  );
};

export { AddEmployeeField, AddRuleField, GroupEmployees };
