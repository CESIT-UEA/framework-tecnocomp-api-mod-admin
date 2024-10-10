const express = require('express');
const { Modulo, Topico, VideoUrls, SaibaMais, Referencias, Exercicios, Alternativas } = require('../models');
const router = express.Router();

router.post('/modulo', async (req, res) => {
  try {
    const { nome_modulo, video_inicial, plataforma_id, topicos } = req.body;
    usuario_id = req.body.usuario_id

    console.log(topicos)
    console.log("Inicio das verificações");
    
    if (topicos) {
      topicos.forEach(topico => {
        topico.videoUrls.forEach(videoUrls => {
          if (videoUrls.url == null || videoUrls.url == '') {
            res.status(400).json("Erro no videoUrls")
          }
        })

        topico.saibaMais.forEach(saibaMais => {
          if (saibaMais.url == null || saibaMais.url == '') {
            res.status(400).json("Erro no Saiba mais")
          }
          if (saibaMais.descricao == null || saibaMais.descricao == '') {
            res.status(400).json("Erro no Saiba mais")
          }
        })

        topico.videoUrls.referencias(referencias => {
          if (referencias.caminhoDaImagem == null || referencias.caminhoDaImagem == '') {
            res.status(400).json("Erro nas referencias")
          }
          if (referencias.referencia == null || referencias.referencia == '') {
            res.status(400).json("Erro nas referencias")
          }
        })

        topico.exercicios.forEach(exercicios => {
          if (exercicios.questao == null || exercicios.questao == '') {
            res.status(400).json("Erro no exercicios")
          }

          exercicio.alternativas.forEach(alternativas => {
            if (alternativas.descricao == null || alternativas.descricao == '') {
              res.status(400).json("Erro nas alternativas")
            }

            if (alternativas.explicacao == null || alternativas.explicacao == '') {
              res.status(400).json("Erro nas alternativas")
            }
            if (alternativas.correta == null) {
              res.status(400).json("Erro nas alternativas")
            }
          })
        })
      });
    }

    const modulo = await Modulo.create({ nome_modulo, video_inicial, plataforma_id,usuario_id});

    await Promise.all(topicos.map(async (topico) => {
      const novoTopico = await Topico.create({ ...topico, id_modulo: modulo.id });
      
      await Promise.all(topico.videoUrls.map(async (url) => {
        await VideoUrls.create({ id_topico: novoTopico.id, url });
      }));
      
      await Promise.all(topico.saibaMais.map(async (sm) => {
        await SaibaMais.create({ id_topico: novoTopico.id, descricao: sm.descricao, url: sm.url });
      }));
      
      await Promise.all(topico.referencias.map(async (ref) => {
        await Referencias.create({ id_topico: novoTopico.id, caminhoDaImagem: ref.caminhoDaImagem, referencia: ref.referencia });
      }));
      
      await Promise.all(topico.exercicios.map(async (exercicio) => {
        const novoExercicio = await Exercicios.create({ id_topico: novoTopico.id, questao: exercicio.questao });

        await Promise.all(exercicio.alternativas.map(async (alternativa) => {
          await Alternativas.create({ id_exercicio: novoExercicio.id, descricao: alternativa.descricao, explicacao: alternativa.explicacao, correta: alternativa.correta });
        }));
      }));
    }));

    res.status(201).json({ modulo, topicos }); //Adicionei pra retornar os topicos criados no json
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
