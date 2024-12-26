const { Topico, VideoUrls, SaibaMais, Referencias, Exercicios, Alternativas } = require('../models');

async function obterTopicoCompletoPorModulo(idModulo) {
  try {
    // Busca o tópico com todas as associações
    const topico = await Topico.findAll({
      where: { id_modulo: idModulo },
      include: [
        { model: VideoUrls, as: 'VideoUrls' }, // Associações definidas
        { model: SaibaMais, as: 'SaibaMais' },
        { model: Referencias, as: 'Referencias' },
        {
          model: Exercicios,
          as: 'Exercicios',
          include: [{ model: Alternativas, as: 'Alternativas' }], // Inclui alternativas nos exercícios
        },
      ],
    });

    if (!topico) {
      throw new Error('Tópico não encontrado');
    }
    return topico;
  } catch (error) {
    console.error('Erro ao buscar tópico completo:', error);
    throw new Error('Erro ao buscar tópico completo');
  }
}

module.exports = {
    obterTopicoCompletoPorModulo,
};
