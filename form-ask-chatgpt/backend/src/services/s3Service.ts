import AWS from 'aws-sdk';
import NodeCache from 'node-cache';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const s3Cache = new NodeCache({ stdTTL: 3600 });

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    region: process.env.AWS_REGION!
});

const s3 = new AWS.S3();
const readDirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);

interface S3File {
    Key: string;
    Body: any;
}

function formatJSON(rawData: string): any {
    try {
        return JSON.parse(rawData);
    } catch (e) {
        const cleanedData = rawData.replace(/\\n/g, '').replace(/\\/g, '');
        return JSON.parse(cleanedData);
    }
}

export const fetchFilesFromS3 = async (): Promise<S3File[]> => {
    console.log("Fecth files from s3...")
    const cacheKey = "s3Files";
    const cachedFiles = s3Cache.get<S3File[]>(cacheKey);

    if (cachedFiles) {
        console.log("Retrieving data from cache");
        return cachedFiles;
    }

    const params = {
        Bucket: process.env.S3_BUCKET_NAME!
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        const limitedObjects = data.Contents?.slice(0, 200) || [];

        const files = await Promise.all(limitedObjects.map(async object => {
            const objectParams = {
                Bucket: params.Bucket,
                Key: object.Key!
            };
            const objectData = await s3.getObject(objectParams).promise();
            const formattedData = objectData.Body ? formatJSON(objectData.Body.toString('utf-8')) : null;
            return {
                Key: object.Key!,
                Body: formattedData
            };
        }));

        s3Cache.set(cacheKey, files);
        return files;
    } catch (error) {
        console.error("Error fetching data from S3:", error);
        throw new Error("Failed to retrieve data from S3");
    }
};

export const uploadFolderToS3 = async (folderPath: string, baseKey: string) => {
    console.log(`Folder path ${folderPath}`)
    console.log(`Basekey ${baseKey}`)
    try {
        const files = await readDirAsync(folderPath);

        await Promise.all(files.map(async (file) => {
            const filePath = path.join(folderPath, file);
            const fileContent = await readFileAsync(filePath);
            const key = path.posix.join(baseKey, file);  // Utiliza path.posix.join para asegurarte de que las barras sean correctas en S3

            // Verifica si el archivo ya existe en S3
            const headParams = {
                Bucket: process.env.S3_BUCKET_NAME!,
                Key: key
            };

            try {
                await s3.headObject(headParams).promise();
                console.log(`File ${key} already exists. Skipping upload.`);
                return; // Skip the upload if the file already exists
            } catch (headErr) {
                const params = {
                    Bucket: process.env.S3_BUCKET_NAME!,
                    Key: key,
                    Body: fileContent
                };
    
                await s3.upload(params).promise();
                console.log(`Successfully uploaded ${file} to ${key}`);
            }
           
        }));
    } catch (error) {
        console.error("Error uploading folder to S3:", error);
        throw new Error("Failed to upload folder to S3");
    }
};

export const uploadFileToS3 = async (filePath: string, s3Key: string): Promise<string> => {
    console.log("Uploading file to S3...")
    const fileContent = await readFileAsync(filePath);
    const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: s3Key,
        Body: fileContent
    };

    try {
        await s3.headObject({ Bucket: process.env.S3_BUCKET_NAME!, Key: s3Key }).promise();
        console.log(`File ${s3Key} already exists in S3. Skipping upload.`);
        return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;
    } catch (error) {
        await s3.upload(params).promise();
        console.log(`Successfully uploaded ${s3Key} to S3`);
        return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;
    }
};
