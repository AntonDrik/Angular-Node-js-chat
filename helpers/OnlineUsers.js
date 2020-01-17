const mongoose          = require('mongoose');
const User              = require('./models/user');

class OnlineUsers {
    constructor() {
        this.users = [];
    }
    checkUser(userID) {
        return this.users.indexOf(userID.toString()) !== -1;
    }
    update(io) {
        const onlineUsers = this.users.map(userID => new mongoose.Types.ObjectId(userID));
            User.find({_id: { $in: onlineUsers}}).select('nick -_id').then(users => {
                const data = users.map(user => user.nick);
                io.emit('updateUsers', data);
            }).catch(err => {
                io.emit('updateUsers', 'Ошибка обновления');
            });

    }
    add(userID) {
        this.users.push(userID);
    }
    remove(userID, io) {
        const delIndex = this.users.indexOf(userID);
        this.users.splice(delIndex, 1);
        this.update(io);
    }
}

const onlineUsers = new OnlineUsers();

module.exports = onlineUsers;

