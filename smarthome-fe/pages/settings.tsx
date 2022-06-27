import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Fade,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import * as React from "react";
import { Home, Room } from "../lib/types";
import HomeForm from "../components/home_form";
import RoomsForm from "../components/rooms_form";

export interface ISettingsProps {
  home: Home;
  setHome: (home: Home) => void;
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
}

export interface CountryOption {
  id: number;
  name: string;
}

export interface CityOption {
  id: number;
  name: string;
}

export default function Settings(props: ISettingsProps) {
  const [showErrorAlert, setShowErrorAlert] = React.useState(false);
  const [selectedSetting, setSelectedSetting] = React.useState(
    <HomeForm
      setShowErrorAlert={setShowErrorAlert}
      home={props.home}
      setHome={props.setHome}
    />
  );
  const [selectedSettingIdx, setSelectedSettingIdx] = React.useState(0);

  const { home, setHome, rooms, setRooms } = props;

  React.useEffect(() => {
    if (selectedSettingIdx !== 0) {
      return;
    }

    setSelectedSetting(
      <HomeForm
        setShowErrorAlert={setShowErrorAlert}
        home={home}
        setHome={setHome}
      />
    );
  }, [home, setHome]);

  React.useEffect(() => {
    if (selectedSettingIdx !== 1) {
      return;
    }

    setSelectedSetting(<RoomsForm rooms={rooms} setRooms={setRooms} />);
  }, [rooms, setRooms]);

  React.useEffect(() => {
    const interval = setTimeout(() => {
      setShowErrorAlert(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [showErrorAlert]);

  const handleHomeAction = () => {
    setSelectedSettingIdx(0);
    setSelectedSetting(
      <HomeForm
        setShowErrorAlert={setShowErrorAlert}
        home={props.home}
        setHome={props.setHome}
      />
    );
  };

  const handleRoomsAction = () => {
    setSelectedSettingIdx(1);
    setSelectedSetting(
      <RoomsForm rooms={props.rooms} setRooms={props.setRooms} />
    );
  };

  const leftGrid = (
    <Grid item xs={4}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardActionArea
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={handleHomeAction}
            >
              <CardContent>
                <Typography variant="h5">Home</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardActionArea
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={handleRoomsAction}
            >
              <CardContent>
                <Typography variant="h5">Rooms</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );

  const rightGrid = (
    <Grid item xs={8}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {selectedSetting}
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <Box style={{ marginLeft: "72px", marginRight: "16px" }}>
      <Fade in={true}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h2">Settings</Typography>
          </Grid>
          {leftGrid}
          {rightGrid}
        </Grid>
      </Fade>
      <Stack
        sx={{
          bottom: "16px",
          position: "absolute",
        }}
        spacing={2}
      >
        <Fade in={showErrorAlert}>
          <Alert severity="error">Please select the Country first</Alert>
        </Fade>
      </Stack>
    </Box>
  );
}
