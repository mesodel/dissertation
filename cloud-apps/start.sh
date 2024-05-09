#!/bin/bash
mvn -f config-server/pom.xml package -DskipTests
mvn -f registry/pom.xml package -DskipTests
mvn -f gateway/pom.xml package -DskipTests
mvn -f dbapp/pom.xml package -DskipTests
mvn -f mlapp/pom.xml package -DskipTests
mvn -f dwapp/pom.xml package -DskipTests
docker build -t configserver ./config-server
docker build -t registry ./registry
docker build -t gateway ./gateway
docker build -t dbapp ./dbapp
docker build -t mlapp ./mlapp
docker build -t nnapp ./nnapp
docker build -t dwapp ./dwapp
docker compose up -d
