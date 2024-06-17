# Ask my TikTok Data

## How to execute

From the root of project:
```
npm run start
```

## How to start backend alone

Build:
```
npm run build:backend
```

Check the extensions in "form-ask-chatgpt/backend/dist/controllers/".

Start:
```
npm run start:backend
```

## Use cases

### Ask a question about my videos
Como usuario 
quiero hacer una pregunta a mis datos de tiktok
para obtener una respuesta general de todos los videos

### Ask a question about my videos and receive information
tbd

## Tech documentation

El frontend te permite:
- hacer una pregunta teniendo en cuenta mis videos.
    - un video concreto (seleccionandolo en el front).
    - una serie de los ultimos videos disponibles.
    

### Todo tasks

**P1**
- [] De todos los ficheros de preguntas existentes, pasarlos a openAI para sacar un resumen general a modo de contestar
    la pregunta realizada con una sola respuesta general sobre TODO mi contenido.
- [X] El fichero ZIP subirlo a S3 y crear un enlace para el USUARIO que lo solicito.
- [X] El enlace se envia al email del usuario.
- [] Mostrar la cantidad total de videos disponibles para recoleccion de data.
- [] Recoger data segun X cantidad de videos (5 ultimos, 10, 20, 50)
- [] Sacar un listado de las preguntas que se han realizado y procesado con anterioridad para ver respuestas ya construidas.
- [] hacer una espera hasta que procese todas las llamadas, o al menos que salga el N de X videos.
- [] - si hago una consulta/pregunta, ha de mirar antes en S3 si puede haber alguna pregunta parecida:
    - [] crear un archivo historico general que contenga todas las preguntas realizadas
    - [] antes de preguntar a chatgpt, revisar este archivo, recoger todas las preguntas y consultar a chatgpt si la pregunta puede hacer match con una de las 
            preguntas realizadas con anterioridad, en ese caso devolver los archivos relacionados.


**P2**
- [-] Cuando realizo una pregunta, informar de lo que puede tardar y poder hacer otras preguntas.
- [-] FE: Especificar cuando se subieron los ultimos ficheros.

**P3**
- [-] Capacidad para hacer N preguntas seguidas.
- [-] Mostrar todos los videos de mi tiktok y seleccionar video concreto para hacer pregunta.

**done**
- [x] recorre todos los archivos JSON del S3, responde y crea un archivo de respuesta por cada video.
- [x] cada archivo lo sube als3 cuando termina de devolver la respuesta de openAI.
- [x] la subida al S3 controla que no hayan archivos duplicados.
- [x] en el S3 en la carpeta dataGenerated/ hay una carpeta por videoId, tal y como esta en local. se hace una subida cuando se acaba de hacer la pregunta en openAI.
- [x] se genera un archivo ZIP al final de la ejecucion
