import * as React from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import { grey } from "@mui/material/colors";
import { Button, Grid } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0";

const loginText = "Login";

export default function User() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const { user, isLoading } = useUser();
  const isAuthenticated = user !== undefined;

  const notLoggedIn = (
    <Grid
      item
      xs={10}
      style={{
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <IconButton>
        <Avatar sx={{ bgcolor: grey[500] }}>?</Avatar>
      </IconButton>
      <Button
        endIcon={<KeyboardArrowDownIcon />}
        style={{ textTransform: "none" }}
        onClick={handleOpenUserMenu}
      >
        <Typography
          style={{
            color: "black",
            marginTop: "10%",
            marginBottom: "10%",
          }}
        >
          Guest
        </Typography>
      </Button>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {/* eslint-disable-next-line */}
        <a href="/api/auth/login">
          <MenuItem key={loginText}>
            <Typography textAlign="center">{loginText}</Typography>
          </MenuItem>
        </a>
      </Menu>
    </Grid>
  );

  const loggedIn = (
    <Grid
      item
      xs={10}
      style={{
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <IconButton>
        <Avatar src={user?.picture as string}>U</Avatar>
      </IconButton>
      <Button
        endIcon={<KeyboardArrowDownIcon />}
        style={{ textTransform: "none" }}
        onClick={handleOpenUserMenu}
      >
        <Typography
          style={{
            color: "black",
            marginTop: "10%",
            marginBottom: "10%",
          }}
        >
          {user?.name}
        </Typography>
      </Button>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={() => console.log("Profile")}>
          <Typography textAlign="center">Profile</Typography>
        </MenuItem>
        {/* eslint-disable-next-line */}
        <a href="/api/auth/logout">
          <MenuItem>
            <Typography textAlign="center">Logout</Typography>
          </MenuItem>
        </a>
      </Menu>
    </Grid>
  );

  const loading = (
    <Grid
      item
      xs={10}
      style={{
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <LinearProgress sx={{ width: "100%" }} />
    </Grid>
  );

  const content = isAuthenticated ? loggedIn : notLoggedIn;

  return (
    <Grid container spacing={2}>
      {isLoading ? loading : content}
    </Grid>
  );
}
