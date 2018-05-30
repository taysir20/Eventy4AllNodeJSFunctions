

/*
Inicializamos las constantes functions y admin con las dependencias que se encuentran en package.json que se ha creado
al conectar el proyecto de NodeJS con Firebase.
Ambas son necesarias para realizar las functions de firebase para realizar el push que además requiere previamente de tener
instanciada una variable de 'firebase-admin'
*/
const functions = require('firebase-functions');
const admin = require('firebase-admin');

/*
Mediante el initializeApp nos conectamos a la bbdd de firebase especificada desde el package.json
*/
admin.initializeApp(functions.config().firebase);
/*
Mediante el método exports lo que hacemos es enviar estan función que hemos creado nosotros llamada sendNewPush al sistema
de functions de firebase.
Por lo tanto, cuando hemos exportado este método de tipo http request para hacer las peticiones a firebase este archivo ya no sería
necesario dado que esta en firebase pero es recomendable guardarlo.
*/
/*
    En esta función que enviamos a firebase llamamos a la constante functions que controla las functions de firebase y que
    está instanciada con el require anterior y le dice que todo lo que llegue a este método será mediante método https es decir 
    por cabecera y recibiremos una petición y una respuesta
*/
exports.sendNewPush= functions.https.onRequest((request,response) => {
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
    //variable que representa el token que corresponde al dispositivo al que va dirigida la notificación.
    /*
    Como ejemplo vamos a poner a mano directamente el token de un dispositivo pero en la práctica real habría que coger
    un array con todos los tokens que tenemos que tener almacenamos en firebase previamente.
    */
    /*
        La constante payload es aquella que se usa para cargar la notificación en si, no es más que un json que se envía 
        a firebase con el contenido que queremos enviar.
        Podemos ponerle como nombre de objeto data o notification dependiendo de lo que queramos hacer. Hay que recordar que
        por ejemplo que en Android no se puede manejar las notificaciones en segundo plano sino que las maneja directamente
        el gestor de notificaciones de android, en cambio si enviamos el objeto de tipo dara entonces si podremos manejar
        los datos en segundo plano.
        NOTA: El badge es el identificador de cada notificación para poder diferenciarlas una de otra, de nuevo a mano vamos 
        a ponerle un valor pero lo suyo sería hacer un contador.
    */
   console.log(request.body);
   console.log("resultado: " + request.body[0].nickName);
  
   

    for(i=0; i<request.body.length; i++){
       
        var registrationToken = request.body[i].token;
        let payload = {
            "data":{
                "title": request.body[i].nickName + " te ha invitado a que te unas a su evento",
                "image": "",
                "message":"¡Hola " + request.body[i].addressee + "!, ¡quiero que te unas a mi evento!",
                "sound": "default",
                "badge":request.body[i].badge
            }
    
        };
    /*
    mediante los métodos messaging() y sendToDevice() enviamos al dispositivo que hemos indicado en el token, el json que contiene
    la notificación.Then/Catch--> quiere decir exactamente: una vez enviada la notificación al dispositivo en concreto entonces, 
    este dispositivo devuelve una respuesta(response2) a la consola de firebase de las functions(concretamente en el apartado registros).
    Si hay un error pasa por el catch y entonces enviamos que ha habido un error.
    */
    /*
    NOTA: hay que diferenciar entre el parámetro response del sendNewPush que es la respuesta que nos devuelve firebase y response2
    es la respuesta del dispositivo al momento de llegarle la notificación
    */
    /*
    Por consola de la web imprimimos el consoleLog de la respuesta y esta respuesta también la enviamos a la consola de firebase mediante
    el parámetro response que es el de firebase y que pide como parámetros el número de error o de solicitud satisfactoria que el código
    que queramos especificar, el mensaje y el token al que se lo enviamos.
    */
        admin.messaging().sendToDevice(registrationToken,payload).then(function(response2){
            console.log("Mensaje enviado correctamente: ", JSON.stringify(response2)) // JSON.stringify es para parsear la respuesta a un json para posteriormente hacerle un console.log
            response.send(200,"Mensaje enviado correctamente a FIREBASE: " + registrationToken);
            return 
        }).catch(function(error){
            console.log("Error al enviar el mensaje", error) // JSON.stringify es para parsear la respuesta a un json para posteriormente hacerle un console.log
            response.send(404,"Error al enviar el mensaje a FIREBASE: " + registrationToken);
        });
    

    }
  

});