const {Schema, model, models} = require('mongoose')

const ChatSchema = new Schema({
    chatName: {
        type: String,
        trim: true
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    latestMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }
}, {timestamps: true})

const Chat = models.Chat || model('Chat', ChatSchema);

module.exports = Chat