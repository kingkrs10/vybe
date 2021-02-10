// import Stripe from 'stripe';
const commonModel = require('../common/common');
const config = require("../config/config");
const userModel = require("../users/model");
const Stripe = require('stripe');
const stripe = Stripe(config.stripe_api_key);

const createCustomer = async (request, response, next) => {
	try {
		await stripe.customers.create({
			name: request.body.name,
			source: request.body.token,
			phone: request.body.phone,
			description: request.body.name
		}).then(async(res) => {
			const tempBody = { ...request.body, stripeCustomerId: res.id}
			const result = await commonModel.tryBlock(tempBody, '(Stripe:createNewCustomer)', userModel.updateStripeCustomerId);
			response.status(200).send(JSON.stringify(result));
		}).catch((err) => {
			console.log(`error: 'Stripe: Create a new customer's card'`, new Date(), error);
			response.status(200).send(
				JSON.stringify({
					error: true,
					message: err.toString()
				})
			);
		});
	} catch (err) {
		response.status(200).send(
			JSON.stringify({
				error: true,
				message: err.toString()
			})
		);
	}
};

const createCustomerCard = async (request, response, next) => {
	try {
		await stripe.customers.createSource(
			req.body.customer_Id,
			{ source: req.body.token }
		).then((res) => {
			const result = { error: false, data: res, message: "Created customer's new card successfully" }
			response.status(200).send(JSON.stringify(result));
		}).catch((err) => {
			console.log(`error: 'Stripe: Create a new customer's card`, new Date(), error);
			response.status(200).send(
				JSON.stringify({
					error: true,
					message: err.toString()
				})
			);
		});
	} catch (err) {
		response.status(200).send(
			JSON.stringify({
				error: true,
				message: err.toString()
			})
		);
	}
};

const getAllCardDetails = async (request, response, next) => {
	try {
		await stripe.customers.listSources(
			request.params.id, { object: 'card', limit: 10 }
		).then((res) => {
			const result = { error: false, data: res.data, message: "Get All Customer's card Details" }
			response.status(200).send(JSON.stringify(result));
		}).catch((err) => {
			console.log(`error: 'Stripe: Get All customer's card`, new Date(), error);
			response.status(200).send(
				JSON.stringify({
					error: true,
					message: err.toString()
				})
			);
		});
	} catch (err) {
		response.status(200).send(
			JSON.stringify({
				error: true,
				message: err.toString()
			})
		);
	}
};

const removeCustomerCard = async (request, response, next) => {
	try {
		await stripe.customers
			.deleteSource(request.params.id, request.params.cardId)
			.then((res) => {
				const result = { error: false, data: res, message: "Removed customer's card successfully" }
				response.status(200).send(JSON.stringify(result));
			}).catch((err) => {
				console.log(`error: 'Stripe: Remove customer's card`, new Date(), error);
				response.status(200).send(
					JSON.stringify({
						error: true,
						message: err.toString()
					})
				);
			});
	} catch (err) {
		response.status(200).send(
			JSON.stringify({
				error: true,
				message: err.toString()
			})
		);
	}
};

const updateDefaultPaymentCard = async (request, response, next) => {
	try {
		await stripe.customers.
			update(request.body.customer_Id, { default_source: request.body.customerCard_Id })
			.then((res) => {
				const result = { error: false, data: res, message: "Updated default payment card successfully" }
				response.status(200).send(JSON.stringify(result));
			}).catch((err) => {
				console.log(`error: 'Stripe: Update default payment customer's card`, new Date(), error);
				response.status(200).send(
					JSON.stringify({
						error: true,
						message: err.toString()
					})
				);
			});
	} catch (err) {
		response.status(200).send(
			JSON.stringify({
				error: true,
				message: err.toString()
			})
		);
	}
};


module.exports = {
	createCustomer,
	createCustomerCard,
	getAllCardDetails,
	removeCustomerCard,
	updateDefaultPaymentCard
};
