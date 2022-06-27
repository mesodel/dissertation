import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import EditIcon from "@mui/icons-material/Edit";
import * as React from "react";
import { Device, Record, Room, Sensor, Summary } from "../lib/types";
import "chart.js/auto";
import { Line } from "react-chartjs-2";

interface EditPayload {
  description: string;
  roomId: number;
}

export interface IDeviceProps {
  devices: Device[];
  rooms: Room[];
  setDevices: (devices: Device[]) => void;
}

export default function Devices(props: IDeviceProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [graphDialogOpen, setGraphDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedSensor, setSelectedSensor] = React.useState<Sensor | null>(
    null
  );
  const [sensorDescription, setSensorDescription] = React.useState("");
  const [pairWait, setPairWait] = React.useState(false);
  const [selectedGw, setSelectedGw] = React.useState<Device>();
  const [editSensor, setEditSensor] = React.useState<Sensor | null>();
  const [dialogMachineId, setDialogMachineId] = React.useState("");
  const [dialogPairCode, setDialogPairCode] = React.useState("");
  const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
  const [showErrorAlert, setShowErrorAlert] = React.useState(false);
  const [records, setRecords] = React.useState<{ [key: number]: Record[] }>({});
  const [sensorRoom, setSensorRoom] = React.useState<Room | null>();
  const [summaries, setSummaries] = React.useState<{
    [key: number]: Summary | null;
  }>({});
  const { devices, setDevices, rooms } = props;

  React.useEffect(() => {
    if (!devices || devices.length === 0) {
      return;
    }

    setSelectedGw(devices[0]);
  }, [devices]);

  React.useEffect(() => {
    const interval = setTimeout(() => {
      setShowErrorAlert(false);
      setShowSuccessAlert(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [showSuccessAlert, showErrorAlert]);

  const retrieveRecords = async () => {
    if (selectedGw === undefined || selectedGw === null) {
      return;
    }

    let responses = {};
    let currSummaries = {};

    for (const sensor of selectedGw?.sensors) {
      const sensorId = sensor.id;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/record/${sensorId}`
      );
      if (!response.ok) {
        return;
      }
      const records = await response.json();
      responses = {
        ...responses,
        [sensorId]: records,
      };

      const responseAvg = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/record/${sensorId}/avg`
      );
      if (!responseAvg.ok) {
        return;
      }
      const avg = await responseAvg.text();

      const responseMin = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/record/${sensorId}/min`
      );
      if (!responseMin.ok) {
        return;
      }
      const min = await responseMin.text();

      const responseMax = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/record/${sensorId}/max`
      );
      if (!responseMax.ok) {
        return;
      }
      const max = await responseMax.text();

      const responsePredict = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/record/${sensorId}/predict`
      );
      if (!responsePredict.ok) {
        return;
      }
      const predicted = await responsePredict.json();

      const summary: Summary = {
        avg: parseFloat(avg).toFixed(2),
        min: parseFloat(min).toFixed(2),
        max: parseFloat(max).toFixed(2),
        prediction: parseFloat(predicted[0]).toFixed(2),
      };

      currSummaries = {
        ...currSummaries,
        [sensorId]: summary,
      };
    }

    setRecords(responses);
    setSummaries(currSummaries);
  };

  React.useEffect(() => {
    retrieveRecords();
  }, [selectedGw]);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogPair = async () => {
    setPairWait(true);

    const payload = {
      machineId: dialogMachineId,
      pairCode: dialogPairCode,
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gw/pair`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const devices = await response.json();
      setDevices(devices);
      setShowSuccessAlert(true);
    } else {
      setShowErrorAlert(true);
    }

    setDialogOpen(false);
    setPairWait(false);
  };

  const handleShowMore = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setGraphDialogOpen(true);
  };

  const handleGraphDialogClose = () => {
    setGraphDialogOpen(false);
    setSelectedSensor(null);
  };

  const handleEditDialogOpen = (sensor: Sensor) => {
    setEditSensor(sensor);
    setSensorDescription(sensor.description);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditSensor(null);
    setSensorDescription("");
    setSensorRoom(null);
    setEditDialogOpen(false);
  };

  const dialogContent = (
    <Box>
      <DialogTitle>Pair a new device</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="machineId"
          label="Machine ID"
          type="text"
          fullWidth
          variant="standard"
          value={dialogMachineId}
          // @ts-expect-error
          onChange={(ev: object) => setDialogMachineId(ev.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          id="pairCode"
          label="Pair code: "
          type="text"
          fullWidth
          variant="standard"
          value={dialogPairCode}
          // @ts-expect-error
          onChange={(ev: object) => setDialogPairCode(ev.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} style={{ color: "red" }}>
          Close
        </Button>
        <Button onClick={handleDialogPair}>Pair</Button>
      </DialogActions>
    </Box>
  );

  const dialogWait = (
    <Box>
      <DialogTitle>Pair a new device</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="machineId"
          label="Machine ID"
          type="text"
          fullWidth
          variant="standard"
          value={dialogMachineId}
          // @ts-expect-error
          onChange={(ev: object) => setDialogMachineId(ev.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          id="pairCode"
          label="Pair code: "
          type="text"
          fullWidth
          variant="standard"
          value={dialogPairCode}
          // @ts-expect-error
          onChange={(ev: object) => setDialogPairCode(ev.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} style={{ color: "red" }}>
          Close
        </Button>
        <Button onClick={handleDialogPair}>Pair</Button>
      </DialogActions>
    </Box>
  );

  const formatDate = (value: Date) => {
    const date = new Date(value);
    const hours =
      date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

    return `${hours}:${minutes}.${date.getSeconds()}`;
  };

  const graphLabels = selectedSensor
    ? records[selectedSensor?.id]
        .map((value: Record) => formatDate(value.date))
        .reverse()
    : [];

  const graphData = selectedSensor
    ? records[selectedSensor?.id].map((value: Record) => value.value).reverse()
    : [];

  const graphDialogContent = (
    <Box>
      <DialogTitle>Historic data for {selectedSensor?.name}</DialogTitle>
      <DialogContent>
        <Line
          data={{
            labels: graphLabels,
            datasets: [
              {
                label: selectedSensor?.name,
                data: graphData,
              },
            ],
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleGraphDialogClose}>Close</Button>
      </DialogActions>
    </Box>
  );

  const handleSensorEdit = async () => {
    if (!sensorRoom) {
      setShowErrorAlert(true);
      handleEditDialogClose();

      return;
    }
    setShowErrorAlert(false);

    const payload: EditPayload = {
      roomId: sensorRoom?.id,
      description: sensorDescription,
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/sensor/${editSensor?.id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      setShowErrorAlert(true);

      return;
    }

    const json = await response.json();
    const currGw = selectedGw;
    if (!currGw) {
      return;
    }

    const idx = currGw?.sensors.findIndex(
      (value) => value.id === editSensor?.id
    );
    currGw.sensors[idx] = json;
    setSelectedGw(currGw);

    setShowSuccessAlert(true);
    handleEditDialogClose();
  };

  const editDialogContent = (
    <Box>
      <DialogTitle>Edit Sensor {editSensor?.name}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="sensorDescription"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          value={sensorDescription}
          // @ts-expect-error
          onChange={(ev: object) => setSensorDescription(ev.target.value)}
        />
        <Autocomplete
          id="sensorRoom"
          sx={{ width: 300, marginTop: "16px" }}
          value={sensorRoom}
          onChange={(event: any, newValue: any) => {
            setSensorRoom(newValue);
          }}
          options={rooms}
          getOptionLabel={(option: Room) => option.name}
          isOptionEqualToValue={(option: Room, value: Room) =>
            option.name === value.name
          }
          renderInput={(params) => <TextField {...params} label="Room" />}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEditDialogClose} style={{ color: "red" }}>
          Close
        </Button>
        <Button onClick={handleSensorEdit}>Save</Button>
      </DialogActions>
    </Box>
  );

  const mappedDevices =
    devices === undefined || devices.length === 0 || !(devices instanceof Array)
      ? null
      : devices.map((item) => {
          return (
            <Grid key={item.machineId} item xs={12}>
              <Card
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CardContent>
                  <IconButton>
                    <DeviceHubIcon />
                  </IconButton>
                  <Typography variant="h6">{item.friendlyName}</Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        });

  const updateTbHandler = (ev: object) => {
    // @ts-expect-error
    setSelectedGw({
      ...selectedGw,
      // @ts-expect-error
      friendlyName: ev.target.value,
    });
  };
  const updateGwHandler = async () => {
    const payload = {
      machineId: selectedGw?.machineId,
      friendlyName: selectedGw?.friendlyName,
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gw/edit`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const devices = await response.json();
      setDevices(devices);
    }
  };

  const mappedGateway = (
    <Card
      style={{
        display: "flex",
      }}
    >
      <CardContent>
        <TextField
          margin="dense"
          id="friendName"
          label="Name: "
          type="text"
          fullWidth
          value={selectedGw?.friendlyName}
          onChange={updateTbHandler}
        />
      </CardContent>
      <CardActions>
        <Button onClick={updateGwHandler} size="small">
          Save
        </Button>
      </CardActions>
    </Card>
  );

  const mappedSensors = selectedGw?.sensors.map((value) => (
    <Grid key={value.id} item xs={12}>
      <Card
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CardContent style={{ width: "35%" }}>
          <Typography sx={{ display: "inline" }} variant="h5">
            {value.name}
          </Typography>
          <IconButton onClick={() => handleEditDialogOpen(value)}>
            <EditIcon />
          </IconButton>
          {/* @ts-expect-error */}
          {value.description !== null || value.description?.length > 0 ? (
            <Typography variant="h6">
              Description: {value.description}
            </Typography>
          ) : (
            ""
          )}
          <Fade in={true}>
            <Box>
              <Typography>
                Last reading:{" "}
                {records[value.id] && records[value.id].length > 0
                  ? records[value.id][0].value.toFixed(2)
                  : ""}
              </Typography>
              <Typography>Average: {summaries[value.id]?.avg}</Typography>
              <Typography>Minimum: {summaries[value.id]?.min}</Typography>
              <Typography>Maximum: {summaries[value.id]?.max}</Typography>
              <Typography>
                Prediction: {summaries[value.id]?.prediction}
              </Typography>
              <Button onClick={() => handleShowMore(value)}>Show more</Button>
            </Box>
          </Fade>
        </CardContent>
      </Card>
    </Grid>
  ));

  const leftGrid = (
    <Grid item xs={5}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2">Devices</Typography>
        </Grid>
        <Grid item xs={12}>
          {mappedDevices}
        </Grid>
        <Grid item xs={12}>
          <Card
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CardContent>
              <IconButton onClick={handleDialogOpen}>
                <AddIcon />
              </IconButton>
              <Typography variant="h5">Add</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );

  const rightGrid = (
    <Grid item xs={7}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2">
            Gateway {selectedGw?.friendlyName.substring(0, 10)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {mappedGateway}
        </Grid>
        {mappedSensors}
      </Grid>
    </Grid>
  );

  return (
    <Box style={{ marginLeft: "72px", marginRight: "16px" }}>
      <Fade in={true}>
        <Grid container spacing={2}>
          {leftGrid}
          {mappedDevices ? rightGrid : null}
        </Grid>
      </Fade>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        {!pairWait ? dialogContent : dialogWait}
      </Dialog>
      <Dialog open={graphDialogOpen} onClose={handleGraphDialogClose}>
        {graphDialogContent}
      </Dialog>
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        {editDialogContent}
      </Dialog>
      <Stack
        sx={{
          bottom: "16px",
          position: "absolute",
        }}
        spacing={2}
      >
        <Fade in={showSuccessAlert}>
          <Alert style={{ marginBottom: "auto" }} severity="success">
            Action successful!
          </Alert>
        </Fade>
        <Fade in={showErrorAlert}>
          <Alert severity="error">
            An error occurred. Please check all the fields and retry!
          </Alert>
        </Fade>
      </Stack>
    </Box>
  );
}
