import { Form, InputNumber } from "antd";

const WeekDaysOff = ({ daysOffPerWeek, setDaysOffPerWeek }) => {
  return (
    <>
      <Form layout="inline">
        <Form.Item label="off days (week)">
          <InputNumber
            min={1}
            value={daysOffPerWeek}
            onChange={(value) => setDaysOffPerWeek(value)}
          />
        </Form.Item>
      </Form>
    </>
  );
};

export default WeekDaysOff;
