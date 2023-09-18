import mongoose from 'mongoose';

const CardSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    labels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lables'
    }],
    task:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tasks'
    }],
    desc:{
        type: String
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

CardSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

CardSchema.set('toJSON', {
    virtuals: true,
});

const Card = mongoose.model('Cards', CardSchema);

export default Card