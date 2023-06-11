import { fileURLToPath } from "url";
import { readdirSync, readFileSync, writeFileSync } from "fs";

// Local helper utils.
import { dirnameFromMetaUrl } from "libs/utils/util-fs.js";
import { promptForText, promptToContinue } from "libs/utils/util-io.js";
import { wrapText } from "libs/utils/util-string.js";

import { 
    S3Client,
    CreateBucketCommand,
    PutObjectCommand,
    ListObjectsCommand,
    CopyObjectCommand,
    GetObjectCommand,
    DeleteObjectsCommand,
    DeleteBucketCommand, 
} from "@aws-sdk/client-s3";

import { fromIni } from "@aws-sdk/credential-providers"; 
import { AsyncResource } from "async_hooks";
import { ApplySecurityGroupsToClientVpnTargetNetworkCommand } from "@aws-sdk/client-ec2";

const REGION = `ap-southeast-1`;

const s3Client = new S3Client({ 
    region: REGION,
    credentials: fromIni({profile: 'personal'})
});

// export const histDB = {
//     tableName: "queryHist",
//     db: null,
//     ready: null,
  
//     create: async function (
//       currQuery,
//       currDesc,
//     ) {
//       // await this.ready;
  
//       const query = `INSERT into ${this.tableName} 
//       (queryUsed, desc)
//       VALUES (?, ?)
//       RETURNING id;
//       `;
//       // console.log(currQuery);
//       // console.log(currDesc);
  
//       const rawResults = await this.__query(query, [
//         currQuery,
//         currDesc,
//       ]);
  
//       // console.log(this.db)
  
//       return rawResults;
  
//     },}

export const s3 = {
    createBucket: async function() {
        const bucketName = await promptForText(
            "Enter a bucket name. Bucket names must be globally unique:"
        );
        const command = new CreateBucketCommand({ Bucket: bucketName });
        await s3Client.send(command);
        console.log("Bucket created successfully.\n");
        return bucketName;
    },

    uploadFilesToBucket: async function({ bucketName, folderPath }){
        console.log(`Uploading files from ${folderPath}\n`);
        const keys = readdirSync(folderPath);
        const files = keys.map((key) => {
            const filePath = `${folderPath}/${key}`;
            const fileContent = readFileSync(filePath);
            return {
            Key: key,
            Body: fileContent,
            };
        });

        for (let file of files) {
            await s3Client.send(
            new PutObjectCommand({
                Bucket: bucketName,
                Body: file.Body,
                Key: file.Key,
            })
            );
            console.log(`${file.Key} uploaded successfully.`);
        
        }
    },

    listFilesInBucket: async function( {bucketName} ){
        const command = new ListObjectsCommand({ Bucket: bucketName });
        const { Contents } = await s3Client.send(command);
        const contentsList = Contents.map((c) => ` • ${c.Key}`).join("\n");
        console.log("\nHere's a list of files in the bucket:");
        console.log(contentsList + "\n");
    },

    copyFileFromBucket: async function ({destinationBucket}){
        const answer = await promptForText(
            "Would you like to copy an object from another bucket? (yes/no)"
        );
    
        if (answer === "no") {
            return;
        } else {
            const copy = async () => {
            try {
                const sourceBucket = await promptForText("Enter source bucket name:");
                const sourceKey = await promptForText("Enter source key:");
                const destinationKey = await promptForText("Enter destination key:");
    
                const command = new CopyObjectCommand({
                Bucket: destinationBucket,
                CopySource: `${sourceBucket}/${sourceKey}`,
                Key: destinationKey,
                });
                await s3Client.send(command);
                await copyFileFromBucket({ destinationBucket });
            } catch (err) {
                console.error(`Copy error.`);
                console.error(err);
                const retryAnswer = await promptForText("Try again? (yes/no)");
                if (retryAnswer !== "no") {
                await copy();
                }
            }
            };
            await copy();
        }
    }, 

    downloadFilesFromBucket: async function ({bucketName}){
        const { Contents } = await s3Client.send(
            new ListObjectsCommand({ Bucket: bucketName })
        );
        const path = await promptForText("Enter destination path for files:");
    
        for (let content of Contents) {
            const obj = await s3Client.send(
            new GetObjectCommand({ Bucket: bucketName, Key: content.Key })
            );
            writeFileSync(
            `${path}/${content.Key}`,
            await obj.Body.transformToByteArray()
            );
        }
        console.log("Files downloaded successfully.\n");
    },

    emptyBucket: async function({ bucketName }){
        const listObjectsCommand = new ListObjectsCommand({ Bucket: bucketName });
        const { Contents } = await s3Client.send(listObjectsCommand);
        const keys = Contents.map((c) => c.Key);

        const deleteObjectsCommand = new DeleteObjectsCommand({
            Bucket: bucketName,
            Delete: { Objects: keys.map((key) => ({ Key: key })) },
        });
        await s3Client.send(deleteObjectsCommand);
        console.log(`${bucketName} emptied successfully.\n`);
    },

    deleteBucket: async function ({bucketName}){
        const command = new DeleteBucketCommand({ Bucket: bucketName });
        await s3Client.send(command);
        console.log(`${bucketName} deleted successfully.\n`);
    },

    main: async function (){
        const OBJECT_DIRECTORY = `${dirnameFromMetaUrl(
            import.meta.url
        )}../../../../resources/sample_files/.sample_media`;
    
        try {
            console.log(wrapText("Welcome to the Amazon S3 getting started example."));
            console.log("Let's create a bucket.");
            const bucketName = await createBucket();
            await promptToContinue();
    
            console.log(wrapText("File upload."));
            console.log(
            "I have some default files ready to go. You can edit the source code to provide your own."
            );
            await uploadFilesToBucket({
            bucketName,
            folderPath: OBJECT_DIRECTORY,
            });
    
            await listFilesInBucket({ bucketName });
            await promptToContinue();
    
            console.log(wrapText("Copy files."));
            await copyFileFromBucket({ destinationBucket: bucketName });
            await listFilesInBucket({ bucketName });
            await promptToContinue();
    
            console.log(wrapText("Download files."));
            await downloadFilesFromBucket({ bucketName });
    
            console.log(wrapText("Clean up."));
            await emptyBucket({ bucketName });
            await deleteBucket({ bucketName });
        } catch (err) {
            console.error(err);
        }
    }
}



// snippet-start:[javascript.v3.s3.scenarios.basic.CreateBucket]

// snippet-end:[javascript.v3.s3.scenarios.basic.PutObject]

// snippet-start:[javascript.v3.s3.scenarios.basic.ListObjects]

// snippet-end:[javascript.v3.s3.scenarios.basic.ListObjects]

// snippet-start:[javascript.v3.s3.scenarios.basic.CopyObject]

// snippet-end:[javascript.v3.s3.scenarios.basic.CopyObject]

// snippet-start:[javascript.v3.s3.scenarios.basic.GetObject]

// snippet-end:[javascript.v3.s3.scenarios.basic.GetObject]

// snippet-start:[javascript.v3.s3.scenarios.basic.clean]


// snippet-end:[javascript.v3.s3.scenarios.basic.clean]

// snippet-start:[javascript.v3.s3.scenarios.basic.main]
// snippet-end:[javascript.v3.s3.scenarios.basic.main]

// snippet-start:[javascript.v3.s3.scenarios.basic.runner]
// Invoke main function if this file was run directly.
        // if (process.argv[1] === fileURLToPath(import.meta.url)) {
        //     main();
        // }
// snippet-end:[javascript.v3.s3.scenarios.basic.runner]