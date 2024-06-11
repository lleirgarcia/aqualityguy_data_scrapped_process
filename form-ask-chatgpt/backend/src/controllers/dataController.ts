import { Request, Response } from 'express';
import { fetchFilesFromS3 } from '../services/s3Service';

const dataController = async (req: Request, res: Response) => {
    try {
        const files = await fetchFilesFromS3();
        res.json(files);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send(error);
    }
};

export default dataController;
