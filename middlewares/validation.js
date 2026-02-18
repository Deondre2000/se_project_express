const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
      'string.empty': 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      'string.empty': 'The "imageUrl" field must be filled in',
      'string.uri': 'the "imageUrl" field must be a valid url',
    }),
  }),
});

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      'string.empty': 'The "avatar" field must be filled in',
      'string.uri': 'the "avatar" field must be a valid url',
    }),
    email: Joi.string().required().email().messages({
      'string.email': 'The "email" field must be a valid email',
      'string.empty': 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.email': 'The "email" field must be a valid email',
      'string.empty': 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateUpdateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
    }),
    avatar: Joi.string().custom(validateURL).messages({
      'string.uri': 'the "avatar" field must be a valid url',
    }),
  }),
});

module.exports.validateSignUpBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
      'string.empty': 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      'string.empty': 'The "avatar" field must be filled in',
      'string.uri': 'the "avatar" field must be a valid url',
    }),
    email: Joi.string().required().email().messages({
      'string.email': 'The "email" field must be a valid email',
      'string.empty': 'The "email" field must be filled in',
    }),
    password: Joi.string().required().min(6).messages({
      'string.empty': 'The "password" field must be filled in',
      'string.min': 'The "password" field must be at least 6 characters',
    }),
  }),
});

module.exports.validateItemBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
    }),
    weather: Joi.string().required().valid('hot', 'warm', 'cold').messages({
      'any.only': 'The "weather" field must be one of: hot, warm, cold',
      'string.empty': 'The "weather" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      'string.empty': 'The "imageUrl" field must be filled in',
      'string.uri': 'the "imageUrl" field must be a valid url',
    }),
  }),
});

module.exports.validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().hex().length(24).messages({
      'string.hex': 'The "itemId" must be a valid hexadecimal value',
      'string.length': 'The "itemId" must be 24 characters long',
    }),
  }),
});

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24).messages({
      'string.hex': 'The "id" must be a valid hexadecimal value',
      'string.length': 'The "id" must be 24 characters long',
    }),
  }),
});
