const {
  Modulo,
  Topico,
  VideoUrls,
  SaibaMais,
  Referencias,
  Exercicios,
  Alternativas,
  Usuario,
  FichaTecnica,
  Equipe,
  ReferenciaModulo,
  Vantagem,
  Membro,
  Aluno,
  UsuarioModulo
} = require("../models");

const bcrypt = require("bcrypt");
const topicoService = require("../services/topico");
const usuarioService = require("../services/usuario");
const { randomUUID } = require("crypto");
const { Op } = require('sequelize');

async function criarModulo({
  nome_modulo,
  video_inicial,
  ebookUrlGeral,
  nome_url,
  usuario_id,
}) {
  try {
    const uuid = randomUUID();

    const modulo = await Modulo.create({
      nome_url,
      nome_modulo,
      ebookUrlGeral,
      video_inicial,
      usuario_id,
      uuid,
    });

    return modulo;
  } catch (error) {
    console.error("Erro ao criar módulo:", error);
    throw new Error("Erro ao criar o módulo");
  }
}

async function listarModulos() {
  try {
    const modulos = await Modulo.findAll();
    return modulos;
  } catch (error) {
    console.error("Erro ao listar módulos:", error);
    throw new Error("Erro ao listar módulos");
  }
}
async function listarModulosTemplates() {
  try {
    const modulos = await Modulo.findAll({
      where: { template: 1 },
    });
    return modulos;
  } catch (error) {
    console.error("Erro ao listar templates:", error);
    throw new Error("Erro ao listar templates");
  }
}

async function obterModulosPorUsuario(usuarioId) {
  try {
    const modulos = await Modulo.findAll({
      where: { usuario_id: usuarioId },
    });

    return modulos;
  } catch (error) {
    console.error("Erro ao obter módulos por usuário:", error);
    throw new Error("Erro ao obter módulos por usuário.");
  }
}

async function obterModuloPorId(id) {
  try {
    const modulo = await Modulo.findByPk(id);
    return modulo;
  } catch (error) {
    console.error("Erro ao buscar módulo por ID:", error);
    throw new Error("Erro ao buscar módulo por ID");
  }
}

async function atualizarModulo(id, dadosAtualizados) {
  try {
    const modulo = await Modulo.findByPk(id);
    if (!modulo) {
      return null;
    }

    await modulo.update(dadosAtualizados);
    return modulo;
  } catch (error) {
    console.error("Erro ao atualizar módulo:", error);
    throw new Error("Erro ao atualizar módulo");
  }
}

async function deletarModulo(idAdm, senhaAdm, idExcluir) {
  try {
    const admin = await Usuario.findOne({ where: { id: idAdm, tipo: "adm" } });

    if (admin != null) {
      if (!admin || !(await bcrypt.compare(senhaAdm, admin.senha))) {
        return false;
      }

      const modulo = await Modulo.findByPk(idExcluir, {
        include: [{ model: Topico, as: "Topicos" }],
      });

      if (!modulo) {
        return false;
      }

      await modulo.destroy();
      return true;
    } else {
      const verificaModulo = await usuarioService.verificaModuloEhDoUsuario(
        idAdm,
        idExcluir
      );
      if (verificaModulo) {
        const modulo = await Modulo.findByPk(idExcluir, {
          include: [{ model: Topico, as: "Topicos" }],
        });

        if (!modulo) {
          return false;
        }

        await modulo.destroy();
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.error("Erro ao deletar módulo:", error);
    throw new Error("Erro ao deletar módulo");
  }
}

async function atualizarStatusPublicacao(id, publicar) {
  try {
    const modulo = await Modulo.findByPk(id);

    if (!modulo) {
      return null;
    }

    modulo.publicado = publicar;
    await modulo.save();

    return modulo;
  } catch (error) {
    console.error("Erro ao atualizar status de publicação:", error);
    throw new Error("Erro ao atualizar status de publicação");
  }
}

async function obterModuloPorIdESeusTopicos(id) {
  try {
    const modulo = await Modulo.findByPk(id, {
      include: [
        {
          model: Topico,
          include: [
            { model: VideoUrls, as: "VideoUrls" },
            { model: SaibaMais, as: "SaibaMais" },
            { model: Referencias, as: "Referencias" },
            {
              model: Exercicios,
              as: "Exercicios",
              include: [{ model: Alternativas, as: "Alternativas" }],
            },
          ],
        },
        {
          model: FichaTecnica,
          include: [{ model: Equipe, as: "Equipes", include: [{model:Membro}] }],
        },
        {
          model: ReferenciaModulo,
        },
        {
          model: Vantagem,
        },
      ],
    });

    return modulo;
  } catch (error) {
    console.error("Erro ao buscar módulo por ID:", error);
    throw new Error("Erro ao buscar módulo por ID" + error);
  }
}

async function getProgressoAlunosPorModulo(idModulo, filtros = {}) {
  try {
    const where = { id_modulo: idModulo };

    // Filtro por ativo
    if (filtros.ativo !== undefined) {
      where.ativo = filtros.ativo;
    }

    // Filtro por progresso mínimo
    if (filtros.progressoMin !== undefined) {
      where.progresso = { [Op.gte]: parseFloat(filtros.progressoMin) };
    }

    // Filtro por nota mínima
    if (filtros.notaMin !== undefined) {
      where.nota = { [Op.gte]: parseFloat(filtros.notaMin) };
    }

    // Filtro por nome ou email (dentro do include de Aluno)
    const alunoWhere = {};

    if (filtros.nome) {
      alunoWhere.nome = { [Op.like]: `%${filtros.nome}%` };
    }

    if (filtros.email) {
      alunoWhere.email = { [Op.like]: `%${filtros.email}%` };
    }

    const alunosModulo = await UsuarioModulo.findAll({
      where,
      include: [{
        model: Aluno,
        where: Object.keys(alunoWhere).length > 0 ? alunoWhere : undefined,
      }],
    });

    return alunosModulo;
  } catch (error) {
    console.error('Erro ao buscar progresso dos alunos por módulo:', error);
    throw new Error('Erro ao buscar progresso dos alunos por módulo');
  }
}

async function atualizarUsuarioModulo(id, novosDados) {
  try {
    const usuarioModulo = await UsuarioModulo.findByPk(id);
    if (!usuarioModulo) return null;

    await usuarioModulo.update(novosDados);
    return usuarioModulo;
  } catch (error) {
    console.error('Erro ao atualizar UsuarioModulo:', error);
    throw new Error('Erro ao atualizar relação aluno-módulo');
  }
}


module.exports = {
  criarModulo,
  listarModulos,
  obterModuloPorId,
  atualizarModulo,
  deletarModulo,
  atualizarStatusPublicacao,
  obterModuloPorIdESeusTopicos,
  obterModulosPorUsuario,
  listarModulosTemplates,
  getProgressoAlunosPorModulo,
  atualizarUsuarioModulo
};
