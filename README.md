# Cuarto Integrador API E-commerce

## Instalación

Clona este repositorio:

   ```bash
   git clone https://github.com/nicob201/practica_integradora_4.git
   ```
## Configuración

Crea el archivo `.env.development` para configurar la base de datos segun el entorno que se desee utilizar, ten en cuenta las siguientes variables de entorno:

   ```bash
   MONGO_URL=
   PORT=
   CLIENT_ID=
   CLIENT_SECRET=
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   MAILING_EMAIL=
   MAILING_PASSWORD=
   TEST_MODE=  
   ```

## Ejecución de la API

Instala las librerias y dependencias necesarias del proyecto:

   ```bash
   npm install
   ```

Corre el siguiente comando en la terminal, luego de instalar las dependencias necesarias de la API:

   ```bash
   npm start
   ```

## Rutas relevantes de la entrega:

POST a la siguiente URL pasando por body como "form-data" al menos 3 documentos para poder pasar el rol del usuario de "user" a "premium"

   ```bash
   http://localhost:8080/api/users/:uid/documents
   ```

En caso de no pasar los 3 documentos, no se podrá cambiar el rol del usuario y se mostrará una respuesta de error.

Los documentos subidos se almacenan en la carpeta "src/documents/"

## Para corroborar los cambios, hacer un GET a la siguiente URL:

   ```bash
   http://localhost:8080/api/users
   ```