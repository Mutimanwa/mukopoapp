const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Accès refusé - Rôle "${req.user.role}" non autorisé. Rôles requis: ${roles.join(', ')}`
            });
        }

        next();
    };
};

export { authorize };