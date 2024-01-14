import React from "react";
import { Button, Grid } from "@mui/material";

function exportToJsonFile(data, fileName) {
  const jsonData = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName || "exportedSettings.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Example usage in a React component
const Export = ({ employees, groups, scheduleRange, codes }) => {
  const handleExportButtonClick = () => {
    const state = { employees, groups, scheduleRange, codes };
    exportToJsonFile(state, "exportedSettings.json");
  };

  return (
    <>
      <Button
        variant="contained"
        size="small"
        onClick={handleExportButtonClick}
      >
        Export Settings
      </Button>
    </>
  );
};

const Import = ({ setEmployees, setGroups, setScheduleRange, setCodes }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          // console.log(jsonData);
          setEmployees(jsonData.employees);
          setGroups(jsonData.groups);
          setScheduleRange(jsonData.scheduleRange);
          setCodes(jsonData.codes);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <>
      <Button variant="contained" size="small" component="label">
        Import Settings
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </>
  );
};

const ImportExport = ({
  employees,
  groups,
  scheduleRange,
  codes,
  setEmployees,
  setGroups,
  setScheduleRange,
  setCodes,
}) => {
  return (
    <Grid container spacing={1} justifyContent="flex-end">
      <Grid item>
        <Import
          setEmployees={setEmployees}
          setGroups={setGroups}
          setScheduleRange={setScheduleRange}
          setCodes={setCodes}
        />
      </Grid>
      <Grid item>
        <Export
          employees={employees}
          groups={groups}
          scheduleRange={scheduleRange}
          codes={codes}
        />
      </Grid>
    </Grid>
  );
};

export { ImportExport };
