import mongoose from 'mongoose';
import Game from './Game';
import User from './User';

require('mongoose-double')(mongoose);

import { TRANSACTION_TYPE } from 'constants/transaction';

const { Schema } = mongoose;

const Transaction = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: User },
  type: Schema.Types.String,
  amount: Schema.Types.Double,
  createdAt: { type: Date, default: Date.now },
});

Transaction.statics.create = async function(userId, type, amount) {
  const game = new this({
    userId, type, amount
  });

  return game.save();
}

Transaction.statics.getBalance = async function(userId) {
  return this.aggregate([
    { $match: {
      userId: new mongoose.Types.ObjectId(userId)
    }},
    { $group: {
      _id: "$userId",
      amount: { $sum: "$amount" }
    }}
  ])
}

Transaction.statics.depositHistory = async function(userId) {
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: {$in: [TRANSACTION_TYPE.DEPOSIT, TRANSACTION_TYPE.DEPOSIT_FEE]}
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    {
      $project: {
        type: 1,
        amount: 1,
        createdAt: {
          $dateToString: {
            format: '%H:%M, %d-%m-%Y',
            date: "$createdAt"
          }
        }
      }
    },
    {
      $limit: 7
    }
  ])
  // return this.find({
  //     userId, 
  //     type: {$in: [TRANSACTION_TYPE.DEPOSIT, TRANSACTION_TYPE.DEPOSIT_FEE]}
  //   }, {
  //     type: 1,
  //     amount: 1,
  //     createdAt: 1,
  //   })
  //   .sort({"createdAt": -1})
  //   .limit(10)
  //   .exec();

  
}

Transaction.statics.withdrawHistory = async function(userId) {
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: TRANSACTION_TYPE.WITHDRAW
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    {
      $project: {
        type: 1,
        amount: 1,
        createdAt: {
          $dateToString: {
            format: '%H:%M, %d-%m-%Y',
            date: "$createdAt"
          }
        }
      }
    },
    {
      $limit: 7
    }
  ])
  
}

Transaction.statics.transactionHistory = async function(userId) {
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: {$in: [TRANSACTION_TYPE.BUY_TICKET, 
          TRANSACTION_TYPE.WINNING, 
          TRANSACTION_TYPE.DEPOSIT, 
          TRANSACTION_TYPE.DEPOSIT_FEE, 
          TRANSACTION_TYPE.WITHDRAW]}
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    {
      $project: {
        type: 1,
        amount: 1,
        createdAt: {
          $dateToString: {
            format: '%H:%M, %d-%m-%Y',
            date: "$createdAt"
          }
        }
      }
    },
  ])
  
}

Transaction.statics.getTotalSpent = async function(userId) {
  return this.aggregate([
    { $match: {
      userId: new mongoose.Types.ObjectId(userId),
      type: TRANSACTION_TYPE.BUY_TICKET
    }},
    { $group: {
      _id: "$userId",
      amount: { $sum: "$amount" }
    }}
  ])
}

Transaction.statics.getGameWon = async function(userId) {
  return this.aggregate([
    { $match: {
      userId: new mongoose.Types.ObjectId(userId),
      type: TRANSACTION_TYPE.WINNING
    }},
    { $group: {
      _id: "$userId",
      amount: { $sum: 1 }
    }}
  ])
}

Transaction.statics.getTotalEarned = async function(userId) {
  return this.aggregate([
    { $match: {
      userId: new mongoose.Types.ObjectId(userId),
      type: TRANSACTION_TYPE.WINNING
    }},
    { $group: {
      _id: "$userId",
      amount: { $sum: "$amount" }
    }}
  ])
}

module.exports = mongoose.model('Transaction', Transaction);