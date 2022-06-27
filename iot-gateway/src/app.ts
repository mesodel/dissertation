// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as credentials from "../rsc/credentials.json";
import * as jwt from "../rsc/jwt.json";
import * as descriptor from "../rsc/descriptor.json";
import * as cloud from "../rsc/cloud.json";

import * as log from "npmlog";
import * as mqtt from "mqtt";
import fetch from "node-fetch";

interface Sensor {
  id: number;
  name: string;
  description: string;
}

interface Machine {
  machineId: string;
  pairedTo: string | null;
  friendlyName: string;
  type: string;
  sensors: Sensor[];
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

interface Payload {
  origin: string;
  type: string;
  value: number;
}

interface Record {
  value: number;
  sensor: {
    id: number;
  };
}

let bearerToken = "";
let machineDescriptor: Machine | null = null;

const timeout = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const postMessageToGw = async (payload: Payload) => {
  const sensorId = machineDescriptor?.sensors.find(
    (value) => value.name === payload.origin
  )?.id;
  if (!sensorId) {
    return;
  }

  log.info(tag, `Persisting record for sensor ID: ${sensorId}`);

  const record: Record = {
    value: payload.value,
    sensor: {
      id: sensorId,
    },
  };

  const response = await fetch(`${cloud.url}/iot/record/save`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    const text = await response.text();
    log.error(tag, `Error saving record for sensor ID: ${sensorId}`);
    log.error(tag, `Error: ${text}`);
  } else {
    log.info(
      tag,
      `Record for sensor ID: ${sensorId} has been saved successfully`
    );
  }
};

const signalUp = async () => {
  const response = await fetch(`${cloud.url}/iot/gw/signal`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify(descriptor),
  });
  const json = (await response.json()) as Machine;

  if (!json.pairedTo) {
    log.info(tag, "Device is not paired...");
    log.info(tag, `Machine ID: ${json.machineId}`);
    log.info(tag, `Pairing code: ${descriptor.pairCode}`);
    await timeout(5000);
    await signalUp();
  } else {
    log.info(tag, `Device is paired to ${json?.pairedTo}`);

    machineDescriptor = json;
  }
};

const obtainBearerToken = async () => {
  const response = await fetch(jwt.url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: `{"client_id":"${jwt.clientId}","client_secret":"${jwt.clientSecret}","audience":"${jwt.audience}","grant_type":"client_credentials"}`,
  });
  const json = (await response.json()) as AuthResponse;
  bearerToken = json["access_token"];

  log.info(tag, `Bearer token obtained: ${bearerToken}`);
};

const tag = "gw-app";
const topic = "data";
const client = mqtt.connect({
  clientId: credentials.clientId,
  host: credentials.broker,
  port: credentials.port,
});

client.on("connect", async () => {
  log.info(
    tag,
    `Connection to broker ${credentials.broker}:${credentials.port} has been established successfully`
  );

  await obtainBearerToken();
  await signalUp();

  client.subscribe(topic, (error) => {
    if (error) {
      log.error(tag, `Error subscribing to ${topic}. ${JSON.stringify(error)}`);
      return;
    }

    log.info(tag, `Subscribed to topic ${topic} successfully`);
  });
});

client.on("message", (topic: string, payload: Buffer) => {
  log.info(tag, `Message from topic ${topic} has arrived`);
  log.info(tag, `Content: ${payload.toString()}`);

  postMessageToGw(JSON.parse(payload.toString()) as Payload);
});
