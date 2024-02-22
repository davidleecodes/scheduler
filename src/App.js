import React from "react";
import { Grid } from "@mui/material";
import Settings from "./components/Settings";
import { ConfigProvider } from "antd";
import "./App.css";
// import "./components/style.css";
function App() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            /* here is your component tokens */
            headerHeight: 0,
          },
          Table: {
            /* here is your component tokens */
            cellPaddingInlineSM: 0, //default 8 horzintal
            cellPaddingBlockSM: 4, //default 8 vertical
            cellFontSizeSM: 12, // default14
          },
          Select: {
            /* here is your component tokens */
            // optionPadding: 0,
            // controlPaddingHorizontalSM: 0,
            // paddingXS: 0,
            // optionFontSize: 14,
          },
        },
      }}
    >
      <Grid sx={{ m: 2 }}>
        <Settings />
      </Grid>
    </ConfigProvider>
  );
}

export default App;
