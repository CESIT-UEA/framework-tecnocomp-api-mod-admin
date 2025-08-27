async function validarToken(idToken) {
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
  const data = await response.json();
  return data;
}

module.exports = { validarToken }