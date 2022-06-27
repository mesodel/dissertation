import {
  Alert,
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
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import * as React from "react";
import { Room } from "../lib/types";

export interface IRoomsFormProps {
  rooms?: Room[];
  setRooms: (rooms: Room[]) => void;
}

interface IEditRoomProps {
  room: Room;
  setRooms: (rooms: Room[]) => void;
  setShowSuccessAlert: (show: boolean) => void;
  setShowErrorAlert: (show: boolean) => void;
  setRoomForEditing: (room: Room) => void;
}

const EditRoom = (props: IEditRoomProps) => {
  const {
    room,
    setRooms,
    setShowSuccessAlert,
    setShowErrorAlert,
    setRoomForEditing,
  } = props;

  const handleEdit = () => {
    setRoomForEditing(room);
  };
  const handleDelete = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/room/${room.id}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      const rooms = await response.json();
      setRooms(rooms);
      setShowSuccessAlert(true);
    } else {
      setShowErrorAlert(true);
    }
  };

  return (
    <CardActions>
      <Button size="small" onClick={handleEdit}>
        Edit
      </Button>
      <Button size="small" onClick={handleDelete} style={{ color: "red" }}>
        Delete
      </Button>
    </CardActions>
  );
};

export default function RoomsForm(props: IRoomsFormProps) {
  const { rooms, setRooms } = props;
  const [roomName, setRoomName] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [addWait, setAddWait] = React.useState(false);
  const [editWait, setEditWait] = React.useState(false);
  const [roomForEdit, setRoomForEdit] = React.useState<Room | null>();
  const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
  const [showErrorAlert, setShowErrorAlert] = React.useState(false);

  React.useEffect(() => {
    const interval = setTimeout(() => {
      setShowSuccessAlert(false);
      setShowErrorAlert(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [showSuccessAlert, showErrorAlert]);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setRoomName("");
  };

  const handleEditDialogOpen = () => {
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setRoomName("");
    setRoomForEdit(null);
  };

  const setRoomForEditing = (room: Room) => {
    setRoomForEdit(room);
    handleEditDialogOpen();
  };

  const mappedRooms = rooms?.map((value) => (
    <Grid key={value.id} item xs={12}>
      <Card
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CardContent>
          <Typography variant="h5">{value.name}</Typography>
        </CardContent>
        {value.name !== "Default" ? (
          <EditRoom
            room={value}
            setRooms={setRooms}
            setShowSuccessAlert={setShowSuccessAlert}
            setShowErrorAlert={setShowErrorAlert}
            setRoomForEditing={setRoomForEditing}
          />
        ) : (
          ""
        )}
      </Card>
    </Grid>
  ));

  const addRoom = (
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
  );

  const handleRoomAdd = async () => {
    setAddWait(true);

    const payload = {
      name: roomName,
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/room/save`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const rooms = await response.json();
      setRooms(rooms);
      setShowSuccessAlert(true);
    } else {
      setShowErrorAlert(true);
    }

    setAddWait(false);
    handleDialogClose();
  };

  const handleRoomEdit = async () => {
    setEditWait(true);

    const payload = {
      name: roomName,
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/room/${roomForEdit?.id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const rooms = await response.json();
      setRooms(rooms);
      setShowSuccessAlert(true);
    } else {
      setShowErrorAlert(true);
    }

    setEditWait(false);
    handleEditDialogClose();
  };

  const dialogContentAdd = (
    <Box>
      <DialogTitle>Add a new room</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="roomName"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          value={roomName}
          // @ts-expect-error
          onChange={(ev: object) => setRoomName(ev.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} style={{ color: "red" }}>
          Close
        </Button>
        <Button onClick={handleRoomAdd}>Add</Button>
      </DialogActions>
    </Box>
  );

  const dialogContentEdit = (
    <Box>
      <DialogTitle>
        Edit {roomForEdit ? `${roomForEdit?.name} (${roomForEdit?.id})` : ""}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="roomName"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          value={roomName}
          // @ts-expect-error
          onChange={(ev: object) => setRoomName(ev.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEditDialogClose} style={{ color: "red" }}>
          Cancel
        </Button>
        <Button onClick={handleRoomEdit}>Edit</Button>
      </DialogActions>
    </Box>
  );

  const dialogWait = (
    <Box>
      <DialogTitle>Please wait...</DialogTitle>
      <DialogContent>
        <LinearProgress />
      </DialogContent>
    </Box>
  );

  return (
    <Fade in={true}>
      <Box>
        <Grid container spacing={2}>
          {mappedRooms}
          {addRoom}
        </Grid>
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          {!addWait ? dialogContentAdd : dialogWait}
        </Dialog>
        <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
          {!editWait ? dialogContentEdit : dialogWait}
        </Dialog>
        <Stack
          sx={{
            bottom: "16px",
            position: "absolute",
          }}
          spacing={2}
        >
          <Fade in={showSuccessAlert}>
            <Alert severity="success">
              Room request processed successfully!
            </Alert>
          </Fade>
          <Fade in={showErrorAlert}>
            <Alert severity="error">
              Error processing the Room request. Please retry!
            </Alert>
          </Fade>
        </Stack>
      </Box>
    </Fade>
  );
}
