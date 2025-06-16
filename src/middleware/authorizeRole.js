module.exports = function authorizeRole(rolesPermitidas) {
  return (req, res, next) => {
    if (!rolesPermitidas.includes(req.userRole)) {
      return res.status(403).json({ mensagem: 'Acesso negado: permissão insuficiente' });
    }
    next();
  };
};
