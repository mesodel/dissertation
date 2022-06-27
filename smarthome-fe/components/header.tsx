import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import User from "./user";

export default function Header() {
  return (
    <AppBar position="static" sx={{ bgcolor: "white" }}>
      <Box>
        <Toolbar disableGutters>
          <IconButton
            size="large"
            aria-label="search"
            sx={{
              width: "80%",
              justifyContent: "flex-end",
              display: { color: "grey" },
            }}
          >
            <SearchIcon />
          </IconButton>
          <Box
            sx={{
              width: "20%",
              justifyContent: "flex-end",
              display: { color: "grey" },
            }}
          >
            <User />
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
}
