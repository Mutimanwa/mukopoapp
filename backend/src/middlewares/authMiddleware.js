import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Non autorisé - Token manquant' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Non autorisé - Utilisateur non trouvé' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Error:', error.message);
        return res.status(401).json({ message: 'Non autorisé - Token invalide ou expiré' });
    }
};

export { protect };