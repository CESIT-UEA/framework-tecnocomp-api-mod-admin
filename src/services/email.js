const nodemailer = require('nodemailer');
require('dotenv').config()

async function enviarEmail(email, titulo, texto){
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: process.env.SMTP_EMAIL, pass: process.env.PASS_EMAIL },
        tls: { rejectUnauthorized: false }  // desativa a verificação do certificado SSL
    })
    
    const contentEmail = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: titulo,
        text: texto
    }

    try {
        let info = await transporter.sendMail(contentEmail);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        return { success: false, error: error.message };
    }
}


module.exports = { enviarEmail }