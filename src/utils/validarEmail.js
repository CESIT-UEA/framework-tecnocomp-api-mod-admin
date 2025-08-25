const { enviarEmail } = require('../services/email');

function gerarCodigoEmail(){
    const code = Math.floor(Math.random() * 1000000).toString()
    return code.padStart(6, '0')
}

async function enviarCodigoEmail(email, codigoVerificacao){ 
    enviarEmail(email, "Código de verificação", `Seu código de verificação é ${codigoVerificacao}.`)
}

module.exports = { enviarCodigoEmail, gerarCodigoEmail }