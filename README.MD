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
[] De todos los ficheros de preguntas existentes, pasarlos a openAI para sacar un resumen general a modo de contestar
    la pregunta realizada con una sola respuesta general sobre TODO mi contenido.
[] Mostrar la cantidad total de videos disponibles para recoleccion de data.
[] Recoger data segun X cantidad de videos (5 ultimos, 10, 20, 50)
[] Sacar un listado de las preguntas que se han realizado y procesado con anterioridad para ver respuestas ya construidas.

**P2**
[] Cuando realizo una pregunta, informar de lo que puede tardar y poder hacer otras preguntas.
[] FE: Especificar cuando se subieron los ultimos ficheros.

**P3**
[] Capacidad para hacer N preguntas seguidas.
[] Mostrar todos los videos de mi tiktok y seleccionar video concreto para hacer pregunta.

**done**
[] archivos subidos a S3 por videoID en carpeta /generatedData
[] historico de preguntas subido
[] datos de video subido