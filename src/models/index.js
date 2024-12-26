const { sequelize } = require('../db/connect');
const Usuario = require('./usuario');
const Aluno = require('./aluno');
const PlataformaRegistro = require('./registro_plataforma');
const Modulo = require('./modulo');
const Topico = require('./topico');
const VideoUrls = require('./videosUrls');
const SaibaMais = require('./saibaMais');
const Referencias = require('./referencias');
const Exercicios = require('./exercicios');
const Alternativas = require('./alternativas');
const UsuarioModulo = require('./usuarioModulo');
const UsuarioTopico = require('./usuarioTopico');

// Associações
Usuario.hasMany(PlataformaRegistro, { foreignKey: 'usuario_id' });
PlataformaRegistro.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Usuario.hasMany(Modulo, { foreignKey: 'usuario_id' });
Modulo.belongsTo(Usuario, { foreignKey: 'usuario_id' });

PlataformaRegistro.hasMany(Modulo, { foreignKey: 'plataforma_id' });
Modulo.belongsTo(PlataformaRegistro, { foreignKey: 'plataforma_id' });

Modulo.hasMany(Topico, { foreignKey: 'id_modulo', onDelete: 'CASCADE' });
Topico.belongsTo(Modulo, { foreignKey: 'id_modulo' });

Topico.hasMany(VideoUrls, { foreignKey: 'id_topico', onDelete: 'CASCADE' });
VideoUrls.belongsTo(Topico, { foreignKey: 'id_topico' });

Topico.hasMany(SaibaMais, { foreignKey: 'id_topico', onDelete: 'CASCADE' });
SaibaMais.belongsTo(Topico, { foreignKey: 'id_topico' });

Topico.hasMany(Referencias, { foreignKey: 'id_topico', onDelete: 'CASCADE' });
Referencias.belongsTo(Topico, { foreignKey: 'id_topico' });

Topico.hasMany(Exercicios, { foreignKey: 'id_topico', onDelete: 'CASCADE' });
Exercicios.belongsTo(Topico, { foreignKey: 'id_topico' });

Exercicios.hasMany(Alternativas, { foreignKey: 'id_exercicio', onDelete: 'CASCADE' });
Alternativas.belongsTo(Exercicios, { foreignKey: 'id_exercicio' });

Aluno.hasMany(UsuarioModulo, { foreignKey: 'ltiUserId' });
UsuarioModulo.belongsTo(Aluno, { foreignKey: 'ltiUserId' });

Aluno.hasMany(UsuarioTopico, { foreignKey: 'ltiUserId' });
UsuarioTopico.belongsTo(Aluno, { foreignKey: 'ltiUserId' });

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
};
