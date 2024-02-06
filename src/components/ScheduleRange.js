import React from "react";
import dayjs from "dayjs";
import { Form, InputNumber, Button, DatePicker, Space } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

function ScheduleRange({ scheduleRange, setScheduleRange }) {
  const handleDateChange = (date) => {
    setScheduleRange({ ...scheduleRange, selectedDate: date });
  };

  const handleNumOfWksChange = (value) => {
    setScheduleRange({ ...scheduleRange, numOfWks: value });
  };

  const handleAdvance = () => {
    const newDate = dayjs(scheduleRange.selectedDate).add(
      scheduleRange.numOfWks,
      "week"
    );
    setScheduleRange({ ...scheduleRange, selectedDate: newDate });
  };

  const handleGoBack = () => {
    const newDate = dayjs(scheduleRange.selectedDate).subtract(
      scheduleRange.numOfWks,
      "week"
    );
    setScheduleRange({ ...scheduleRange, selectedDate: newDate });
  };

  return (
    <>
      <Form.Item label="day">
        <DatePicker
          format="MM/DD/YYYY"
          value={dayjs(scheduleRange.selectedDate)}
          onChange={handleDateChange}
          allowClear={false}
        />
      </Form.Item>

      <Form.Item label="num (weeks)">
        <InputNumber
          value={scheduleRange.numOfWks}
          onChange={handleNumOfWksChange}
          min={1}
          max={11}
        />
      </Form.Item>

      <Form.Item>
        <Space gap="small">
          <Button
            onClick={handleGoBack}
            icon={<LeftOutlined />}
            shape="circle"
            type="primary"
            size="small"
          />

          <Button
            onClick={handleAdvance}
            icon={<RightOutlined />}
            shape="circle"
            type="primary"
            size="small"
          />
        </Space>
      </Form.Item>
    </>
  );
}

export default ScheduleRange;
