import React, { useState } from "react";
import { Button, Form, Input, Select, theme, Flex, Typography } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { geekblue } from "@ant-design/colors";

import dayjs from "dayjs";
import { daysShort, iterateArrayId, daysShortLong } from "./utils";
import ListNavContiner from "./ListNavContainer";

const shiftOptions = [
  { value: "morning", label: "morning" },
  { value: "evening", label: "evening" },
  { value: "none", label: "none" },
];
const AddField = ({ handleAddCode, day }) => {
  const [newCodeName, setNewCodeName] = useState("");

  const handleAdd = () => {
    handleAddCode(day, {
      name: newCodeName,
      shift: shiftOptions[0].value,
    }); // default morning
    setNewCodeName("");
  };
  return (
    <>
      <Flex gap="small">
        <Input
          placeholder="New Code name"
          value={newCodeName}
          onChange={(e) => setNewCodeName(e.target.value)}
        />

        <Button
          onClick={handleAdd}
          disabled={!newCodeName}
          icon={<PlusOutlined />}
          shape="circle"
          type="primary"
          size="small"
        />
      </Flex>
    </>
  );
};

const CodeList = ({
  codes,
  setCodes,
  userAdjustedSchedule,
  setuserAdjustedSchedule,
}) => {
  const [selectedId, setSelectedId] = React.useState(Object.keys(codes)[0]);

  const {
    token: { borderRadiusSM },
  } = theme.useToken();
  const { Text } = Typography;

  const handleCodeChange = (day, codeId, value, name) => {
    const updatedCodes = { ...codes };
    updatedCodes[day][codeId] = { ...updatedCodes[day][codeId], [name]: value };
    setCodes(updatedCodes);
  };

  const deleteCodeFromSchedule = (day, codeId) => {
    const updatedSchedule = { ...userAdjustedSchedule };
    Object.entries(updatedSchedule).forEach(([employeeId, employee]) => {
      const updatedEmplyeeArr = Object.entries(employee).reduce(
        (acc, [date, code]) => {
          if (day === daysShort[dayjs(date).weekday()] && code === codeId)
            return acc;

          return [...acc, [date, code]];
        },
        []
      );
      const updatedEmployee = Object.fromEntries(updatedEmplyeeArr);
      updatedSchedule[employeeId] = updatedEmployee;
    });
    setuserAdjustedSchedule(updatedSchedule);
  };

  const handleCodeDelete = (day, codeId) => {
    const updatedCodes = { ...codes };
    const { [codeId]: code, ...rest } = updatedCodes[day];
    updatedCodes[day] = rest;
    setCodes(updatedCodes);
    deleteCodeFromSchedule(day, codeId);
  };

  const handleAddCode = (day, data) => {
    const updatedCodes = { ...codes };
    const dayCodes = Object.keys(updatedCodes[day]);
    updatedCodes[day] = {
      ...updatedCodes[day],
      [iterateArrayId(dayCodes, day)]: data,
    };
    setCodes(updatedCodes);
  };

  // console.log("code list");
  const { Internal, ...codesN } = codes;
  const day = selectedId;
  const collection = {};
  Object.entries(codesN).forEach(
    ([id, day]) => (collection[id] = { name: daysShortLong[id] })
  );
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
  return (
    <>
      <ListNavContiner
        collection={collection}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        isSimple={true}
      >
        <>
          <Flex gap="small" vertical>
            <Text strong>{daysShortLong[day]}</Text>

            {Object.entries(codesN[day]).map(([codeId, code]) => (
              <Flex gap="small">
                <Flex
                  gap="small"
                  style={{
                    background: geekblue[0],
                    borderRadius: borderRadiusSM,
                    padding: "2px 8px",
                    flexGrow: 1,
                  }}
                >
                  <Form
                    // {...formItemLayout}
                    layout="inline"
                    // style={{ maxWidth: 500 }}
                  >
                    <Form.Item label="name">
                      <Input
                        value={code.name}
                        onChange={(event) =>
                          handleCodeChange(
                            day,
                            codeId,
                            event.target.value,
                            "name"
                          )
                        }
                        name="name"
                      />
                    </Form.Item>

                    <Form.Item label="shift">
                      <Select
                        onChange={(value) =>
                          handleCodeChange(day, codeId, value, "shift")
                        }
                        name="shift"
                        value={code.shift}
                        options={shiftOptions}
                      />
                    </Form.Item>
                  </Form>
                </Flex>

                <Button
                  onClick={() => handleCodeDelete(day, codeId)}
                  icon={<MinusOutlined />}
                  shape="circle"
                  size="small"
                />
              </Flex>
            ))}
            <AddField handleAddCode={handleAddCode} day={day} />
          </Flex>
        </>
      </ListNavContiner>
    </>
  );
};

export default CodeList;
