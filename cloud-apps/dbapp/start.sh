#!/bin/sh

echo 'starting dbapp'
$JAVA_HOME/bin/keytool -importcert -trustcacerts -cacerts -storepass changeit -noprompt -file /usr/app/ca.crt -alias ownCA

/usr/app/wait.sh configserver:8800 --timeout=0 --strict -- \
  java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 -jar /usr/app/dbapp-0.0.1-SNAPSHOT.jar