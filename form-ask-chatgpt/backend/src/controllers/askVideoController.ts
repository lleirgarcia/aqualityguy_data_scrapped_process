import dotenv from 'dotenv';
import path from 'path';
import { Request, Response } from 'express';
import { __dirname, findJsonByUrl } from '../utils';
import { getEnvVariable } from '../utils';
import { OpenAIService } from '../services/openaiService';
import { fetchFilesFromS3 } from 'services/s3Service';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const openaiService = new OpenAIService(process.env.OPENAI_API_KEY!);

const askVideoController = async (req: Request, res: Response) => {
    console.log("asking...");
    const { question, url } = req.body;
    let response;
    try {
        const files = await fetchFilesFromS3(getEnvVariable('S3_JSON_FILES'));
        const matchedJson = findJsonByUrl(url, files);
        if(matchedJson!=null)
            response = await openaiService.askOpenAI(question, matchedJson);    
    } catch (error) {
        console.error("Error processing question:", error);
        res.status(500).send(error);
    }

    res.json({ message: 'Respuesta generada por OpenAI', question, url, openAIResponse: response });


};

export default askVideoController;
