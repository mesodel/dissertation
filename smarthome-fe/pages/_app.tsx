import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/header";
import Drawer from "../components/drawer";
import Head from "next/head";
import * as React from "react";
import { UserProvider } from "@auth0/nextjs-auth0";
import Getter from "../components/getter";
import { Device, Home, Room } from "../lib/types";
import { Stack, Fade, Alert } from "@mui/material";

function MyApp({ Component, pageProps }: AppProps) {
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [home, setHome] = React.useState<Home>();
  const [rooms, setRooms] = React.useState<Room[]>();
  const [showErrorAlert, setShowErrorAlert] = React.useState(false);

  React.useEffect(() => {
    const interval = setTimeout(() => {
      setShowErrorAlert(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [showErrorAlert]);

  return (
    <UserProvider>
      <Head>
        <title>Home Dashboard</title>
      </Head>
      <Header />
      <Drawer />
      <Component
        {...pageProps}
        home={home}
        setHome={setHome}
        devices={devices}
        setDevices={setDevices}
        rooms={rooms}
        setRooms={setRooms}
      />
      <Getter
        home={home}
        setDevices={setDevices}
        setHome={setHome}
        setRooms={setRooms}
        setShowErrorAlert={setShowErrorAlert}
      />
      <Stack
        sx={{
          bottom: "16px",
          marginLeft: "72px",
          position: "absolute",
        }}
        spacing={2}
      >
        <Fade in={showErrorAlert}>
          <Alert severity="error">
            Error retrieving home or rooms. Please add one before using the App!
          </Alert>
        </Fade>
      </Stack>
    </UserProvider>
  );
}

export default MyApp;
