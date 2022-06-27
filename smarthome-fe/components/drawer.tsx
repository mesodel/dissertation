import * as React from "react";
import MuiDrawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import Link from "next/link";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerComponent = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const topTabs: { [key: string]: any } = {
  Home: <HomeIcon />,
  Devices: <DeviceHubIcon />,
};
const topTabsLinks: { [key: string]: any } = {
  Home: "/",
  Devices: "/devices",
};
const lowerTabs: { [key: string]: any } = {
  Settings: <SettingsIcon />,
  Help: <HelpIcon />,
};
const lowerTabsLinks: { [key: string]: any } = {
  Settings: "/settings",
  Help: "/help",
};

interface IItemsListsProps {
  tabs: any;
  links: any;
  open: boolean;
  style?: any;
}

const ItemsList = (props: IItemsListsProps) => {
  return (
    <List style={props?.style}>
      {Object.keys(props.tabs).map((key) => (
        <Link key={key} href={props.links[key]}>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: props.open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: props.open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {props.tabs[key]}
              </ListItemIcon>
              <ListItemText
                primary={key}
                sx={{ opacity: props.open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        </Link>
      ))}
    </List>
  );
};

export default function Drawer() {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const openButton = (
    <IconButton onClick={handleDrawerOpen}>
      <MenuIcon />
    </IconButton>
  );
  const closeButton = (
    <IconButton onClick={handleDrawerClose}>
      <ChevronLeftIcon />
    </IconButton>
  );

  return (
    <DrawerComponent variant="permanent" open={open}>
      <DrawerHeader>{open ? closeButton : openButton}</DrawerHeader>
      <Divider />
      <ItemsList links={topTabsLinks} tabs={topTabs} open={open} />
      <ItemsList
        style={{ marginTop: `auto` }}
        links={lowerTabsLinks}
        tabs={lowerTabs}
        open={open}
      />
    </DrawerComponent>
  );
}
