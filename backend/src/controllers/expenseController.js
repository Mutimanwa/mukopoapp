import Expense from '../models/Expense.js';

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
    try {
        const { amount, currency, category, date, receiptUrl } = req.body;

        const expense = new Expense({
            userId: req.user._id,
            amount,
            currency: currency || 'EUR',
            category,
            date,
            receiptUrl
        });

        const createdExpense = await expense.save();
        res.status(201).json(createdExpense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user expenses
// @route   GET /api/expenses/myexpenses
// @access  Private
const getMyExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user._id });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private/Admin/Finance/Manager
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({}).populate('userId', 'name email');
        res.json(expenses);
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
        const expense = await Expense.findById(req.params.id);

        if (expense) {
            expense.status = status;
            expense.history.push({
                updatedBy: req.user._id,
                status,
                comment
            });

            const updatedExpense = await expense.save();
            res.json(updatedExpense);
        } else {
            res.status(404).json({ message: 'Dépense non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createExpense, getMyExpenses, getExpenses, updateExpenseStatus };
