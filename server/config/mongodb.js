import mongoose from 'mongoose';

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected')
    })

    if (!process.env.MONGODB_URL) {
        throw new Error('MONGODB_URL is not set')
    }

    await mongoose.connect(process.env.MONGODB_URL)
}

export default connectDB