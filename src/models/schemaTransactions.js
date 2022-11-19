import joi from "joi";

export const schemaTransactions = joi.object({
    value: joi.number().precision(2).strict().required(),
    type: joi.string().valid('deposit', 'withdrawal'),
    description: joi.string().max(15).required()
});