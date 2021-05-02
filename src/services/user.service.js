const httpStatus = require('http-status');
const { User, Payment } = require('../models');
const ApiError = require('../utils/ApiError');
const { authTypes } = require('../config/auths');

const config = require('../config/config');
const twilio = require('twilio')(config.twilio.twilioAccountSID, config.twilio.twilioAuthToken);

const lookupPhoneNumber = async (phoneNumber) => {
  try {
    const phoneNumberVerificationData = await twilio.lookups.v1.phoneNumbers(phoneNumber).fetch();
    return phoneNumberVerificationData;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please provide a valid phone number');
  }
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isPhoneNumberTaken(userBody.phoneNumber)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This phone number is already registered!');
  }
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This email is already registered!');
  }
  const { phoneNumber } = userBody;
  await lookupPhoneNumber(phoneNumber);
  const user = await User.create(userBody);
  return user;
};

const createUserPayment = async (userId) => {
  const userPayment = {
    _id: userId,
    paymentsHistory: [],
  };
  await Payment.create(userPayment);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

const checkUserExistsOrNot = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUser = async (identity) => {
  const user = await User.findOne(identity);
  return user;
};

const setPasswordResetCode = async (email, OTP) => {
  const user = await getUser({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, { OTP });
  await user.save();
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (user, userId, updateBody) => {
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const updateBookmarks = async (user, { contentId, index }) => {
  const { bookmarks } = user;
  if ([contentId] in bookmarks) {
    if (bookmarks[contentId].includes(index)) {
      throw new ApiError(httpStatus.CONFLICT, `Already bookmarked!`);
    } else {
      bookmarks[contentId].push(index);
    }
  } else {
    bookmarks[contentId] = [index];
  }
  await user.markModified('bookmarks');
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

const strategyValuesByAuthType = (strategy, profile) => {
  switch (strategy) {
    case authTypes.GOOGLE:
      return {
        firstName: profile._json.given_name,
        lastName: profile._json.family_name,
        email: profile._json.email,
        profileAvatar: profile._json.picture,
      };
    case authTypes.FACEBOOK:
      return {
        firstName: profile._json.first_name,
        lastName: profile._json.last_name,
        email: profile._json.email,
        profileAvatar: profile.photos[0].value,
      };
    default:
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid strategy');
  }
};

const strategyVerify = (authType) => async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({ userId: profile.id });
    if (user) {
      done(null, user);
    } else {
      const userInfo = strategyValuesByAuthType(authType, profile);
      const emailExist = await User.findOne({ email: userInfo.email });
      if (emailExist) {
        throw new ApiError(httpStatus.CONFLICT, 'email already register');
      }
      const newUser = await User.create({
        userId: profile.id,
        isVerified: true,
        authType,
        ...userInfo,
      });
      done(null, newUser);
    }
  } catch (error) {
    done(error, false);
  }
};

module.exports = {
  createUser,
  createUserPayment,
  queryUsers,
  getUserById,
  getUser,
  setPasswordResetCode,
  checkUserExistsOrNot,
  updateUserById,
  updateBookmarks,
  deleteUserById,
  strategyVerify,
};
