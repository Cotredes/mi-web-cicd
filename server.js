const http = require('node:http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({
    estado: 'OK',
    mensaje: '¡Servidor web desplegado con éxito en el contenedor!',
    modulo: 'DAW - Módulo 0614',
    timestamp: new Date().toISOString()
  }));
});

// Al importarlo desde test.js no se ocupa el puerto 3000.
if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  server.listen(port, '0.0.0.0', () => {
    console.log(`Servidor activo en http://localhost:${port}`);
  });
}

module.exports = server;
