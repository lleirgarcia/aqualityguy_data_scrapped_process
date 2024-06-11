import AWS from 'aws-sdk';
import NodeCache from 'node-cache';

const s3Cache = new NodeCache({ stdTTL: 3600 });

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    region: process.env.AWS_REGION!
});

const s3 = new AWS.S3();

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
