conn sys/pass@XEPDB1 as SYSDBA;

create tablespace prod datafile '/home/oracle/prod.dbf' size 512m autoextend on;
create tablespace prod_dw datafile '/home/oracle/prod_dw.dbf' size 512m autoextend on;

create user prod identified by "pass" default tablespace prod;
create user prod_dw identified by "pass" default tablespace prod_dw;

grant all privileges to prod;
grant all privileges to prod_dw;

alter user prod quota unlimited on prod;
alter user prod_dw quota unlimited on prod_dw;
alter user prod_dw quota unlimited on prod;