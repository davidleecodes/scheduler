import { Button, Grid } from "@mui/material";

const Generator = ({
  employees,
  codes,
  schedule,
  userAdjustedSchedule,
  setuserAdjustedSchedule,
  dateRange,
}) => {
  const handleGenerate = () => {
    const randomizedEmployeeIds = Object.keys(employees).sort(
      () => Math.random() - 0.5
    );
    const updatedUserAdjustedSchedule = { ...userAdjustedSchedule };

    dateRange.forEach((day) => {
      Object.keys(codes[day.dayOfWeek]).forEach((codeId) => {
        let index = 0;
        let employeeId = randomizedEmployeeIds[index];

        while (schedule[employeeId] && schedule[employeeId][day.date]) {
          console.log(index, employeeId);
          index++;
          employeeId = randomizedEmployeeIds[index];
        }
        let removedEmployee = randomizedEmployeeIds.splice(index, 1);
        randomizedEmployeeIds.push(removedEmployee[0]);

        updatedUserAdjustedSchedule[employeeId] = {
          ...updatedUserAdjustedSchedule[employeeId],
          [day.date]: codeId,
        };
      });
    });
    // console.log(updatedUserAdjustedSchedule);
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
