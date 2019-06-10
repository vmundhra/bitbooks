const controller = require('./controller');

exports.onBlockUpdate = async function(ctx) {
	const blockhash = ctx.request.body.blockhash;
	controller.onBlock(blockhash);
	ctx.status = 200;
};

exports.onWalletUpdate = async function(ctx) {
	console.log('onWalletUpdate = ', ctx.request.body);
	const txid = ctx.request.body.txid;
	await controller.onTransaction(txid);
	ctx.status = 200;
};

exports.routes = function(router) {
	router.post('/blocknotify', this.onBlockUpdate);
	router.post('/walletnotify', this.onWalletUpdate);
	return router;
};
