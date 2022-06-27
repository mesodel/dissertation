#!/bin/sh

echo 'starting dwapp'
$JAVA_HOME/bin/keytool -importcert -trustcacerts -cacerts -storepass changeit -noprompt -file /usr/app/ca.crt -alias ownCA

/usr/app/wait.sh configserver:8800 --timeout=0 --strict -- \
  java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5006 -jar /usr/app/dwapp-0.0.1-SNAPSHOT.jar