function isNullOrEmpty(value) {
    return value == null || value.trim() === "";
  }
  
  function validarVideoUrls(videoUrls, erros) {
    videoUrls.forEach((url, index) => {
      if (isNullOrEmpty(url)) {
        erros.push(`URL de vídeo na posição ${index + 1} está ausente ou inválida.`);
      }
    });
  }
  
  function validarSaibaMais(saibaMais, erros) {
    saibaMais.forEach((sm, index) => {
      if (isNullOrEmpty(sm.descricao)) {
        erros.push(`Descrição do Saiba Mais na posição ${index + 1} está ausente.`);
      }
      if (isNullOrEmpty(sm.url)) {
        erros.push(`URL do Saiba Mais na posição ${index + 1} está ausente ou inválida.`);
      }
    });
  }
  
  function validarReferencias(referencias, erros) {
    referencias.forEach((ref, index) => {
      if (isNullOrEmpty(ref.caminhoDaImagem)) {
        erros.push(`Caminho da imagem na referência ${index + 1} está ausente.`);
      }
      if (isNullOrEmpty(ref.referencia)) {
        erros.push(`Texto da referência na posição ${index + 1} está ausente.`);
      }
    });
  }
  
  function validarExercicios(exercicios, erros) {
    if (!exercicios[0].isQuestaoAberta){
      exercicios.forEach((exercicio, exIndex) => {
      if (isNullOrEmpty(exercicio.questao)) {
        erros.push(`A questão do exercício na posição ${exIndex + 1} está ausente.`);
      }
      
      if (!Array.isArray(exercicio.alternativas) || exercicio.alternativas.length !== 4) {
        erros.push(
          `O exercício na posição ${exIndex + 1} deve conter exatamente 4 alternativas.`
        );
      }
  
      exercicio.alternativas.forEach((alt, altIndex) => {
        if (isNullOrEmpty(alt.descricao)) {
          erros.push(
            `Descrição da alternativa ${altIndex + 1} no exercício ${exIndex + 1} está ausente.`
          );
        }
        if (isNullOrEmpty(alt.explicacao)) {
          erros.push(
            `Explicação da alternativa ${altIndex + 1} no exercício ${exIndex + 1} está ausente.`
          );
        }
        if (alt.correta == null) {
          erros.push(
            `Status de "correta" da alternativa ${altIndex + 1} no exercício ${exIndex + 1} está ausente.`
          );
        }
      });
    });
    }
    if (exercicios[0].isQuestaoAberta){
      console.log('Questão discursiva', exercicios)
    }
  }
  
  function validarTopico(dadosTopico) {
    const erros = [];
  
    if (isNullOrEmpty(dadosTopico.nome_topico)) {
      erros.push("O nome do tópico é obrigatório.");
    }
    if (!dadosTopico.id_modulo) {
      erros.push("O ID do módulo é obrigatório.");
    }
  
    if (dadosTopico.videoUrls) validarVideoUrls(dadosTopico.videoUrls, erros);
    if (dadosTopico.saibaMais) validarSaibaMais(dadosTopico.saibaMais, erros);
    if (dadosTopico.referencias) validarReferencias(dadosTopico.referencias, erros);
    if (dadosTopico.exercicios) validarExercicios(dadosTopico.exercicios, erros);
  
    return erros;
  }
  
module.exports = { validarTopico };
  