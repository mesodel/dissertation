#include <Adafruit_Sensor.h>
#include <Arduino.h>
#include <DHT.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <cstring>
#include <map>
#include <vector>

static constexpr auto *ssid = "WiFi-2.4";
static constexpr auto *pass = "180898Delia!";

static const std::vector<String>      capabilities{"temperature", "humidity"};
static const std::map<String, String> origins{{"temperature", "temperature"},
                                              {"humidity", "humidity"}};
static constexpr auto                *broker       = "192.168.0.165";
static constexpr auto                *topic        = "data";
static constexpr auto                 DHT_PIN      = 5;
static constexpr auto                 DHT_TYPE     = DHT11;
static char                           clientId[64] = "esp8266-";
static constexpr auto                 port         = 1883;

static WiFiClient   wifiClient;
static PubSubClient mqttClient(wifiClient);

static DHT dht(DHT_PIN, DHT_TYPE);

static IPAddress localIP(192, 168, 0, 184);
static IPAddress gateway(192, 168, 0, 2);
static IPAddress subnet(255, 255, 255, 0);

static void connectWifi()
{
  auto status = WiFi.status();
  if (status == WL_CONNECTED)
  {
    return;
  }

  Serial.printf("Current WiFi status: %d\n", status);

  while ((status = WiFi.status()) != WL_CONNECTED)
  {
    Serial.printf("Connecting to WiFi %s. Current status: %d. Current IP: %s\n",
                  ssid, status, WiFi.localIP().toString().c_str());
    WiFi.mode(WIFI_STA);
    WiFi.config(localIP, gateway, subnet);
    WiFi.begin(ssid, pass);

    delay(5000);
  }

  Serial.println("Connected to WiFi!");
}

void setup()
{
  Serial.begin(115200);
  Serial.println("Commencing serial communication");

  connectWifi();

  mqttClient.setServer(broker, port);

  Serial.printf("Attempting to connect to MQTT broker %s:%d\n", broker, port);
  strcat(clientId, WiFi.macAddress().c_str());
  if (!mqttClient.connect(clientId))
  {
    Serial.println("Failed to connect. Will restart...");
    ESP.restart();
  }

  Serial.println("Connection to MQTT broker established successfully");

  dht.begin();
}

static float collectData(const char *capability)
{
  if (!strcmp(capability, "temperature"))
  {
    return dht.readTemperature();
  }
  else if (!strcmp(capability, "humidity"))
  {
    return dht.readHumidity();
  }
  else
  {
    return 0;
  }
}

static void publishData(const char *capability)
{
  char        payload[128];
  const float generatedValue = collectData(capability);
  if (generatedValue < 20 || generatedValue > 100 || isnan(generatedValue))
  {
    return;
  }

  Serial.printf("Publishing data about %s\n", capability);
  Serial.printf("Current reading: %f\n", generatedValue);

  sprintf(payload, "{\"origin\": \"%s\", \"type\": \"%s\", \"value\": %.2f}",
          origins.at(capability).c_str(), capability, generatedValue);

  mqttClient.publish(topic, payload);
  Serial.printf("Data published: %s\n", payload);
}

void loop()
{
  Serial.println("Looping...");
  connectWifi();
  mqttClient.loop();
  for (const auto capability : capabilities)
  {
    publishData(capability.c_str());
  }
  delay(60000);
}