import Expense from '../models/Expense.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
    try {
        const { amount, currency, category, date, receiptUrl, description, project } = req.body;

        // Validations
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Le montant doit être positif' });
        }
        if (!category) {
            return res.status(400).json({ message: 'La catégorie est requise' });
        }
        if (!date) {
            return res.status(400).json({ message: 'La date est requise' });
        }

        const expense = new Expense({
            userId: req.user._id,
            amount,
            currency: currency || 'EUR',
            category,
            date,
            receiptUrl,
            description,
            project
        });

        const createdExpense = await expense.save();

        // Log de création
        await AuditLog.create({
            action: 'CREATE_EXPENSE',
            userId: req.user._id,
            details: `Création de la dépense ${createdExpense._id} de ${amount}€`
        });

        res.status(201).json({
            ...createdExpense.toObject(),
            message: 'Dépense créée avec succès'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user expenses
// @route   GET /api/expenses/myexpenses
// @access  Private
const getMyExpenses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const expenses = await Expense.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Expense.countDocuments({ userId: req.user._id });

        res.json({
            expenses,
            page,
            totalPages: Math.ceil(total / limit),
            total,
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private/Admin/Finance/Manager
const getExpenses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const status = req.query.status;
        const category = req.query.category;

        // Construction du filtre
        let filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;

        const expenses = await Expense.find(filter)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Expense.countDocuments(filter);

        res.json({
            expenses,
            page,
            totalPages: Math.ceil(total / limit),
            total,
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update expense status
// @route   PUT /api/expenses/:id/status
// @access  Private
const updateExpenseStatus = async (req, res) => {
    try {
        const { status, comment } = req.body;
        
        if (!status) {
            return res.status(400).json({ message: 'Le statut est requis' });
        }

        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Dépense non trouvée' });
        }

        // Ne pas permettre de modifier une dépense déjà payée
        if (expense.status === 'Payé') {
            return res.status(403).json({ message: 'Impossible de modifier une dépense déjà payée' });
        }

        const oldStatus = expense.status;
        expense.status = status;
        expense.history.push({
            updatedBy: req.user._id,
            status,
            comment: comment || `Statut changé de ${oldStatus} à ${status}`
        });

        const updatedExpense = await expense.save();

        // Log du changement de statut
        await AuditLog.create({
            action: 'UPDATE_STATUS',
            userId: req.user._id,
            details: `Changement de statut de ${oldStatus} à ${status} pour la dépense ${expense._id}`
        });

        res.json({
            ...updatedExpense.toObject(),
            message: 'Statut mis à jour avec succès'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update expense fields (by owner while pending)
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
    try {
        const { amount, currency, category, date, description, project } = req.body;
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Dépense non trouvée' });
        }

        // Vérification de propriété
        if (expense.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Non autorisé' });
        }

        // Vérification que la dépense est en attente
        if (expense.status !== 'En attente') {
            return res.status(403).json({ 
                message: 'Impossible de modifier une dépense déjà traitée' 
            });
        }

        // Mise à jour conditionnelle
        if (amount) {
            if (amount <= 0) {
                return res.status(400).json({ message: 'Le montant doit être positif' });
            }
            expense.amount = amount;
        }
        if (currency) expense.currency = currency;
        if (category) expense.category = category;
        if (date) expense.date = date;
        if (description) expense.description = description;
        if (project) expense.project = project;

        const updated = await expense.save();

        // Log de modification
        await AuditLog.create({
            action: 'UPDATE_EXPENSE',
            userId: req.user._id,
            details: `Modification de la dépense ${expense._id}`
        });

        res.json({
            ...updated.toObject(),
            message: 'Dépense modifiée avec succès'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an expense (by owner)
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        
        if (!expense) {
            return res.status(404).json({ message: 'Dépense non trouvée' });
        }

        if (expense.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Non autorisé' });
        }

        // Seulement si en attente
        if (expense.status !== 'En attente') {
            return res.status(403).json({ 
                message: 'Impossible de supprimer une dépense déjà traitée' 
            });
        }

        await expense.deleteOne();

        // Log de suppression
        await AuditLog.create({
            action: 'DELETE_EXPENSE',
            userId: req.user._id,
            details: `Suppression de la dépense ${expense._id}`
        });

        res.json({ message: 'Dépense supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get expense statistics
// @route   GET /api/expenses/stats
// @access  Private
const getExpenseStats = async (req, res) => {
    try {
        const stats = await Expense.aggregate([
            { $match: { userId: req.user._id } },
            { $group: {
                _id: '$category',
                total: { $sum: '$amount' },
                count: { $sum: 1 },
                average: { $avg: '$amount' }
            }},
            { $sort: { total: -1 } }
        ]);

        const totalExpenses = await Expense.countDocuments({ userId: req.user._id });
        const totalAmount = await Expense.aggregate([
            { $match: { userId: req.user._id } },
            { $group: {
                _id: null,
                total: { $sum: '$amount' }
            }}
        ]);

        res.json({
            stats,
            totalExpenses,
            totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { 
    createExpense, 
    getMyExpenses, 
    getExpenses, 
    updateExpenseStatus, 
    updateExpense, 
    deleteExpense,
    getExpenseStats
};