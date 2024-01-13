import { Button, Grid } from "@mui/material";

const ExportCsv = ({
  dateRange,
  groups,
  employees,
  schedule,
  userAdjustedSchedule,
  employeeCodeCount,
}) => {
  const handleExportCSV = () => {
    const csvContent = generateCSVContent(schedule);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "employee_schedule.csv";
    link.click();
  };

  const generateCSVContent = (schedule) => {
    const csvRows = [];

    // Add CSV header
    const dateHeader = dateRange.map((day) => day.date);
    dateHeader.unshift("");
    dateHeader.unshift("");
    csvRows.push(dateHeader.join(","));
    const dayOfWeekHeader = dateRange.map((day) => day.dayOfWeek);
    dayOfWeekHeader.unshift("");
    dayOfWeekHeader.unshift("");
    csvRows.push(dayOfWeekHeader.join(","));

    Object.values(groups).forEach((group) => {
      csvRows.push([group.name].join(","));
      group.employees &&
        group.employees.forEach((employeeId, idx) => {
          const employeeRow = [];
          employeeRow.push(employees[employeeId].name);

          dateRange.forEach((day) => {
            const val =
              (userAdjustedSchedule[employeeId] &&
                userAdjustedSchedule[employeeId][day.date]) ||
              (schedule[employeeId] && schedule[employeeId][day.date]) ||
              "";
            employeeRow.push(val);
          });
          employeeRow.push(employeeCodeCount(employeeId));
          employeeRow.unshift("");
          csvRows.push(employeeRow.join(","));
        });
    });

    return csvRows.join("\n");
  };

  return (
    <>
      <Grid item sx={{ mb: 1 }}>
        <Button variant="contained" size="small" onClick={handleExportCSV}>
          Export as CSV
        </Button>
      </Grid>
    </>
  );
};

export default ExportCsv;
