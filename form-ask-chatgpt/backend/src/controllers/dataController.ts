import { Request, Response } from 'express';
import { fetchFilesFromS3 } from '../services/s3Service';
import { getEnvVariable } from '../utils';

const dataController = async (req: Request, res: Response) => {
    try {
        const files = await fetchFilesFromS3(getEnvVariable('S3_JSON_FILES'), 300);
        res.json(files);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send(error);
    }
};

export default dataController;
