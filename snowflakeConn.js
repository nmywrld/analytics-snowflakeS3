// import { } from 'snowflake-sdk'
import crypto from 'crypto' ;
import fs from 'fs';

import snowflake from 'snowflake-sdk';


const privateKeyObj = crypto.createPrivateKey({
    key: fs.readFileSync("./.aws/rsa_key.p8", 'utf8'),
    format: "pem"
})

const privateKey = privateKeyObj.export({
    format: "pem",
    type: "pkcs8"
})


export const snowflakeConnection = {
    ready: false,


    connection: snowflake.createConnection({
        // account: https://vk10312.ap-southeast-1.snowflakecomputing.com,
        // account: OISIGJU.BE51503,
        // username: user,
        // password: password,
        
        // authenticator: "OAUTH",
        // token: "<your_oauth_token>"
    
        account: 'oisigju-be51503',
        username:"nmywrld",
        authenticator:"snowflake_jwt",
        privateKey
    
    }),

    init: async function(){
        if (!this.ready){
            this.connection.connect(
                function(err, conn) {
                    if (err) {
                        console.error('Unable to connect: ' + err.message);
                        } 
                        
                    else {
                        console.log('Successfully connected to Snowflake.');
                        // Optional: store the connection ID.
                        }
                }
            )
        }

    },

}




// connect -> stage -> process file (likely json) -> upload into DB 

// why use snowflake: easy to deploy; nearly unlimited scaling; 
// better optimised to handle semi structured data (json)