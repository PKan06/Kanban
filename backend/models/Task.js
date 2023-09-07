import mongoose from 'mongoose';

const LableSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: "Task-1"
    }
})

const Task = mongoose.model('tasks', LableSchema);
export default Task