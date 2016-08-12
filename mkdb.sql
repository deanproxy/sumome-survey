drop database if exists survey_dev;
drop database if exists survey_test;
drop database if exists survey_prod;
create database survey_dev;
create database survey_test;
create database survey_prod;

grant all on survey_dev.* to 'survey'@'localhost' identified by 'badpassword';
grant all on survey_test.* to 'survey'@'localhost';
grant all on survey_prod.* to 'survey'@'localhost';

