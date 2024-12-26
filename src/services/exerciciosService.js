const { Exercicios, Alternativas } = require('../models');

async function criarExercicios(idTopico, exercicios) {
  try {
    for (const exercicio of exercicios) {
      const novoExercicio = await Exercicios.create({
        id_topico: idTopico,
        questao: exercicio.questao,
      });

      const alternativas = exercicio.alternativas.map((alt) => ({
        id_exercicio: novoExercicio.id,
        descricao: alt.descricao,
        explicacao: alt.explicacao,
        correta: alt.correta,
      }));

      await Alternativas.bulkCreate(alternativas);
    }
  } catch (error) {
    console.error('Erro ao criar Exercícios:', error);
    throw new Error('Erro ao criar Exercícios');
  }
}

module.exports = { criarExercicios };
