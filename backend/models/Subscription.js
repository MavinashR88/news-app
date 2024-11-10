const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  planName: {
    type: String,
    enum: ['Free', 'Monthly', 'Yearly'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: function() {
      return this.planName !== 'Free';
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
