import mongoose from 'mongoose';

const BoardSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    Cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cards',
    }]
})

BoardSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

BoardSchema.set('toJSON', {
    virtuals: true,
});
const Board = mongoose.model('Board', BoardSchema);

export default Board;