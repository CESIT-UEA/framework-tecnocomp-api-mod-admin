const express = require("express");
const cors = require("cors");
const { sequelize } = require("./db/connect");
const Plataforma = require("./models/registro_plataforma");
const Modulo = require("./models/modulo");
const Topico = require("./models/topico");
const VideoUrls = require("./models/videosUrls");
const SaibaMais = require("./models/saibaMais");
const Referencias = require("./models/referencias");
const Exercicios = require("./models/exercicios");
const Alternativas = require("./models/alternativas");

const app = express();
const PORT = 3101;

app.use(
  cors({
    origin: ["http://localhost:59667"],
    credentials: true,
  })
);

app.use(express.json());

app.post("/cadastro_lms", async (req, res) => {
  const dados = req.body;
  const verifica = await Plataforma.findOne({
    where: { idCliente: dados.idCliente },
  });

  if (!verifica) {
    const plataforma = await Plataforma.create({
      nomeCliente: dados.nomeCliente,
      plataformaUrl: dados.url,
      plataformaNome: dados.plataformaNome,
      idCliente: dados.idCliente,
    });
    plataforma.save();
  }
  res.status(200).json(dados);
});

app.post("/criar_modulo", async (req, res) => {
    const { nome_modulo, video_inicial, topicos, idCliente } = req.body;
  
    try {
      // Verifica se a plataforma já existe
      const plataforma = await Plataforma.findOne({ where: { idCliente } });
  
      if (!plataforma) {
        console.log("Plataforma não encontrada");
        return res.status(404).json({ error: "Plataforma não encontrada" });
      }
  
      console.log("Plataforma encontrada, criando módulo...");
  
      const modulo = await Modulo.create({
        nome_modulo,
        video_inicial,
        plataformaId: plataforma.id // Associa o módulo à plataforma existente
      });
  
      console.log(`Módulo criado: ${modulo.id}`);
  
      const topicosCriados = await Promise.all(
        topicos.map(async (topico) => {
          const novoTopico = await Topico.create({
            id_modulo: modulo.id,
            nome_topico: topico.nome_topico,
            ebookUrlGeral: topico.ebookUrlGeral,
            textoApoio: topico.textoApoio,
          });
  
          console.log(`Tópico criado: ${novoTopico.id}`);
  
          await Promise.all(
            topico.videoUrls.map(async (url) => {
              await VideoUrls.create({
                id_topico: novoTopico.id,
                url,
              });
            })
          );
  
          await Promise.all(
            topico.saibaMais.map(async (sm) => {
              await SaibaMais.create({
                id_topico: novoTopico.id,
                descricao: sm.descricao,
                url: sm.url,
              });
            })
          );
  
          await Promise.all(
            topico.referencias.map(async (ref) => {
              await Referencias.create({
                id_topico: novoTopico.id,
                caminhoDaImagem: ref.caminhoDaImagem,
                referencia: ref.referencia,
              });
            })
          );
  
          const exerciciosCriados = await Promise.all(
            topico.exercicios.map(async (exercicio) => {
              const novoExercicio = await Exercicios.create({
                id_topico: novoTopico.id,
                questao: exercicio.questao,
              });
  
              console.log(`Exercício criado: ${novoExercicio.id}`);
  
              await Promise.all(
                exercicio.alternativas.map(async (alt) => {
                  await Alternativas.create({
                    id_exercicio: novoExercicio.id,
                    descricao: alt.descricao,
                    explicacao: alt.explicacao,
                    correta: alt.correta,
                  });
                })
              );
  
              return novoExercicio;
            })
          );
  
          return novoTopico;
        })
      );
  
      res.status(201).json({
        modulo,
        topicos: topicosCriados,
      });
    } catch (error) {
      console.error("Erro ao criar módulo e tópicos:", error);
      res.status(500).json({ error: "Erro ao criar módulo e tópicos" });
    }
  });
  
  

app.listen(PORT, async () => {
  try {
    await sequelize.sync();
    console.log("Conectado ao banco de dados e tabelas sincronizadas");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }
  console.log(`SERVIDOR NO AR - PORTA ${PORT}`);
});
