import { useUser } from "@auth0/nextjs-auth0";
import * as React from "react";
import { Device, Home, Room } from "../lib/types";

export interface IGetterProps {
  setDevices: (devices: Device[]) => void;
  setHome: (home: Home) => void;
  setRooms: (rooms: Room[]) => void;
  setShowErrorAlert: (show: boolean) => void;
  home: Home | undefined;
}

export default function Getter(props: IGetterProps) {
  const { user } = useUser();
  const { home } = props;

  React.useEffect(() => {
    if (user === undefined) {
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/gw/paired`)
      .then((value) => {
        if (value.status !== 200) {
          props.setShowErrorAlert(true);
          return;
        }

        return value.json();
      })
      .then((json) => {
        props.setDevices(json);
      });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/home/`)
      .then((response) => {
        if (response.status !== 200) {
          props.setShowErrorAlert(true);
          return;
        }
        return response.json();
      })
      .then((json) => props.setHome(json));
  }, [user]);

  React.useEffect(() => {
    if (home === undefined || home === null) {
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/room/`)
      .then((response) => {
        if (response.status !== 200) {
          props.setShowErrorAlert(true);
          return;
        }
        return response.json();
      })
      .then((json) => props.setRooms(json));
  }, [home]);

  return <div></div>;
}
