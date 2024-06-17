import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, downloadLink: string) => {
    console.log("Sending email...")
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Puedes cambiar esto a cualquier otro servicio
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    console.log(`Download link: ${downloadLink}`)

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Tus archivos comprimidos | aqualityguy',
        text: `Puedes descargar tus archivos comprimidos desde el siguiente enlace: ${downloadLink}`
    };

    await transporter.sendMail(mailOptions);
};
