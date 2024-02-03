// import { Button, Grid } from "@mui/material";
import { Button, Flex, Upload } from "antd";

const ExportCsv = ({
  dateRange,
  groups,
  employees,
  schedule,
  userAdjustedSchedule,
  employeeCodeCount,
  codes,
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
            const userAdjustedEmpId = userAdjustedSchedule[employeeId];
            const scheduleEmpId = schedule[employeeId];
            const val =
              (userAdjustedEmpId &&
                codes[day.dayOfWeek][userAdjustedEmpId[day.date]]?.name) ||
              (userAdjustedEmpId &&
                codes.Add[userAdjustedEmpId[day.date]]?.name) ||
              (scheduleEmpId && scheduleEmpId[day.date]) ||
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
      <Button type="primary" onClick={handleExportCSV}>
        Export as CSV
      </Button>
    </>
  );
};

export default ExportCsv;
