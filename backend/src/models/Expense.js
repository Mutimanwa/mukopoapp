import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'EUR'
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    receiptUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['PendingManager', 'PendingFinance', 'Approved', 'Rejected', 'Refunded'],
        default: 'PendingManager'
    },
    history: [{
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String },
        comment: { type: String },
        updatedAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
