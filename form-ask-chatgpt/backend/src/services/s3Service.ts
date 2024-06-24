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

interface FormattedComment {
    mainComment: string;
    replies: string[];
}

interface FormattedJSON {   
    videoDesc: string;
    url: string;
    comments: FormattedComment[];
}

const formatJSONForOpenAI = (json: any): FormattedJSON => {
    return {
        videoDesc: json.videoDesc,
        url: json.url,
        comments: json.commentList.map((comment: any) => ({
            mainComment: comment.mainComment,
            replies: comment.replies.map((reply: any) => reply.comment)
        }))
    };
};

export const fetchFilesFromS3 = async (folder: string): Promise<S3File[]> => {
    console.log(`Fetching files from S3 folder: ${folder}`);
    const cacheKey = `s3Files_${folder}`;
    const cachedFiles = s3Cache.get<S3File[]>(cacheKey);

    if (cachedFiles) {
        console.log("Retrieving data from cache");
        return cachedFiles;
    }

    const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Prefix: folder.endsWith('/') ? folder : `${folder}/`  // Ensure folder ends with '/'
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
            let formattedData = objectData.Body ? objectData.Body.toString('utf-8') : null;

            // Verificar la extensión del archivo para determinar si debe ser formateado a JSON
            if (object.Key && object.Key.endsWith('.json') && formattedData) {
                const parsedData = JSON.parse(formattedData);
                formattedData = JSON.stringify(formatJSONForOpenAI(parsedData));
            }

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

export const fetchFileFromS3 = async (fileKey: string): Promise<S3File | null> => {
    console.log(`Fetching file from S3: ${fileKey}`);
    const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: fileKey
    };

    try {
        const objectData = await s3.getObject(params).promise();
        return {
            Key: fileKey,
            Body: objectData.Body ? objectData.Body.toString('utf-8') : null
        };
    } catch (error) {
        if (error === 'NoSuchKey' || error === 'NotFound') {
            console.warn(`File ${fileKey} not found.`);
            return null; // Return null if the file does not exist
        }
        console.error("Error fetching file from S3:", error);
        throw new Error("Failed to fetch file from S3");
    }
};

export const writeFileToS3 = async (fileKey: string, content: string): Promise<void> => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: fileKey,
        Body: content,
        ContentType: 'text/plain'
    };

    try {
        await s3.putObject(params).promise();
        console.log(`File ${fileKey} has been updated in S3`);
    } catch (error) {
        console.error("Error writing to file in S3:", error);
        throw new Error("Failed to write to file in S3");
    }
};

export const updateHistoricFileWithQuestion = async (fileKey: string, question: string): Promise<void> => {
    try {
        // Leer el archivo existente desde S3
        const file = await fetchFileFromS3(fileKey);
        let updatedContent = question;

        if (file && file.Body) {
            // Agregar la nueva pregunta al contenido existente
            updatedContent = `${file.Body}\n${question}`;
        }

        // Escribir el archivo actualizado de vuelta a S3
        await writeFileToS3(fileKey, updatedContent);
        console.log(`Question added to ${fileKey}`);
    } catch (error) {
        console.error("Error updating historic file:", error);
        throw new Error("Failed to update historic file");
    }
};

export const uploadFolderToS3 = async (folderPath: string, baseKey: string) => {
    console.log(`Folder path ${folderPath}`);
    console.log(`Basekey ${baseKey}`);
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
    console.log("Uploading file to S3...");
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
