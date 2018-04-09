const grpc = require('grpc');
const fs = require('fs');

const PROTO_PATH = __dirname + '/../proto/demo/hello.proto';
const HelloProto = grpc.load(PROTO_PATH).hello;

const client = new HelloProto.Greeter('localhost:9001', grpc.credentials.createSsl(
    fs.readFileSync('./keys/ca.crt'),  
    fs.readFileSync('./keys/client.key'),
    fs.readFileSync('./keys/client.crt'),
));

client.sayHello({ name: 'World'}, function(err, response) {
    console.log(err);
    console.log('Greeting res:', response.message);
});