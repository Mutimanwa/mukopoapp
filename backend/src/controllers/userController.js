import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import Expense from '../models/Expense.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin or Manager
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile/details
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            // Récupérer les statistiques des dépenses de l'utilisateur
            const expenseCount = await Expense.countDocuments({ userId: user._id });
            const expenseTotal = await Expense.aggregate([
                { $match: { userId: user._id } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);

            res.json({
                ...user.toObject(),
                stats: {
                    totalExpenses: expenseCount,
                    totalAmount: expenseTotal.length > 0 ? expenseTotal[0].total : 0
                }
            });
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const oldData = {
            name: user.name,
            email: user.email,
            role: user.role,
            team: user.team
        };

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.team = req.body.team || user.team;

        const updatedUser = await user.save();

        // Log de modification
        await AuditLog.create({
            action: 'UPDATE_USER',
            userId: req.user._id,
            details: `Modification de l'utilisateur ${user.email}. Ancien: ${JSON.stringify(oldData)}`
        });

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            team: updatedUser.team,
            message: 'Utilisateur mis à jour avec succès'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Empêcher la suppression de son propre compte
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(403).json({ message: 'Impossible de supprimer son propre compte' });
        }

        // Supprimer toutes les dépenses de l'utilisateur
        await Expense.deleteMany({ userId: user._id });

        await User.deleteOne({ _id: user._id });

        // Log de suppression
        await AuditLog.create({
            action: 'DELETE_USER',
            userId: req.user._id,
            details: `Suppression de l'utilisateur ${user.email} et de ses ${await Expense.countDocuments({ userId: user._id })} dépenses`
        });

        res.json({ message: 'Utilisateur et ses dépenses supprimés avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getUsers, getUserById, updateUser, deleteUser };