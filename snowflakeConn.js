// import { } from 'snowflake-sdk'
import snowflake from 'snowflake-sdk';

var connection = snowflake.createConnection({
    // account: account,
    // username: user,
    // password: password,
    // application: application,
    
    authenticator: "OAUTH",
    token: "<your_oauth_token>"
  });

connection.connect( 
    function(err, conn) {
        if (err) {
            console.error('Unable to connect: ' + err.message);
            } 
        else {
            console.log('Successfully connected to Snowflake.');
            // Optional: store the connection ID.
            connection_ID = conn.getId();
            }
    }
);
