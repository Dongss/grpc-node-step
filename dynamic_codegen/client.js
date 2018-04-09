const grpc = require('grpc');

const PROTO_PATH = __dirname + '/../proto/demo/hello.proto';
const HelloProto = grpc.load(PROTO_PATH).hello;

const client = new HelloProto.Greeter('localhost:9001', grpc.credentials.createInsecure());

client.sayHello({ name: 'World'}, function(err, response) {
    console.log('Greeting res:', response.message);
});