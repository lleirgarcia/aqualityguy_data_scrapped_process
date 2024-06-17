import dotenv from 'dotenv';
import path from 'path';
import { Request, Response } from 'express';
import { OpenAIService } from '../services/openaiService';
import { fetchFilesFromS3 } from '../services/s3Service';
import { OpenAIResponse } from '../interfaces/OpenAIResponse';
import { __dirname } from '../utils';
import { compressFiles } from '../services/compressionService';
import { uploadFileToS3 } from '../services/s3Service';
import { sendEmail } from 'services/emailService';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const openaiService = new OpenAIService(process.env.OPENAI_API_KEY!);

const askController = async (req: Request, res: Response) => {
    console.log("asking...");
    const { question, email } = req.body;
    try {
        const files = await fetchFilesFromS3();
        // const responses: OpenAIResponse[] = await openaiService.getOpenAIResponse(question, files);

        const zipFilePath = await compressFiles(email);
        const s3Key = `dataGenerated/historic/compressed_files_${email}.zip`;
        const downloadLink = await uploadFileToS3(zipFilePath, s3Key);
        console.log(`Links ${downloadLink}`)
        await sendEmail(email, downloadLink);
        res.json({ question, undefined, downloadLink });
    } catch (error) {
        console.error("Error processing question:", error);
        res.status(500).send(error);
    }
};

export default askController;
