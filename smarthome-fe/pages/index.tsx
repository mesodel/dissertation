import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  Grid,
  IconButton,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import * as React from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { Room, Device, Sensor, Record } from "../lib/types";
import Link from "next/link";

export interface IHomeProps {
  rooms: Room[];
  devices: Device[];
}

interface FavoriteDevice {
  id: number;
  name: string;
  action: () => void;
  icon: any;
}

interface SavedDevice {
  id: number;
  name: string;
}

export default function Home(props: IHomeProps) {
  const { user, isLoading } = useUser();
  const isAuthenticated = user !== undefined;
  const [animate, setAnimate] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [clickedOption, setClickedOption] = React.useState<number | null>();
  const [sensors, setSensors] = React.useState<Sensor[]>([]);

  const { rooms, devices } = props;
  React.useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(!animate);
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading, animate]);

  const loadingComponent = (
    <Grid item xs={12}>
      <Fade in={animate}>
        <Typography variant="h2">Hello ...</Typography>
      </Fade>
    </Grid>
  );

  const authenticatedComponent = (
    <Grid item xs={12}>
      <Fade in={true}>
        <Typography variant="h2" style={{ fontWeight: "bold" }}>
          Hello {user?.name}!
        </Typography>
      </Fade>
    </Grid>
  );

  const guestComponent = (
    <Grid item xs={12}>
      <Fade in={true}>
        <Typography variant="h2" style={{ fontWeight: "bold" }}>
          Hello Guest!
        </Typography>
      </Fade>
    </Grid>
  );

  const loadedComponent = isAuthenticated
    ? authenticatedComponent
    : guestComponent;

  const handleDialogOpen = (idx: number) => {
    setClickedOption(idx);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setClickedOption(null);
    setDialogOpen(false);
  };

  const [favoriteDevices, setFavoriteDevices] = React.useState<
    FavoriteDevice[]
  >([]);
  const [favoriteDeviceValue, setFavoriteDeviceValue] = React.useState<{
    [key: number]: number;
  }>({});

  const handleAddDeviceToFavorites = (device: Sensor) => {
    if (clickedOption === null || clickedOption === undefined) {
      return;
    }

    const myDevices = favoriteDevices;
    const description = device.description ? device.description : device.name;
    const icon = description.includes("temp")
      ? "temperature1.png"
      : "humidity.webp";
    const mappedFavorite: FavoriteDevice = {
      id: device.id,
      name: device.name,
      action: () => removeFavoriteDevice(clickedOption),
      icon: (
        <CardMedia component="img" height="80vh" width="80vw" image={icon} />
      ),
    };

    myDevices[clickedOption] = mappedFavorite;
    handleDialogClose();
    setFavoriteDevices(myDevices);
    retrieveRecords();
    localStorage.setItem(
      "favorite-devices",
      JSON.stringify(
        myDevices.map((value) => {
          return { id: value.id, name: value.name };
        })
      )
    );
    const mySensors = sensors;
    const idx = sensors.indexOf(device);
    mySensors.splice(idx, 1);
    setSensors(mySensors);
  };

  const removeFavoriteDevice = (index: number) => {
    const storage = localStorage.getItem("favorite-devices");
    if (!storage) {
      return;
    }

    const parsed = JSON.parse(storage) as SavedDevice[];
    parsed[index] = {
      id: 0,
      name: "Add",
    };

    localStorage.setItem("favorite-devices", JSON.stringify(parsed));
    restoreFavoriteDevices(parsed);
  };

  const setDefaultFavorites = () => {
    const defaultFavorites = [
      {
        id: 0,
        name: "Add",
        action: () => {
          handleDialogOpen(0);
        },
        icon: <AddIcon />,
      },
      {
        id: 0,
        name: "Add",
        action: () => {
          handleDialogOpen(1);
        },
        icon: <AddIcon />,
      },
      {
        id: 0,
        name: "Add",
        action: () => {
          handleDialogOpen(2);
        },
        icon: <AddIcon />,
      },
      {
        id: 0,
        name: "Add",
        action: () => {
          handleDialogOpen(3);
        },
        icon: <AddIcon />,
      },
      {
        id: 0,
        name: "Add",
        action: () => {
          handleDialogOpen(4);
        },
        icon: <AddIcon />,
      },
      {
        id: 0,
        name: "Add",
        action: () => {
          handleDialogOpen(5);
        },
        icon: <AddIcon />,
      },
    ];
    setFavoriteDevices(defaultFavorites);
  };

  const restoreFavoriteDevices = (devices: SavedDevice[]) => {
    const mappedDevices = devices.map(
      (value: SavedDevice, index: number): FavoriteDevice => {
        let icon;
        if (value.name.includes("temp")) {
          icon = (
            <CardMedia
              component="img"
              height="80vh"
              width="80vw"
              image="temperature1.png"
            />
          );
        } else if (value.name.includes("humidity")) {
          icon = (
            <CardMedia
              component="img"
              height="80vh"
              width="80vw"
              image="humidity.webp"
            />
          );
        } else {
          icon = <AddIcon />;
        }

        const action = value.name.includes("Add")
          ? () => handleDialogOpen(index)
          : () => removeFavoriteDevice(index);

        return {
          id: value.id,
          name: value.name,
          action: action,
          icon: icon,
        };
      }
    );

    setFavoriteDevices(mappedDevices);
  };

  const retrieveRecords = async () => {
    let sensorIds = "";
    for (const device of favoriteDevices) {
      if (!device.id) {
        continue;
      }

      sensorIds += `${device.id},`;
    }
    if (sensorIds.length === 0) {
      return;
    } else {
      sensorIds = sensorIds.slice(0, -1);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/record/latest?sensorIds=${sensorIds}`
    );
    if (!response.ok) {
      return;
    }

    const json = (await response.json()) as Record[];

    let values: { [key: number]: number } = {};
    for (const record of json) {
      values[record.sensorId] = record.value;
    }

    setFavoriteDeviceValue(values);
  };

  const rebuildAvailableList = () => {
    let mySensors: Sensor[] = [];

    devices?.map((value: Device) => {
      value.sensors?.forEach((sensor: Sensor) => {
        const arrayItem = favoriteDevices.find(
          (favorite: SavedDevice) => favorite.name === sensor.name
        );
        if (arrayItem !== undefined) {
          return;
        }

        mySensors.push(sensor);
      });
    });

    setSensors(mySensors);
  };

  React.useEffect(() => {
    if (favoriteDevices.length !== 0) {
      retrieveRecords();
      rebuildAvailableList();

      return;
    }

    const devices = localStorage.getItem("favorite-devices");
    if (devices) {
      restoreFavoriteDevices(JSON.parse(devices) as SavedDevice[]);
    } else {
      setDefaultFavorites();
    }
  }, [favoriteDevices]);

  React.useEffect(() => {
    rebuildAvailableList();
  }, [devices, favoriteDevices]);

  const mappedDevices = favoriteDevices.map((value, index) => {
    return (
      <Grid key={index} item xs={2}>
        <Card
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <CardContent
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <IconButton onClick={value.action}>{value.icon}</IconButton>
            <Typography variant="h6">{value.name}</Typography>
            {value.name !== "Add" ? (
              <Typography variant="h6">
                :{favoriteDeviceValue[value.id]}
              </Typography>
            ) : (
              ""
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  });

  const mappedRooms = rooms?.map((value) => {
    const icon = (() => {
      switch (value.name) {
        case "Bathroom":
          return "bathroom.svg";
        case "Bedroom":
          return "bedroom.webp";
        case "Kitchen":
          return "kitchen.jpg";
        case "Living Room":
          return "living-room.webp";
        case "Office":
          return "office.png";
        default:
          return "room.png";
      }
    })();

    return (
      <Grid key={value.id} item xs={2}>
        <Card
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CardActionArea>
            <CardMedia
              component="img"
              height="50%"
              width="50%"
              image={icon}
              alt={value.name}
            />
            <CardContent>
              <Typography variant="h5" component="div">
                {value.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {value.home.name}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    );
  });

  const dialogContentNoDevice = (
    <Box>
      <DialogContent>
        <DialogContentText style={{ color: "gray" }}>
          Please pair a device before adding to favorites
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Link href="/devices">
          <Button>Pair</Button>
        </Link>
        <Button onClick={handleDialogClose}>OK</Button>
      </DialogActions>
    </Box>
  );

  const dialogContentDevices = (
    <Box>
      <DialogContent>
        <DialogContentText>
          You have {sensors?.length} paired{" "}
          {sensors?.length === 1 ? "device" : "devices"}:
        </DialogContentText>
        <List>
          {sensors?.map((value) => (
            <ListItemButton
              key={value.id}
              onClick={() => {
                handleAddDeviceToFavorites(value);
              }}
            >
              <DialogContentText>{value.name}</DialogContentText>
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button style={{ color: "red" }} onClick={handleDialogClose}>
          Cancel
        </Button>
      </DialogActions>
    </Box>
  );

  const dialogContent = (
    <Box>
      <DialogTitle>Add device to favorites</DialogTitle>
      {sensors?.length ? dialogContentDevices : dialogContentNoDevice}
    </Box>
  );

  return (
    <Box style={{ marginLeft: "72px", marginRight: "8px" }}>
      <Fade in={true}>
        <Grid container spacing={2}>
          {isLoading ? loadingComponent : loadedComponent}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "text.secondary" }}
            >
              FAVORITE DEVICES
            </Typography>
          </Grid>
          {mappedDevices}
          <div style={{ height: "100%" }}></div>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "text.secondary" }}
            >
              ROOMS
            </Typography>
          </Grid>
          {mappedRooms}
        </Grid>
      </Fade>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        {dialogContent}
      </Dialog>
    </Box>
  );
}
