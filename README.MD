# Ask my TikTok Data

## Description

Hey! It's a pleasure to have you here, welcome.

If you don’t know, I have a TikTok account where I share my knowledge from over 10 years of experience in technology (specifically software web development) as a QA. I talk about tips, self-improvement, finding better companies, project situations, and much more. If you want to take a look, here’s the link: https://www.tiktok.com/@aqualityguy.

One day, I decided to gather all that data (more than 300 videos, 90k likes, and 10k comments) and use it to create questions.

That’s the reason why this project started.

The objective is to create a webpage where you can ask whatever you want, review the data, use the OpenAI API to ask questions, and get answers.

**RIGHT NOW APPLICATION IS UNDER CONSTRUCTION**

## Tech stack summary 
Application is made from a backend and frontend sides with different technology, mainly Express for the back and React for the front.
Application is made and built in Typescript.
Applitacion uses AWS S3 to keep and use the data files for the users.
Application uses OpenAI to make questions about the data.

## Tech stack an versions
Backend
- Express 4.15
- cors 2.8.5
- axios 1.7.2
- openai 4.50
- nodemailer 6.9.13
- aws-sdk 2.1638
- archiver 7.0.1
- node-cache 5.1.2

Frontend
- react 18.3.1

Testing

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
