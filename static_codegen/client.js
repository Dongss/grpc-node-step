const grpc = require('grpc');

const HelloMessage = require('./proto_js/demo/hello_pb');
const HelloService = require('./proto_js/demo/hello_grpc_pb');

const client = new HelloService.GreeterClient('localhost:9001', grpc.credentials.createInsecure());

let request = new HelloMessage.HelloRequest();
request.setName('World');

client.sayHello(request, function(err, response) {
    console.log('Greeting res:', response.getMessage());
});