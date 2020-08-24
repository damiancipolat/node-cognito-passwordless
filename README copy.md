<img src="https://nodejs.org/static/images/logos/nodejs-new-pantone-black.svg" width="250px" align="right" />

# Node.js Microservice - template

### **Stack**:
- Node.js v12
- swagger-ui-express.
- Docker.
- Test: mocha / chai / sinon / proxyquire / nyc.
- config: Para manejar diferentes archivos de configuración por cada entorno.
- express.js
- pino: Para logear en forma de json al stdout.
- node-fetch: Para realizar request.

### **Configuración**:
Dentro del directorio /config se encuentran los archivos json de cada entorno, por defecto se usa "default.json".

```console
{
  "server":{
    "port":8080,
    "killTimeout":100
  }
}
```
### **Instalación**:

- Ejecutar test:
```console
fintech@api:~$ npm install
```

### **Comandos**:

- Ejecutar test:
```console
fintech@api:~$ npm test
```
- Ejecutar revisión de cobertura de codigo:
```console
fintech@api:~$ npm run coverage
```
- Ejecutar servidor:
```console
fintech@api:~$ npm start
```

- Crear imagén de docker:
```console
fintech@api:~$ npm run build
```

- Ejecutar contenedor de la ultima imagén subida:
```console
fintech@api:~$ npm run docker
```

### **API REST**
Para observar la documentacion del api rest, el proyecto cuenta con un modulo de swagger, puede accederlo desde:
http://127.0.0.1:8080/doc/

### **Decisiones de arquitectura**
El api fue dividida en tres capas:
- Lib: Para codigo compartido o integraciones.
- Server: Contiene el codigo para ejecutar un servidor rest.
- Services: Resuelve logica de negocio.

Se opto por dividir la comunicación atravez de red de la logica de negocio por este motivo /services y /server estan al mismo nivel, este diseño esta pensado para en un escenario productivo poder cambiar la forma en que se comunica un microservicio sin tener que realizar mayores cambios.

**Middlewares**:
- Swagger: Genera un sandbox de prueba del api.
- Error Handler: Este fue desarrollado para resolver en un unico punto todos las excepciones recibidas, para logearlas y retornar la respuesta. /src/server/middleware.js

### **Versionado**:
Utilizo el campo "version" del archivo package.json del proyecto para registrar los cambios de versiones en el proyecto, este campo es el unico lugar en donde se registra la versión en todo el proyecto.

**Docker**: Al momento de buildear la imagén de docker, se puede observar en el archivo package.json
```console
"build": ". ./tag.sh && docker build . -t $PACKAGE_TAG"
```
Que se ejecuta un script tag.sh este script extrae del archivo package.json la version para poder ser usada para **taggear** imagenes.

### Unit test:
- Ejecutar test:
```console
fintech@api:~$ npm test
```


### CI/CD
- Ejecutar test:
```console
fintech@api:~$ npm test
```
