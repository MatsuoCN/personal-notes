const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

// Rota de registro de usuário
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const senhacriptografada = await bcrypt.hash(senha, salt);

    const novoUsuario = new Usuario({
      nome,
      email,
      senha: senhacriptografada
    });
    await novoUsuario.save();
    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (erro) {
    console.error('Erro ao registrar usuário:', erro);
    res.status(500).json({ message: 'Erro ao registrar usuário' });

  }
});

module.exports = router;
