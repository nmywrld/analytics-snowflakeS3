# S3-snowflake ETL pipeline 

## Background
- scope the data requirements to build our e-commerce analytics platform (link to git project)
- configure AWS IAM policies and S3 buckets to accept snowflake/databricks connections
    - create IAM permissions
    - configure snowflake side to connect 
- use AWS and snowflake/databricks SDKs to interface 

## Project requirements
Things that need to be done:
1. connect and auth s3 (**DONE**)
2. connect and auth snowflake/databricks account
3. create S3 functions to upload/watch for incoming files (**in progress**)
    - depending on the file that is uploaded, it needs to stream to the correct schema/table in our snowflake
    - likely will handle json files
    - set up event listeners to file uploads into a certain directory
4. create database/schemas/tables (prereqs) if not created 
    - if prereqs return as not created, must initialise prereqs
    - else, establish connection
5. business requirements
    - based on business and logical requriements, need to transform data streaming into S3 before uploading to snowflake
    - more to come...
6. create snowflake upload functions
    - after data is transformed as needed, use respective functions to stream data into snowflake

