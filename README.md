# analytics-snowflakeS3

## Background
- scope the data requirements to build our e-commerce analytics platform (link to git project)
- configure AWS IAM policies and S3 buckets to accept snowflake/databricks connections
- use AWS and snowflake/databricks SDKs to interface 

## Project requirements
Things that need to be done
1. connect and auth s3 (DONE)
2. connect and auth snowflake/databricks account
3. create S3 watcher functions to watch for incoming files
    - depending on the file that is uploaded, it needs to stream to the correct schema/table in our data lake
4. create database/schemas/tables (prereqs) if not created 
    - if prereqs return as not created, must initialise prereqs
    - else, establish connection
5. business requirements
    - based onn business and logical requriements, need to transform data streaming into S3 before uploading to data lake
    - more to come
6. create data lake upload functions
    - after data is transformed as needed, use respective functions to upload data 

