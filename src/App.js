import React from "react";
import { Grid } from "@mui/material";
import Settings from "./components/Settings";
import { ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            /* here is your component tokens */
            headerHeight: 0,
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
