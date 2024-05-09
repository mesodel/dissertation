# Cloud solution for Smart Home monitoring

<!-- TOC -->
* [Cloud solution for Smart Home monitoring](#cloud-solution-for-smart-home-monitoring)
  * [Introduction](#introduction)
  * [Features](#features)
<!-- TOC -->

## Introduction
This project aims to implement a modular and easily extendable smart home solution which is cloud native.\
It embraces decoupling of the components, offering a system defined by resilience.\
All the sensor data flows from the nodes to the gateway via MQTT. From here, the data can either be consumed via a REST API or be later consumed from the data warehouse application.\
ML features are also baked in, the ML application being able to perform inference to predict future temperature values based on historical trends.

## Features
- REST API to consume data
- Data Warehouse application which computes metrics over historical data and has scheduled CRON job that automatically imports data from the DB
- ML prediction of future values based on past trends performing inference over pre-trained model
- JWT based authentication   
- Cloud native application using a Reverse Proxy to forward incoming requests to respective micro-services
