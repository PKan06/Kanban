import mongoose from 'mongoose';

const TaskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: "Task-1"
    },
    completed:{
        type: Boolean,
        default: false
    }
})

TaskSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

TaskSchema.set('toJSON', {
    virtuals: true,
});


const Task = mongoose.model('Tasks', TaskSchema);
export default Task