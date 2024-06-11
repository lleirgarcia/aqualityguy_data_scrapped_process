import { Request, Response } from 'express';
import { getOpenAIResponse } from '../services/openaiService';
import { fetchFilesFromS3 } from '../services/s3Service';

const askController = async (req: Request, res: Response) => {
    console.log("asking...");
    const { question } = req.body;
    try {
        const files = await fetchFilesFromS3();
        const response = await getOpenAIResponse(question, files);
        res.json({ question, response });
    } catch (error) {
        console.error("Error processing question:", error);
        res.status(500).send(error);
    }
};

export default askController;
