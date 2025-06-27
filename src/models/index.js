const { sequelize } = require("../db/connect");
const Usuario = require("./usuario");
const Aluno = require("./aluno");
const PlataformaRegistro = require("./registro_plataforma");
const Modulo = require("./modulo");
const Topico = require("./topico");
const VideoUrls = require("./videosUrls");
const SaibaMais = require("./saibaMais");
const Referencias = require("./referencias");
const Exercicios = require("./exercicios");
const Alternativas = require("./alternativas");
const UsuarioModulo = require("./usuarioModulo");
const UsuarioTopico = require("./usuarioTopico");
const FichaTecnica = require("./fichaTecnica");
const Equipe = require("./equipe");
const Membro = require("./membro");
const Vantagem = require('./vantagem');
const ReferenciaModulo = require("./ReferenciaModulo");
const UsuarioVideo = require("./usuariovideo");
const UsuarioTemporario = require('./usuarioTemporario')



// Associações

// Usuario → PlataformaRegistro
Usuario.hasMany(PlataformaRegistro, { foreignKey: "usuario_id" });
PlataformaRegistro.belongsTo(Usuario, { foreignKey: "usuario_id" });

// Usuario → Modulo
Usuario.hasMany(Modulo, { foreignKey: "usuario_id" });
Modulo.belongsTo(Usuario, { foreignKey: "usuario_id" });

// Modulo → Topico
Modulo.hasMany(Topico, {
  foreignKey: "id_modulo",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Topico.belongsTo(Modulo, {
  foreignKey: "id_modulo",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Topico → VideoUrls
Topico.hasMany(VideoUrls, {
  foreignKey: "id_topico",
  as: "VideoUrls",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
VideoUrls.belongsTo(Topico, {
  foreignKey: "id_topico",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Topico → SaibaMais
Topico.hasMany(SaibaMais, {
  foreignKey: "id_topico",
  as: "SaibaMais",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
SaibaMais.belongsTo(Topico, {
  foreignKey: "id_topico",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Topico → Referencias
Topico.hasMany(Referencias, {
  foreignKey: "id_topico",
  as: "Referencias",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Referencias.belongsTo(Topico, {
  foreignKey: "id_topico",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Topico → Exercicios
Topico.hasMany(Exercicios, {
  foreignKey: "id_topico",
  as: "Exercicios",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Exercicios.belongsTo(Topico, {
  foreignKey: "id_topico",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Exercicios → Alternativas
Exercicios.hasMany(Alternativas, {
  foreignKey: "id_exercicio",
  as: "Alternativas",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Alternativas.belongsTo(Exercicios, {
  foreignKey: "id_exercicio",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Modulo → FichaTecnica
Modulo.hasOne(FichaTecnica, {
  foreignKey: "modulo_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
FichaTecnica.belongsTo(Modulo, {
  foreignKey: "modulo_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// FichaTecnica → Equipe
FichaTecnica.hasMany(Equipe, {
  foreignKey: "ficha_tecnica_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Equipe.belongsTo(FichaTecnica, {
  foreignKey: "ficha_tecnica_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Equipe → Membro
Equipe.hasMany(Membro, {
  foreignKey: "equipe_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Membro.belongsTo(Equipe, {
  foreignKey: "equipe_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Modulo → Vantagens
Modulo.hasMany(Vantagem, {
  foreignKey: 'modulo_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Vantagem.belongsTo(Modulo, {
  foreignKey: 'modulo_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Modulo → ReferenciasModulo
Modulo.hasMany(ReferenciaModulo, {
  foreignKey: 'modulo_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
ReferenciaModulo.belongsTo(Modulo, {
  foreignKey: 'modulo_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});


// Aluno → UsuarioModulo
Aluno.hasMany(UsuarioModulo, { foreignKey: "id_aluno" });
UsuarioModulo.belongsTo(Aluno, { foreignKey: "id_aluno" });

// Aluno → UsuarioTopico
Aluno.hasMany(UsuarioTopico, { foreignKey: "id_aluno" });
UsuarioTopico.belongsTo(Aluno, { foreignKey: "id_aluno" });

// Aluno → UsuarioVideo
Aluno.hasMany(UsuarioVideo, { foreignKey: "id_aluno" });
UsuarioVideo.belongsTo(Aluno, { foreignKey: "id_aluno" });

Modulo.hasMany(UsuarioModulo, {
  foreignKey: 'id_modulo',
});
UsuarioModulo.belongsTo(Modulo, {
  foreignKey: 'id_modulo'
});


module.exports = {
  sequelize,
  Usuario,
  Aluno,
  PlataformaRegistro,
  Modulo,
  Topico,
  VideoUrls,
  SaibaMais,
  Referencias,
  Exercicios,
  Alternativas,
  UsuarioModulo,
  UsuarioTopico,
  FichaTecnica,
  Equipe,
  Membro,
  Vantagem,
  ReferenciaModulo,
  UsuarioVideo,
  UsuarioTemporario
};
