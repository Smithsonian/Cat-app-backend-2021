import Joi from 'joi';

export const signUpBody = Joi.object().keys({
  name: Joi.string().required(),
  role: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  active: Joi.boolean()
});

export const signInBody = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
