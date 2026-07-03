import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';

// Configuration de l'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Pour parser le JSON
app.use(express.urlencoded({ extended: true }));

// Route de base de l'API
app.get('/api', (req, res) => {
    res.send('API MukopoApp en marche...');
});

// Importation des routes
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import expenseRoutes from './src/routes/expenseRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server est en cours d'exécution sur le port ${PORT}`);
});
