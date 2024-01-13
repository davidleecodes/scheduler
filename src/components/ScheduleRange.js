import React from "react";
import { TextField, IconButton, Grid } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import dayjs from "dayjs";

function ScheduleRange({ scheduleRange, setScheduleRange }) {
  // console.log(scheduleRange);
  const handleDateChange = (date) => {
    setScheduleRange({ ...scheduleRange, selectedDate: date });
  };

  const handleNumOfWksChange = (event) => {
    const value = event.target.value;
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
  // useEffect(() => {
  //   const newDate = scheduleRange.selectedDate
  //     ? dayjs(scheduleRange.selectedDate).format("MM/DD/YYYY")
  //     : dayjs().format("MM/DD/YYYY");
  //   setScheduleRange({ ...scheduleRange, selectedDate: newDate });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // dayjs.isDayjs(scheduleRange.selectedDate)
  // ? scheduleRange.selectedDate
  // :""

  return (
    <>
      <Grid item container direction={"column"} spacing={3}>
        <Grid item container direction={"row"} spacing={1}>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="MM/DD/YYYY"
                value={
                  dayjs(scheduleRange.selectedDate)
                  // scheduleRange && scheduleRange.selectedDate
                  //   ? scheduleRange.selectedDate
                  //   : ""
                  // ? dayjs(scheduleRange.selectedDate).format("MM/DD/YYYY")
                  // : ""
                  // ? dayjs(scheduleRange.selectedDate).format("MM/DD/YYYY")
                  // : ""
                }
                onChange={handleDateChange}
                slotProps={{ textField: { size: "small" } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item>
            <TextField
              label="Number of Weeks"
              type="number"
              value={scheduleRange.numOfWks}
              onChange={handleNumOfWksChange}
              size="small"
              inputProps={{ min: 1, max: 11 }}
            />
          </Grid>
          <Grid item>
            <IconButton color="primary" onClick={handleGoBack}>
              <ArrowBackIosNewIcon />
            </IconButton>

            <IconButton color="primary" onClick={handleAdvance}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default ScheduleRange;
