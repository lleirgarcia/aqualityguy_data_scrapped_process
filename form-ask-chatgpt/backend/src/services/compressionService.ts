import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { promisify } from 'util';
import { __dirname } from '../utils';

const mkdirAsync = promisify(fs.mkdir);
const accessAsync = promisify(fs.access);

export const compressFiles = async (email: string): Promise<string> => {
    console.log(`Compressing ${email}...`)
    const uploadDir = path.join(__dirname, '../../uploads');
    const outputFilePath = path.join(uploadDir, `compressed_files_${email}.zip`);

    try {
        await accessAsync(uploadDir, fs.constants.F_OK);
    } catch (error) {
        await mkdirAsync(uploadDir, { recursive: true });
    }

    const output = fs.createWriteStream(outputFilePath);
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });

    return new Promise((resolve, reject) => {
        output.on('close', () => {
            console.log(`Compressed ${archive.pointer()} total bytes`);
            console.log('Archiver has been finalized and the output file descriptor has closed.');
            resolve(outputFilePath);
        });

        archive.on('error', (err) => {
            reject(err);
        });

        archive.pipe(output);

        archive.directory(uploadDir, false);
        archive.finalize();
    });
};
