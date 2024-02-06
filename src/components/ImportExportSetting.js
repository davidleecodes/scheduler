import React from "react";
import { Button, Flex } from "antd";

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

const Export = ({
  employees,
  groups,
  scheduleRange,
  codes,
  daysOffPerWeek,
}) => {
  const handleExportButtonClick = () => {
    const state = { employees, groups, scheduleRange, codes, daysOffPerWeek };
    exportToJsonFile(state, "exportedSettings.json");
  };

  return (
    <>
      <Button type="primary" onClick={handleExportButtonClick}>
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
      <Button type="primary" component="label">
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
    <>
      <Flex justify="flex-end" gap="small">
        <Import
          setEmployees={setEmployees}
          setGroups={setGroups}
          setScheduleRange={setScheduleRange}
          setCodes={setCodes}
        />
        <Export
          employees={employees}
          groups={groups}
          scheduleRange={scheduleRange}
          codes={codes}
        />
      </Flex>
    </>
  );
};

export { ImportExport };
