import mongoose from 'mongoose';


const ConnecttoMongo = async() => {
    const CONNECTION_URL = process.env.mongoURI;
        await mongoose.connect(CONNECTION_URL, {
            useNewURLParser: true,
            useUnifiedTopology: true
        }).then(()=>{
            console.log("Your app is connected to database Successfully !!")
        }).catch((err)=>{
            console.log(err.message);
        })
}

export default ConnecttoMongo;
