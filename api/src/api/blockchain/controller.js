const Transaction = require('../transactions/model');
const Order = require('../orders/model');
const coinservice = require('../../coinservice');
const config = require('../../configuration');
const confirmations = config.get('CONFIRMATIONS_REQUIRED');
const socket = require('../../socket');

const sendBook = async function(order) {
	console.log('we sent out the book');
};

const checkTransactionConfirmations = async function(transaction) {
	const tx = await coinservice.getTransaction(transaction.txid);
	const status = tx.confirmations < confirmations ? 'unconfirmed' : 'confirmed';

	const txstatus = transaction.status;

	if (status !== txstatus) {
		transaction.status = status;
		transaction.save();
	}

	if (status == 'confirmed') {
		//update the order, process the delivery, etc.
		const order = await Order.findOne({ paymentAddress: transaction.address });
		await sendBook(order);
	}
};

const createNewTransaction = async function(txid) {
	const tx = await coinservice.getTransaction(txid);
	const status = tx.confirmations < confirmations ? 'unconfirmed' : 'confirmed';

	const t = await Transaction.create({
		txid,
		amount: tx.details[0].amount,
		address: tx.details[0].address,
		status
	});

	const order = await Order.findOne({ paymentAddress: t.address });

	if (order) {
		const room = socket.io.to(`${order._id}`);
		if (order.amount <= t.amount) {
			room.emit('update', { state: 'received' });
		} else {
			room.emit('update', { state: 'error' });
		}
	}
};

exports.onTransaction = async function(txid) {
	const transaction = await Transaction.findOne({ txid });

	if (!transaction) {
		await createNewTransaction(txid);
	} else {
		await checkTransactionConfirmations(transaction);
	}
};

exports.onBlock = async function(blockhash) {
	const transactions = await Transaction.find({ status: 'unconfirmed' });
	await Promise.all(transactions.map(checkTransactionConfirmations));
};
