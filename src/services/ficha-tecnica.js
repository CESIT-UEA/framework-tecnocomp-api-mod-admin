const { FichaTecnica, Modulo, Equipe, Membro } = require('../models');
const { listarEquipes } = require('./equipe')
const { listarMembros } = require('./membro')

async function criarFichaTecnica(modulo_id) {
  try {
    // Verifica se o módulo já possui ficha técnica
    const existente = await FichaTecnica.findOne({ where: { modulo_id } });
    if (existente) return existente;

    const ficha = await FichaTecnica.create({ modulo_id });
    return ficha;
  } catch (error) {
    console.error("Erro ao criar ficha técnica:", error);
    throw new Error("Erro ao criar ficha técnica");
  }
}

async function obterFichaPorModulo(modulo_id) {
  try {
    return await FichaTecnica.findOne({ where: { modulo_id } });
  } catch (error) {
    console.error("Erro ao buscar ficha técnica:", error);
    throw new Error("Erro ao buscar ficha técnica");
  }
}

async function deletarFichaTecnica(id) {
  try {
    const ficha = await FichaTecnica.findByPk(id);
    if (!ficha) return null;

    await ficha.destroy();
    return true;
  } catch (error) {
    console.error("Erro ao deletar ficha técnica:", error);
    throw new Error("Erro ao deletar ficha técnica");
  }
}

async function clonarFichaTecnica(modulo_id_que_vai_clonar, modulo_id_que_esta_sendo_clonado){
  try {
  
    const ficha = await obterFichaPorModulo(modulo_id_que_esta_sendo_clonado);
    if (!ficha) throw new Error('Ficha técnica a ser clonada não encontrada!')

    // criando ficha técnica clone com o id do módulo que está clonando
    // const novaFichaTecnica = await criarFichaTecnica(modulo_id_que_vai_clonar);
    
    let equipes = await listarEquipes(ficha.dataValues.id)
    console.log(equipes)
    if (!equipes) return null


    // if (equipes?.length){
    //   equipes = equipes.map(equipes => ({ 
    //     nome: equipes.dataValues.nome, 
    //     ficha_tecnica_id: novaFichaTecnica.dataValues.id }
    //   ))
    //   await Equipe.bulkCreate(equipes)
    // }
    
    console.log('teste', equipes.dataValues.id)
    let membros = equipes.map(async (equipe) => {
       await listarMembros(equipe.dataValues.id)
    })
    console.log(membros)
    return { ficha: ficha.dataValues, equipes }

  } catch (error) {
    throw new Error('Erro ao retornar dados')
  }
}

module.exports = {
  criarFichaTecnica,
  obterFichaPorModulo,
  deletarFichaTecnica,
  clonarFichaTecnica
};
