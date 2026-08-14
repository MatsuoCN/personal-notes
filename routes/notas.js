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

module.exports = router;