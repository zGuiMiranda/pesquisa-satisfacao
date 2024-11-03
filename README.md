# Pesquisa-satisfacao

NodeJS, Typescript, Fastify, Jest, Docker, Swagger and PostgresSQL.

<hr/>
<b><h2>Prerequisites:</h2></b> 
Node.js v20+

<b><h2>Docker commands:</h2></b> 

create containers: pnpm container-up-all <b>OR</b> npm run container-up-all <b>OR</b> yarn container-up-all <br/>

drop containers: pnpm container-down-all <b>OR</b> npm run container-down-all <b>OR</b> yarn container-down-all

<hr>
<b><h2>Steps:</h2></b> 
npm install <br/>
npm run container-up-all (or any of the above docker commands) <br/>
npm run dev (if you do not want to use a image of the API, however, the database image will still be necessary: npm run container-dev-up)

<hr>

<b><h2>Tests steps:</h2></b> 
npm install <br/>
npm run container-test-up <br/>
npm run test


<b><h2>Swagger for documentation of endpoints:</h2></b> 
 localhost:9000/documentation
