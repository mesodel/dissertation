@ECHO OFF
call mvn -f config-server\pom.xml package -DskipTests
call mvn -f registry\pom.xml package -DskipTests
call mvn -f gateway\pom.xml package -DskipTests
call mvn -f dbapp\pom.xml package -DskipTests
call mvn -f mlapp\pom.xml package -DskipTests
call mvn -f dwapp\pom.xml package -DskipTests
call docker build -t configserver .\config-server
call docker build -t registry .\registry
call docker build -t gateway .\gateway
call docker build -t dbapp .\dbapp
call docker build -t mlapp .\mlapp
call docker build -t nnapp .\nnapp
call docker build -t dwapp .\dwapp
call docker-compose up -d