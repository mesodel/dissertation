"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const credentials = __importStar(require("../rsc/credentials.json"));
const jwt = __importStar(require("../rsc/jwt.json"));
const descriptor = __importStar(require("../rsc/descriptor.json"));
const cloud = __importStar(require("../rsc/cloud.json"));
const log = __importStar(require("npmlog"));
const mqtt = __importStar(require("mqtt"));
const node_fetch_1 = __importDefault(require("node-fetch"));
let bearerToken = "";
let machineDescriptor = null;
const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
const postMessageToGw = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const sensorId = (_a = machineDescriptor === null || machineDescriptor === void 0 ? void 0 : machineDescriptor.sensors.find((value) => value.name === payload.type)) === null || _a === void 0 ? void 0 : _a.id;
    if (!sensorId) {
        return;
    }
    log.info(tag, `Persisting record for sensor ID: ${sensorId}`);
    const record = {
        value: payload.value,
        sensor: {
            id: sensorId,
        },
    };
    const response = yield (0, node_fetch_1.default)(`${cloud.url}/iot/record/save`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(record),
    });
    if (!response.ok) {
        const text = yield response.text();
        log.error(tag, `Error saving record for sensor ID: ${sensorId}`);
        log.error(tag, `Error: ${text}`);
    }
    else {
        log.info(tag, `Record for sensor ID: ${sensorId} has been saved successfully`);
    }
});
const signalUp = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, node_fetch_1.default)(`${cloud.url}/iot/gw/signal`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(descriptor),
    });
    const json = (yield response.json());
    if (!json.pairedTo) {
        log.info(tag, "Device is not paired...");
        log.info(tag, `Machine ID: ${json.machineId}`);
        log.info(tag, `Pairing code: ${descriptor.pairCode}`);
        yield timeout(5000);
        yield signalUp();
    }
    else {
        log.info(tag, `Device is paired to ${json === null || json === void 0 ? void 0 : json.pairedTo}`);
        machineDescriptor = json;
    }
});
const obtainBearerToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, node_fetch_1.default)(jwt.url, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: `{"client_id":"${jwt.clientId}","client_secret":"${jwt.clientSecret}","audience":"${jwt.audience}","grant_type":"client_credentials"}`,
    });
    const json = (yield response.json());
    bearerToken = json["access_token"];
    log.info(tag, `Bearer token obtained: ${bearerToken}`);
});
const tag = "gw-app";
const topic = "data";
const client = mqtt.connect({
    clientId: credentials.clientId,
    host: credentials.broker,
    port: credentials.port,
});
client.on("connect", () => __awaiter(void 0, void 0, void 0, function* () {
    log.info(tag, `Connection to broker ${credentials.broker}:${credentials.port} has been established successfully`);
    yield obtainBearerToken();
    yield signalUp();
    client.subscribe(topic, (error) => {
        if (error) {
            log.error(tag, `Error subscribing to ${topic}. ${JSON.stringify(error)}`);
            return;
        }
        log.info(tag, `Subscribed to topic ${topic} successfully`);
    });
}));
client.on("message", (topic, payload) => {
    log.info(tag, `Message from topic ${topic} has arrived`);
    log.info(tag, `Content: ${payload.toString()}`);
    postMessageToGw(JSON.parse(payload.toString()));
});
