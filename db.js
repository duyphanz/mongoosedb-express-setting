var mongoose = require('mongoose')
require('./locations')
var GracefullShutdown;
//var dbURI = 'mongodb://localhost/Loc8r';
var dbURI = process.env.MONGOLAB_URL;
mongoose.connect(dbURI);

//Connection response
mongoose.connection.on('connected', function () {
    console.log(`Mongoose connected to ${dbURI}`)
});

mongoose.connection.on('error', function () {
    console.log(`Mongoose connection error ${dbURI}`)
});

mongoose.connection.on('disconnected', function () {
    console.log(`Mongoose disconnected.`)
});

//GracefullShutDown connection

GracefullShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log(`Disconnect to mongodb: ${msg}`)
        callback();
    });
}
process.once('SIGUSR2', () => {
    GracefullShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});

process.on('SIGINT', () => {
    GracefullShutdown('app termination', () => {
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    GracefullShutdown('Heroku app shutdown', () => {
        process.exit(0);
    });
});