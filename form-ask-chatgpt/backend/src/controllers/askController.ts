import dotenv from 'dotenv';
import path from 'path';
import { Request, Response } from 'express';
import { OpenAIService } from '../services/openaiService';
import { fetchFilesFromS3, writeFileToS3, uploadFileToS3, updateHistoricFileWithQuestion } from '../services/s3Service';
import { __dirname } from '../utils';
import { compressFiles } from '../services/compressionService';
import { sendEmail } from 'services/emailService';
import { getEnvVariable } from '../utils';
import { S3File } from 'interfaces/S3';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const openaiService = new OpenAIService(process.env.OPENAI_API_KEY!);

const askController = async (req: Request, res: Response) => {
    console.log("asking...");
    const { question, email } = req.body;
    try {
        await updateHistoricFileWithQuestion(getEnvVariable('S3_HISTORIC'), question)
        const files = await fetchFilesFromS3(getEnvVariable('S3_JSON_FILES'));
        await openaiService.createResponsesByOpenAI(question, files);
        const zipFilePath = await compressFiles(email);
        const s3Key = `dataGenerated/historic/compressed_files_${email}.zip`;
        const downloadLink = await uploadFileToS3(zipFilePath, s3Key);
        await sendEmail(email, downloadLink);
        res.json({ question, undefined, downloadLink });
    } catch (error) {
        console.error("Error processing question:", error);
        res.status(500).send(error);
    }
};

export default askController;
