const http = require('node:http');
const server = require('./server');

let finished = false;
function finish(error) {
  if (finished) return;
  finished = true;
  if (error) console.error('❌ TEST FALLIDO:', error.message);
  else console.log('✅ TEST SUPERADO: El servidor responde con código 200 OK y JSON válido.');
  server.close(() => { process.exitCode = error ? 1 : 0; });
}

server.on('error', finish);
// Puerto libre asignado por el sistema, para no interferir con otros procesos.
server.listen(0, '127.0.0.1', () => {
  const port = server.address().port;
  const request = http.get(`http://127.0.0.1:${port}/`, (response) => {
    let body = '';
    response.setEncoding('utf8');
    response.on('data', (chunk) => { body += chunk; });
    response.on('end', () => {
      try {
        if (response.statusCode !== 200) throw new Error(`Código HTTP ${response.statusCode}`);
        const data = JSON.parse(body);
        if (data.estado !== 'OK' || !data.mensaje || !data.timestamp) {
          throw new Error('Faltan datos en la respuesta JSON');
        }
        finish();
      } catch (error) { finish(error); }
    });
    response.on('error', finish);
  });
  request.setTimeout(5000, () => request.destroy(new Error('Tiempo de espera agotado')));
  request.on('error', finish);
});
