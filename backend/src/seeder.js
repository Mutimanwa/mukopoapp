import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import users from './data/users.js';
import User from './models/User.js';
import connectDB from './config/db.js';

// Obtenir le chemin du répertoire actuel (ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurer dotenv pour trouver le fichier .env à la racine du backend
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connexion à la base de données
connectDB();

const importData = async () => {
    try {
        // Nettoyer la collection avant d'importer
        await User.deleteMany();
        console.log('🗑️ Collection users vidée...');

        // insertMany va déclencher le hook pre('save') pour chaque utilisateur
        const createdUsers = await User.insertMany(users);
        
        console.log(`✅ ${createdUsers.length} utilisateurs importés avec succès !`);
        console.log('📋 Liste des utilisateurs créés:');
        createdUsers.forEach(user => {
            console.log(`   - ${user.name} (${user.email}) [${user.role}]`);
        });
        
        process.exit();
    } catch (error) {
        console.error(`❌ Erreur lors de l'importation: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        console.log('🗑️ Toutes les données utilisateurs ont été supprimées !');
        process.exit();
    } catch (error) {
        console.error(`❌ Erreur lors de la destruction: ${error.message}`);
        process.exit(1);
    }
};

// Logique pour exécuter l'import ou la destruction via la ligne de commande
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}