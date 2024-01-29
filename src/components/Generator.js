import { Button, Grid } from "@mui/material";
import { shuffleArray, daysShort } from "./utils";
import dayjs from "dayjs";

const Generator = ({
  employees,
  codes,
  schedule,
  setuserAdjustedSchedule,
  dateRange,
}) => {
  const handleGenerate = () => {
    const shuffledEmployeeIds = shuffleArray(Object.keys(employees));
    const updatedUserAdjustedSchedule = {};

    dateRange.forEach((day) => {
      const prevDay = dayjs(day.date).subtract(1, "day");
      const prevDayDate = prevDay.format("MM-DD-YYYY");
      const prevDayWeekday = daysShort[prevDay.weekday()];

      const shuffledCodes = shuffleArray(Object.keys(codes[day.dayOfWeek]));

      shuffledCodes.forEach((codeId) => {
        let index = 0;
        let employeeId = shuffledEmployeeIds[index];
        let isCurrShiftMorning =
          codes[day.dayOfWeek][codeId].shift === "morning";

        // while employee on layer 1 has something, or if on layer 2 employee had night day before and current code is day shift,  pick another employee
        while (
          (index <= shuffledEmployeeIds.length &&
            schedule[employeeId] &&
            schedule[employeeId][day.date]) ||
          (index <= shuffledEmployeeIds.length &&
            isCurrShiftMorning &&
            updatedUserAdjustedSchedule[employeeId] &&
            updatedUserAdjustedSchedule[employeeId][prevDayDate] &&
            codes[prevDayWeekday][
              updatedUserAdjustedSchedule[employeeId][prevDayDate]
            ].shift === "evening")
        ) {
          index++;
          employeeId = shuffledEmployeeIds[index];
        }

        let removedEmployee = shuffledEmployeeIds.splice(index, 1);
        shuffledEmployeeIds.push(removedEmployee[0]);

        updatedUserAdjustedSchedule[employeeId] = {
          ...updatedUserAdjustedSchedule[employeeId],
          [day.date]: codeId,
        };
      });
    });
    setuserAdjustedSchedule(updatedUserAdjustedSchedule);
  };

  return (
    <>
      <Grid item sx={{ mb: 1 }}>
        <Button variant="contained" size="small" onClick={handleGenerate}>
          Generate
        </Button>
      </Grid>
    </>
  );
};

export default Generator;
