function validarCadastroUser(nome, email, senha){
    // valida nome
    const validaNome = nome.length >= 10;
    // valida senha
    const minusculos = /[a-z]+/.test(senha);
    const numericos = /[0-9]+/.test(senha);
    const simbolos = /[!@#$%&*-+/~=|]+/.test(senha)
    const validaSenha = minusculos && numericos && simbolos
    // verifica se todos os campos estão válidos
    const validaCampos = validaNome && validaSenha;

    return validaCampos    
}

module.exports = { validarCadastroUser }