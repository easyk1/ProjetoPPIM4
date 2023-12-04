const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/user', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const User = mongoose.model('User', {
  nome: String,
  email: String,
  senha: String
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
  secret: 'suaChaveSecreta',
  resave: false,
  saveUninitialized: true
}));

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email, senha }).exec();

    if (user) {
      req.session.user = user;

      res.cookie('nomeUsuario', user.nome);
      res.cookie('ultimoAcesso', new Date().toLocaleString());

      res.send('Login bem-sucedido!');
    } else {
      res.status(401).send('Credenciais inválidas!');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro no servidor');
  }
});

app.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const user = new User({ nome, email, senha });
    await user.save();

    res.send('Cadastro realizado com sucesso!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro no servidor');
  }
});

app.get('/registros', (req, res) => {
  if (req.session.user) {
    res.send('Registros do usuário logado');
  } else {
    res.status(401).send('Usuário não autenticado!');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
  
    try {
      const user = await User.findOne({ email, senha }).exec();
  
      if (user) {
        req.session.user = user; 
  
        res.cookie('nomeUsuario', user.nome);
        res.cookie('ultimoAcesso', new Date().toLocaleString());
  
        res.send('Login bem-sucedido!');
      } else {
        res.status(401).send('Credenciais inválidas!');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro no servidor');
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    const nomeUsuario = getCookie('nomeUsuario');
    const ultimoAcesso = getCookie('ultimoAcesso');
  
    if (nomeUsuario && ultimoAcesso) {
      document.getElementById('nome-usuario').innerText = nomeUsuario;
      document.getElementById('ultimo-acesso').innerText = ultimoAcesso;
    }
  });
    