const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // Use uma chave secreta segura

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log(error)
    return res.status(401).json({ error: 'Token inválido' });
  }
};
