export interface Sensor {
  id: number;
  name: string;
  description: string;
}

export interface Device {
  machineId: string;
  pairedTo: string;
  friendlyName: string;
  type: string;
  sensors: Sensor[];
}

export interface Summary {
  avg: string;
  min: string;
  max: string;
  prediction: string;
}

export interface Record {
  id: number;
  value: number;
  date: Date;
  sensorId: number;
}

export interface Country {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  country: Country;
}

export interface Home {
  id: number;
  name: string;
  associatedTo: string;
  city: City;
}

export interface Room {
  id: number;
  name: string;
  home: Home;
}
