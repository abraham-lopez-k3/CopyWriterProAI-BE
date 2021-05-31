const Joi = require('joi');

const createSubscription = {
  body: Joi.object().keys({
    customerId: Joi.string().required(),
    priceId: Joi.string().required(),
  }),
};

const cancelSubscription = {
  body: Joi.object().keys({
    subscriptionId: Joi.string().required(),
  }),
};

const updateSubscription = {
  body: Joi.object().keys({
    subscriptionId: Joi.string().required(),
    newPriceId: Joi.string().required(),
  }),
};

const invoicePreview = {
  body: Joi.object().keys({
    subscriptionId: Joi.string().required(),
    priceId: Joi.string().required(),
    customerId: Joi.string().required(),
  }),
};

module.exports = {
  createSubscription,
  cancelSubscription,
  updateSubscription,
  invoicePreview,
};
