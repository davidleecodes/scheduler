import React, { useState } from "react";
import {
  TextField,
  Grid,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const ListNavContiner = ({
  collection,
  onAddItem,
  addLabel,
  children,
  selectedId,
  setSelectedId,
  deleteLabel,
  onDeleteItem,
}) => {
  const [newItemName, setNewItemName] = useState("");

  const handleAddToCollection = () => {
    const data = { name: newItemName };
    onAddItem(data);
    setNewItemName("");
  };

  return (
    <>
      <Grid container>
        <Grid item>
          <Box
            sx={{
              width: "100%",
              minWidth: 200,
              maxWidth: 400,
              bgcolor: "InfoBackground",
            }}
          >
            <Grid
              item
              container
              spacing={1}
              alignItems="center"
              style={{ flexWrap: "nowrap" }}
            >
              <Grid item style={{ flexGrow: 1 }}>
                <TextField
                  label={addLabel}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <IconButton
                  variant="contained"
                  color="primary"
                  onClick={handleAddToCollection}
                  disabled={!newItemName}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </Grid>
            </Grid>
            <List>
              {Object.entries(collection).map(([id, item]) => (
                <ListItem key={id}>
                  <ListItemButton
                    selected={selectedId === id}
                    onClick={() => setSelectedId(id)}
                  >
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
        <Grid item style={{ flexGrow: 1 }}>
          <Grid item container direction={"column"} spacing={1}>
            {children}
            <Grid item sx={{ mt: 1, mb: 2 }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => onDeleteItem(selectedId)}
              >
                {deleteLabel}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ListNavContiner;
