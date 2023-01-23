const keys = require('./keys');
const redis = require('redis')

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPotr,
    retry_strategy: () => 1000
});

redisClient.on("error", function (err) {
    console.log("Error in worker " + err);
});

const subscription = redisClient.duplicate();

function fib(index) {
    if (index < 2)
        return index;
    return fib(index - 1) + fib(index - 2);
}

subscription.on('message', (channel, message) => {
    console.log('Revieved ' +  message);
    redisClient.hset('values', message, fib(parseInt(message)));
});
subscription.subscribe('insert');