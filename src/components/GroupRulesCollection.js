import React, { useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  InputLabel,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { daysShort } from "./utils";

// const localeData = require("dayjs/plugin/localeData");
// dayjs.extend(localeData);

// const daysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// const weekdaysShort = daysShort.map((day) => day.toLowerCase());

const IntervalGroup = ({ ruleData, setGroups, groupId, groups }) => {
  const [selectedDays, setSelectedDays] = useState(ruleData?.days || []);
  const [everyNumberOfWeeks, setEveryNumberOfWeeks] = useState(
    ruleData?.everyNumberOfWeeks || ""
  );

  const handleDayChange = (day) => {
    const newSelectedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(newSelectedDays);

    const updatedGroups = { ...groups };
    updatedGroups[groupId].groupRules.interval.data.days = newSelectedDays;
    setGroups(updatedGroups);
  };

  const handleEveryNumberOfWeeksChange = (event) => {
    setEveryNumberOfWeeks(event.target.value);
    const updatedGroups = { ...groups };
    updatedGroups[groupId].groupRules.interval.data.everyNumberOfWeeks =
      event.target.value;

    setGroups(updatedGroups);
  };

  return (
    <Grid container spacing={1}>
      <Grid item style={{ width: 120 }}>
        <InputLabel>Group Interval</InputLabel>
      </Grid>
      <Grid item>
        <Grid container alignItems="flex-end" spacing={2}>
          <Grid item sx={{ mr: 5 }} style={{ minWidth: "120px" }}>
            <TextField
              label="Num of Wks"
              type="number"
              value={everyNumberOfWeeks}
              onChange={handleEveryNumberOfWeeksChange}
              inputProps={{ min: 2, max: 10 }}
              size="small"
              variant="standard"
              fullWidth
            />
          </Grid>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <Grid item key={day}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedDays.includes(day)}
                    onChange={() => handleDayChange(day)}
                    size="small"
                  />
                }
                label={day}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

const IntervalEmployee = ({
  ruleData,
  employees,
  setEmployees,
  employeeId,
  groupRuleData,
}) => {
  const [selectedDate, setSelectedDate] = useState(
    dayjs(ruleData.startDay) || ""
  );

  const selectedDaysIndex =
    groupRuleData &&
    groupRuleData.days &&
    groupRuleData.days.map((day) => daysShort.indexOf(day));
  // groupRuleData.days.map((day) => weekdaysShort.indexOf(day.toLowerCase()));

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const updatedEmployees = { ...employees };
    updatedEmployees[employeeId].groupRules.interval.data.startDay = date;
    setEmployees(updatedEmployees);
  };
  function disableDay(date) {
    return selectedDaysIndex
      ? !selectedDaysIndex.includes(dayjs(date).weekday())
      : false;
  }
  return (
    <Grid container spacing={1}>
      <Grid item style={{ width: 120 }}>
        <InputLabel>Group Interval</InputLabel>
      </Grid>
      <Grid item>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            format="MM/DD/YYYY"
            value={selectedDate}
            onChange={handleDateChange}
            // shouldDisableDate={disableDay}
            slotProps={{ textField: { size: "small" } }}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
};

const intervalGroupOnChange = (startDate, endDate, employeeData, groupData) => {
  const { days, everyNumberOfWeeks } = groupData;
  const { startDay } = employeeData;

  const selectedDaysIndex = days.map((day) =>
    // weekdaysShort.indexOf(day.toLowerCase())
    daysShort.indexOf(day)
  );
  let startDateMod = startDate.subtract(1, "day");
  const endDateMod = dayjs(endDate).add(1, "day");

  const result = {};
  let currentDate = dayjs(startDay).subtract(1, "day");

  const end = dayjs(endDate).startOf("day");

  let count = 1;
  while (currentDate.isSameOrBefore(end)) {
    // eslint-disable-next-line no-loop-func

    // eslint-disable-next-line no-loop-func
    selectedDaysIndex.forEach((index) => {
      const newDate = currentDate.weekday(index);
      const newDateFormated = newDate.format("MM-DD-YYYY");

      if (newDate.isBetween(startDateMod, endDateMod)) {
        if (count < everyNumberOfWeeks) {
          result[newDateFormated] = "x";
        } else if (count >= everyNumberOfWeeks) {
          // result[newDateFormated] = "h";
        }
      }
    });
    if (count >= everyNumberOfWeeks) count = 0;
    currentDate = currentDate.add(1, "week");
    count += 1;

    // currentDate = currentDate.add(everyNumberOfWeeks, "week");
  }
  return result;
};

const groupRulesCollection = {
  interval: {
    group: {
      component: IntervalGroup,
      onChange: intervalGroupOnChange,
      defaultValues: { data: { days: ["Sat", "Sun"], everyNumberOfWeeks: 2 } },
    },
    employee: {
      component: IntervalEmployee,
      defaultValues: { data: { startDay: dayjs() } },
    },
  },
};

export { groupRulesCollection };
