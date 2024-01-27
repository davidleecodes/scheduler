import React, { useState } from "react";
import { Typography } from "@mui/joy";
import { Sheet as Paper } from "@mui/joy";

import { TextField, IconButton, Grid, Select, MenuItem } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import dayjs from "dayjs";
import { daysShort, iterateArrayId } from "./utils";

const shifts = {
  morning: "morning",
  evening: "evening",
  none: "none",
};

const AddField = ({ handleAddCode, day }) => {
  const [newCodeName, setNewCodeName] = useState("");

  const handleAdd = () => {
    handleAddCode(day, { name: newCodeName, shift: shifts.morning }); // default morning
    setNewCodeName("");
  };
  return (
    <>
      <Grid item style={{ flexGrow: 1 }}>
        <TextField
          label="New Code"
          value={newCodeName}
          onChange={(e) => setNewCodeName(e.target.value)}
          fullWidth
          size="small"
          variant="standard"
        />
      </Grid>
      <Grid item>
        <IconButton
          variant="contained"
          color="primary"
          onClick={handleAdd}
          disabled={!newCodeName}
        >
          <AddCircleOutlineIcon />
        </IconButton>
      </Grid>
    </>
  );
};

const CodeList = ({
  codes,
  setCodes,
  userAdjustedSchedule,
  setuserAdjustedSchedule,
}) => {
  const handleCodeChange = (day, codeId, event) => {
    const { name, value } = event.target;
    const updatedCodes = { ...codes };
    updatedCodes[day][codeId] = { ...updatedCodes[day][codeId], [name]: value };
    setCodes(updatedCodes);
  };
  // const daysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const deleteCodeFromSchedule = (day, codeId) => {
    const updatedSchedule = { ...userAdjustedSchedule };
    Object.entries(updatedSchedule).forEach(([employeeId, employee]) => {
      const updatedEmplyeeArr = Object.entries(employee).reduce(
        (acc, [date, code]) => {
          if (day === daysShort[dayjs(date).weekday()] && code === codeId)
            return acc;

          return [...acc, [date, code]];
        },
        []
      );
      const updatedEmployee = Object.fromEntries(updatedEmplyeeArr);
      updatedSchedule[employeeId] = updatedEmployee;
    });
    setuserAdjustedSchedule(updatedSchedule);
  };

  const handleCodeDelete = (day, codeId) => {
    const updatedCodes = { ...codes };
    const { [codeId]: code, ...rest } = updatedCodes[day];
    updatedCodes[day] = rest;
    setCodes(updatedCodes);
    deleteCodeFromSchedule(day, codeId);
  };

  const handleAddCode = (day, data) => {
    const updatedCodes = { ...codes };
    const dayCodes = Object.keys(updatedCodes[day]);
    updatedCodes[day] = {
      ...updatedCodes[day],
      [iterateArrayId(dayCodes, day)]: data,
    };
    setCodes(updatedCodes);
  };

  const { Internal, ...codesN } = codes;
  return (
    <Grid container spacing={1}>
      {Object.keys(codesN).map((day) => (
        <Grid
          item
          xs={4}
          style={{ minWidth: "150px", maxWidth: "400px" }}
          key={day}
        >
          <Paper sx={{ p: 1 }}>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Typography variant="subtitle1">{day}</Typography>
              </Grid>

              {Object.entries(codesN[day]).map(([codeId, code]) => (
                <Grid
                  item
                  container
                  key={codeId}
                  spacing={1}
                  alignItems="center"
                  style={{ flexWrap: "nowrap" }}
                >
                  <Grid item container spacing={2} style={{ flexGrow: 1 }}>
                    <Grid xs={6} item>
                      <TextField
                        value={code.name}
                        onChange={(event) =>
                          handleCodeChange(day, codeId, event)
                        }
                        fullWidth
                        size="small"
                        variant="standard"
                        name="name"
                      />
                    </Grid>
                    <Grid xs={6} item>
                      <Select
                        value={code.shift}
                        onChange={(event) =>
                          handleCodeChange(day, codeId, event)
                        }
                        size="small"
                        variant="standard"
                        name="shift"
                        fullWidth
                      >
                        {Object.keys(shifts).map((shift) => (
                          <MenuItem key={shift} value={shift}>
                            {shift}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <IconButton
                      color="secondary"
                      onClick={() => handleCodeDelete(day, codeId)}
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Grid
                item
                container
                spacing={1}
                alignItems="center"
                style={{ flexWrap: "nowrap" }}
              >
                <AddField handleAddCode={handleAddCode} day={day} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default CodeList;
