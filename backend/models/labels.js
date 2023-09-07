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

const Lables = mongoose.model('lables', LableSchema);
export default Lables