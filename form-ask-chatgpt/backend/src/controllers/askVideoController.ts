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
    console.log("Controller ...");
    const { question, url } = req.body;
    let response;

    try {
        const files = await fetchFilesFromS3(getEnvVariable('S3_JSON_FILES'), 500);
        const matchedJson = findJsonByUrl(url, files);

        console.log("Match: " + matchedJson);

        // Si no se encuentra una coincidencia en la URL
        if (matchedJson === null) {
            return res.status(404).json({ message: 'Tu URL no coincide', question, url });
        }

        // Si se encuentra coincidencia, llamamos a OpenAI
        response = await openaiService.askOpenAI(question, matchedJson);

        // Devuelve la respuesta de OpenAI
        return res.json({ message: 'Respuesta generada por OpenAI', question, url, openAIResponse: response });

    } catch (error) {
        // Manejo de errores y envío de un mensaje claro al cliente
        console.error("Error processing question:", error);
        return res.status(500).json({ message: 'Error interno del servidor', error: error });
    }
};
export default askVideoController;
