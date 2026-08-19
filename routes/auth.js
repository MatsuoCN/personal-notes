const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');

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

// Rota de Login de usuário
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // 1. Verifica se o usuário existe no banco
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: 'Email ou senha incorretos' });
    }

    // 2. Compara a senha digitada com a senha embaralhada do banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ message: 'Email ou senha incorretos' });
    }

    // 3. Gera o crachá de acesso (Token) que dura 1 hora
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login realizado com sucesso', token });

  } catch (erro) {
    console.error('Erro no login:', erro);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

module.exports = router;
