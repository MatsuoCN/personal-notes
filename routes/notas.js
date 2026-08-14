const express = require('express');
const router = express.Router();
const Nota = require('../models/nota');
const autenticar = require('../middleware/autenticar');

router.post('/', autenticar, async (req, res) => {
    try {
        const { titulo, conteudo } = req.body;

        const novaNota = new Nota({
            usuario: req.usuario.id,
            titulo,
            conteudo
        });

        await novaNota.save();
        res.status(201).json({ message: 'Nota criada com sucesso', nota: novaNota });
    } catch (erro) {
        console.error('Erro ao criar nota:', erro);
        res.status(500).json({ message: 'Erro ao criar nota' });
    }
});

router.get('/', autenticar, async (req, res) => {
    try {
        const notas = await Nota.find({ usuario: req.usuario.id });
        res.status(200).json(notas);
    } catch (erro) {
        console.error('Erro ao buscar notas:', erro);
        res.status(500).json({ message: 'Erro ao buscar notas' });
    }
});

// Rota PUT para atualizar uma nota existente
router.put('/:id', autenticar, async (req, res) => {
  try {
    const { titulo, conteudo } = req.body;
    
    // Procura a nota pelo ID dela, garantindo que o dono é o usuário logado
    const nota = await Nota.findOne({ _id: req.params.id, usuario: req.usuario.id });
    
    if (!nota) {
      return res.status(404).json({ message: 'Anotação não encontrada ou não pertence a você.' });
    }

    // Atualiza os dados
    nota.titulo = titulo;
    nota.conteudo = conteudo;
    await nota.save();

    res.status(200).json({ message: 'Anotação atualizada com sucesso!', nota });
  } catch (erro) {
    console.error('Erro ao atualizar nota:', erro);
    res.status(500).json({ message: 'Erro ao atualizar a anotação' });
  }
});

// Rota DELETE para apagar uma nota
router.delete('/:id', autenticar, async (req, res) => {
  try {
    // Procura e deleta a nota em um único passo
    const nota = await Nota.findOneAndDelete({ _id: req.params.id, usuario: req.usuario.id });
    
    if (!nota) {
      return res.status(404).json({ message: 'Anotação não encontrada ou não pertence a você.' });
    }

    res.status(200).json({ message: 'Anotação deletada com sucesso!' });
  } catch (erro) {
    console.error('Erro ao deletar nota:', erro);
    res.status(500).json({ message: 'Erro ao deletar a anotação' });
  }
});

module.exports = router;