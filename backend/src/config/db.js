import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connecté: ${conn.connection.host}`);
        console.log(`📊 Base de données: ${conn.connection.name}`);
    } catch (error) {
        console.error(`❌ Erreur de connexion MongoDB : ${error.message}`);
        process.exit(1);
    }
};

// Gestion des événements de connexion
mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB déconnecté');
});

mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnecté');
});

export default connectDB;