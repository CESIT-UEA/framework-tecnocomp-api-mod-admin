const { where } = require('sequelize');
const { Exercicios, Alternativas } = require('../models');

async function criarExercicios(idTopico, exercicios) {
  try {
    for (const exercicio of exercicios) {
      const novoExercicio = await Exercicios.create({
        id_topico: idTopico,
        questao: exercicio.questao,
      });

      if (!exercicio.isQuestaoAberta){
          const alternativas = exercicio.alternativas.map((alt) => ({
            id_exercicio: novoExercicio.id,
            descricao: alt.descricao,
            explicacao: alt.explicacao,
            correta: alt.correta,
          }));

          await Alternativas.bulkCreate(alternativas);
      } else {
        await Exercicios.update({ criterios: exercicio.respostaEsperada},{ where: {
          id_topico: idTopico
        }} )
      }
      setQuestaoAberta(idTopico, exercicio.isQuestaoAberta)
    }
  } catch (error) {
    console.error('Erro ao criar Exercícios:', error);
    throw new Error('Erro ao criar Exercícios');
  }
}

async function setQuestaoAberta(id_topico, valor){
  try {
    await Exercicios.update({ aberta: valor }, { 
      where: { 
        id_topico 
      }
    })
  } catch (error) {
    throw new Error('Erro ao atualizar se a questão é aberta')
  }
}

module.exports = { criarExercicios, setQuestaoAberta };
