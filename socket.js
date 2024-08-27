const {Server} = require('socket.io');
const {verifyToken} = require('./utils/helpers');
const UserRepository = require('./modules/auth/repositories/UserRepository');
const LocationService = require('./services/LocationService');

const socketAuth = async function socketAuth(socket, next){
    const token = socket.handshake.auth.token;
    const user = await verifyToken(token);
    if(token && user) {
        socket.handshake.auth.user = user;
        return next();
    }
    return next(new Error('User was not authenticated'));
};

const socketConnection = async function socketConnection(socket){
    console.log('a user connected');
    const userObject = socket.handshake.auth.user;

    await setUserLoginState(userObject.id, true);
    socket.on('disconnect', async function (){
        console.log('disconnect user');
        await setUserLoginState(userObject.id, false);
        return;
    });

    socket.on('location', async function(data) {
        await setUserLocation(userObject.id, data);
        socket.broadcast.emit('track_location_'+userObject.id, data);
    });

};

exports.startIo = function startIo(server){
    const io = new Server(server);

    io.use(socketAuth);
    io.on('connection', socketConnection);
    
    return io;
};

const setUserLoginState = async function(user_id, state) {
    await UserRepository.updateUser({
        "isOnline": state
    }, user_id);
    return;
}

const setUserLocation = async function(user_id, data) {
    await LocationService.storeLocation(user_id, data);
    const location = await LocationService.getLocation(user_id);
    console.log(location);
    return;
}