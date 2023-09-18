import mongoose from 'mongoose';

const LableSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    Color: {
        type: String,
        required: true
    }
})

LableSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

LableSchema.set('toJSON', {
    virtuals: true,
});


const Labels = mongoose.model('Lables', LableSchema);
export default Labels