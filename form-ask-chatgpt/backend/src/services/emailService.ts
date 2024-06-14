import nodemailer from 'nodemailer';
import path from 'path';
import { __dirname } from '../utils';
import { promisify } from 'util';
import fs from 'fs';

const readFileAsync = promisify(fs.readFile);

export const sendEmail = async (to: string, filePath: string) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // puedes cambiar esto a cualquier otro servicio
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    console.log(`Filepath ${filePath}`)

    const mailOptions = {
        from: process.env.EMAIL_USER,
        // to: to,
        to: "lleir.garcia@cloudpay.net",
        subject: 'Tus archivos comprimidos',
        text: 'Adjunto encontrarás los archivos comprimidos generados.',
        attachments: [
            {
                filename: path.basename(filePath),
                path: filePath
            }
        ]
    };

    await transporter.sendMail(mailOptions);
};
