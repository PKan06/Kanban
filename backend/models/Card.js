import mongoose from 'mongoose';

const CardSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    labels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lables',
    }],
    task:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tasks'
    }],
    desc:{
        type: String
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

const Card = mongoose.model('Cards', CardSchema);

export default Card