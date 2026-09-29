# Práctica UT01 · Node.js, GitHub Actions y Docker

Este proyecto responde JSON por HTTP, ejecuta una prueba automática y construye una imagen Docker después de que la prueba termine correctamente. El PDF de evaluación se crea con capturas reales de tu propia ejecución.

## Archivos incluidos

| Archivo | Para qué sirve |
| --- | --- |
| `server.js` | API HTTP en el puerto 3000. |
| `test.js` | Comprueba HTTP 200 y el contenido JSON; falla con código de salida distinto de cero. |
| `package.json`, `package-lock.json` | Comandos `npm start`, `npm test` e instalación reproducible. |
| `.github/workflows/deploy.yml` | Dos trabajos: `pruebas` y, solo si pasan, `construir_docker`. |
| `Dockerfile`, `.dockerignore` | Imagen Alpine y exclusión de archivos innecesarios. |
| `.gitignore` | Excluye dependencias y tus capturas privadas. |
| `plantilla-entrega.html` | Monta el PDF de evaluación con tu enlace y tus tres capturas. |

El ejemplo de la ficha arranca el servidor al importarlo y vuelve a llamar `listen()` durante el test. Aquí el servidor solo escucha automáticamente al ejecutar `node server.js`, por lo que `npm test` puede usarlo sin conflicto. Se usa Node 24 porque cumple el requisito «18 o superior» y Node 18 ya no tiene soporte.

## Paso 1 · Preparación

Instala Git, Node.js 18 o superior (se recomienda 24) y Docker Desktop o Docker Engine. Abre Docker Desktop si tu sistema lo necesita. Ten una cuenta de GitHub. Extrae `mi-web-cicd.zip` y abre una terminal **dentro de la carpeta `mi-web-cicd`**. En Windows puedes usar Git Bash o la terminal de VS Code. Si ya tienes un repositorio llamado `mi-web-cicd`, crea otro nombre y cambia la URL de los comandos de abajo.

Comprueba las herramientas:

```bash
git --version
node --version
npm --version
docker --version
docker info
```

Si `docker info` no conecta, inicia Docker Desktop o el servicio Docker antes de continuar.

## Paso 2 · Prueba local

```bash
npm ci
npm test
```

Debe aparecer `TEST SUPERADO`. Para ver la API sin Docker, en otra terminal puedes ejecutar `npm start`, abrir <http://localhost:3000> y detenerla con Ctrl+C. El `timestamp` cambiará en cada respuesta.

## Paso 3 · Publicar en GitHub

En [github.com/new](https://github.com/new), crea un repositorio **Public** llamado `mi-web-cicd`. Deja sin marcar la creación automática de README, `.gitignore` y licencia. Luego, en la terminal de la carpeta extraída:

```bash
git init
git add .
git commit -m "feat: servidor, pruebas y construccion Docker"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mi-web-cicd.git
git push -u origin main
```

Sustituye `TU_USUARIO` por tu usuario real. GitHub puede pedir inicio de sesión; sigue su procedimiento de autenticación, no pongas tu contraseña de GitHub en el comando. El enlace que irá en el PDF es `https://github.com/TU_USUARIO/mi-web-cicd`. Comprueba que se ven el `Dockerfile` y la carpeta `.github/workflows` en el repositorio público.

## Paso 4 · Comprobar GitHub Actions

Abre el repositorio en el navegador y entra en **Actions**. Selecciona la ejecución del commit y espera a que aparezcan en verde **Ejecutar Tests Unitarios** (`pruebas`) y **Construccion de Imagen Docker** (`construir_docker`). Abre el primer trabajo y verifica `TEST SUPERADO` en el paso **Lanzar pruebas unitarias**. Haz una captura de la vista que muestre los dos trabajos verdes y guárdala como `actions.png` fuera del repositorio o en una carpeta `capturas`.

Si un trabajo falla, abre el paso rojo para leer el error. Tras corregirlo, haz `git add .`, `git commit -m "fix: corregir fallo"` y `git push`; la nueva ejecución se disparará sola. El workflow **construye** la imagen en GitHub, pero no la publica en un registro de contenedores; la ejecución Docker de los siguientes pasos se hace en tu ordenador.

## Paso 5 · Construir y ejecutar Docker en tu ordenador

Desde la carpeta `mi-web-cicd`, con Docker iniciado:

```bash
docker build -t mi-web-node:v1 .
docker images
docker run -d --name app-produccion -p 8080:3000 mi-web-node:v1
docker ps
```

La fila de `docker ps` debe mostrar `app-produccion`, estado `Up` y el mapeo `8080->3000/tcp` (el formato exacto puede variar). Haz la segunda captura de la terminal con `docker ps` visible y guárdala como `docker-ps.png`.

Si el nombre ya está ocupado por un contenedor anterior, ejecuta `docker rm -f app-produccion` y repite `docker run`. Si el puerto 8080 está ocupado, libera ese puerto antes de repetir para que coincida con la URL exigida.

## Paso 6 · Ver el JSON y hacer la tercera captura

Abre **<http://localhost:8080>** en el navegador. Deben verse `estado: "OK"`, `mensaje`, `modulo` y `timestamp`. La barra de dirección con `localhost:8080` debe aparecer en la captura. Guárdala como `navegador.png`. Como comprobación opcional:

```bash
curl -i http://localhost:8080
```

Si la página no carga, revisa `docker ps` y `docker logs app-produccion`. Comprueba que Docker sigue abierto y que ejecutaste exactamente `-p 8080:3000`.

## Paso 7 · Crear el PDF y entregar

Abre `plantilla-entrega.html` en tu navegador. Rellena el enlace público completo del repositorio, selecciona tus tres capturas y pulsa **Preparar vista previa**. Comprueba que se ven las tres imágenes correctas. Pulsa **Imprimir o guardar PDF** y elige **Guardar como PDF** en el diálogo del navegador. Guarda el archivo como `entrega-final.pdf` y ábrelo para verificar las páginas. **Entrega únicamente ese PDF** si así lo pide el profesor; el ZIP te sirve para construir y publicar el proyecto.

Puedes colocar las capturas en `capturas/`, que Git no subirá. Conserva el contenedor activo hasta hacer la captura del navegador y `docker ps`. Cuando hayas terminado:

```bash
docker stop app-produccion
docker rm app-produccion
```

## Comprobación antes de entregar

- El enlace del PDF abre un repositorio público con el código y `deploy.yml`.
- La captura de Actions muestra ambos trabajos en verde en la misma ejecución.
- La captura de `docker ps` muestra `app-produccion` activo.
- La captura del navegador muestra `http://localhost:8080` y el JSON.
- El PDF final abre correctamente y contiene todas las capturas legibles.
