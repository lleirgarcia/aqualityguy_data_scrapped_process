import OpenAI from 'openai';
import fs from 'fs';
import { promisify } from 'util';
import { __dirname } from '../utils';
import path from 'path';
import { File, OpenAIResponse } from '../interfaces/OpenAIResponse';
import { uploadFolderToS3 } from './s3Service';

const writeFileAsync = promisify(fs.writeFile);
const appendFileAsync = promisify(fs.appendFile);
const mkdirAsync = promisify(fs.mkdir);
const accessAsync = promisify(fs.access);

export class OpenAIService {
    private openai: OpenAI;

    constructor(apiKey: string) {
        this.openai = new OpenAI({ apiKey: apiKey });
    }

    /**
     * La funcion procesa una pregunta por cada uno de los ficheros JSON con datos.
     * Cuando obtiene la respuesta de OpenAI, se crea un fichero .txt que se almacena.
     * Este fichero se almacena en /backend/uploads, crea una carpeta con el ID del video y guarda:
     *  - el fichero de respuesta con "pregunta adaptada" y un "timestamp".
     *  - por cada carpeta de video, crea un (1) .txt con un historico de "preguntas" sobre el video, por cada pregunta tengo:
     *      - el nombre del fichero .txt que ha creado.
     *      - fecha natural de cuando se hizo esa pregunta.
     *      - Mas adelante: email persona que realiza la pregunta (que lo recogere)
     *  - por cada carpeta de video, crea un (2) .txt con los datos del video.
     *      - views
     *      - comments total
     *      - likes 
     *      - full url
     *      - description
     * 
     * Así, la carpeta de video mantendrá todas las preguntas y sus respuestas a modo de historico,
     * incluso en el caso que quiera recoger info de esas preguntas y esten duplicadas, openai me puede ayudar a no recoger
     * datos de preguntas similares.
     * 
     * @param question 
     * @param files 
     * @returns 
     */
    async getOpenAIResponse(question: string, files: File[]): Promise<OpenAIResponse[]> {
        console.log("Generating OpenAI responses...");

        const responses: OpenAIResponse[] = [];
        let INDEX_TEMPORAL = 0;
        for (const file of files) {
            const item = file.Body; 
            const itemString = JSON.stringify(item, null, 2);
            const videoId = this.extractVideoId(item.url);

            if (!videoId) {
                console.error("Invalid URL format:", item.url);
                continue;
            }

            const folderPath = path.join(__dirname, '../../uploads', videoId);
            await this.createFolderIfNotExists(folderPath);

            const prompt = `
            You are a helpful assistant. Here is a question related to a specific item:
            Question: ${question}
            
            Here is the item:
            ${itemString}
            
            Please provide a detailed response based on the question and the item.
            
            Give me the response in Spanish!
            `;

            try {
                const response = await this.openai.chat.completions.create({
                    model: "gpt-4-turbo",
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 4096
                });

                const result = response.choices[0].message?.content || 'No response';
                const name = this.compactString(question);
                const fileName = `${name}-${Date.now()}.txt`;
                const filePath = path.join(folderPath, fileName);
                const fileContent = result;
                
                await writeFileAsync(filePath, fileContent);
                await this.createHistoryFile(folderPath, fileName, question);
                await this.createVideoDataFile(folderPath, item);
                await uploadFolderToS3(folderPath, `dataGenerated/${videoId}`); // Sube a la carpeta correcta

                console.log(`Archivo ${fileName} escrito con éxito en ${folderPath} para el video ${videoId}.`);
                
                responses.push({ item, response: result });
            } catch (error) {
                console.error("Error during API call:", error);
                throw new Error('Failed to get response from OpenAI');
            }
            INDEX_TEMPORAL++;
            // if (INDEX_TEMPORAL == 5) break;
        }

        return responses;
    }

    private extractVideoId(url: string): string | null {
        const match = url.match(/\/video\/(\d+)/);
        return match ? match[1] : null;
    }

    private async createFolderIfNotExists(folderPath: string): Promise<void> {
        try {
            await accessAsync(folderPath, fs.constants.F_OK);
        } catch (error) {
            await mkdirAsync(folderPath, { recursive: true });
        }
    }

    private compactString(input: string): string {
        let compacted = input
            .split(' ') // Divide el string en palabras
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitaliza la primera letra de cada palabra y convierte el resto a minúsculas
            .join(''); // Une las palabras sin espacios
    
        if (compacted.length > 20) {
            compacted = compacted.substring(0, 20);
        }
        console.log(`Compact string: ${compacted}`)
        return compacted;
    }

    private async createHistoryFile(folderPath: string, fileName: string, question: string): Promise<void> {
        console.log("Creating history file...")
        const historyFilePath = path.join(folderPath, 'history.txt');
        const currentDate = new Date().toLocaleString();
        const historyContent = `File name: ${fileName} -- Current date: ${currentDate} -- Question: ${question}`;

        try {
            await accessAsync(historyFilePath, fs.constants.F_OK);
            // Si history.txt existe, añade el contenido
            await appendFileAsync(historyFilePath, historyContent);
        } catch (error) {
            // Si history.txt no existe, crea y escribe el contenido
            await writeFileAsync(historyFilePath, historyContent);
        }
    }

    private async createVideoDataFile(folderPath: string, item: any): Promise<void> {
        console.log("Creating video data file (likes, comments, etc)...")
        const videoDataFilePath = path.join(folderPath, 'videoData.txt');
        const videoDataContent = `Video Description: ${item.videoDesc}\nVideo Views: ${item.videoViews}\nURL: ${item.url}\nTotal Likes: ${item.totalLikes}\nTotal Comments: ${item.totalComments}\n`;

        try {
            await accessAsync(videoDataFilePath, fs.constants.F_OK);
            // Si videoData.txt existe, no hacer nada
        } catch (error) {
            // Si videoData.txt no existe, crea y escribe el contenido
            await writeFileAsync(videoDataFilePath, videoDataContent);
        }
    }
}
