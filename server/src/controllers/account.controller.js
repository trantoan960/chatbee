/**
 * Controller users or account for project
 * author: Sky Albert
 * date up: 07/02/2019
 * date to: ___
 * team: BE-RHP
 */

const CONFIG = require('../configs/configs')
const Account = require('../models/Account.model')

const JsonResponse = require('../configs/res')
const JWT = require('jsonwebtoken')

// set one cookie
const option = {
  maxAge: 1000 * 60 * 60 * 24, // would expire after 1 days
  httpOnly: true, // The cookie only accessible by the web server
  signed: true, // Indicates if the cookie should be signed
  secure: true
}

const signToken = user => {
  return JWT.sign({
    iss: 'RHPTeam',
    sub: user._id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, CONFIG.JWT_SECRET)
}

module.exports = {

  /**
   * Register By User
   * @param req
   * @param res
   */
  signUp: async (req, res) => {
    const { email } = req.value.body
    const foundUserEmail = await Account.findOne({ email })
    if (foundUserEmail) return res.status(404).json(JsonResponse('Email is exists!', null))
    const newUser = await new Account(req.value.body)
    const sessionToken = await signToken(newUser)
    await res.cookie('sid', sessionToken, option)
    await res.cookie('uid', newUser._id, option)
    await newUser.save()
    res.status(200).json(JsonResponse('Successfully!', {
      _id: newUser._id,
      email: newUser.email,
      token: sessionToken
    }))
  },

  /**
   * Login Local Using Passport Middleware By User
   * @param req
   * @param res
   */
  signIn: async (req, res) => {
    // Generate the token
    const foundUser = await Account.findById(req.user._id).select('-password')
    const sessionToken = await signToken(req.user)
    res.cookie('sid', sessionToken)
    res.status(200).json(JsonResponse('Successfully!', { token: sessionToken, user: foundUser }))
  },

  /**
   * Get User (Query can get one data)
   * @param req
   * @param res
   */
  index: async (req, res) => {
    const dataFound = await Account.find(req.query).select('-password')
    if (!dataFound) return res.status(403).json(JsonResponse('Data is not found!', null))
    res.status(200).json(JsonResponse('Data fetch successfully!', dataFound))
  },

  /**
   * Update User (Note: Have to header['Authorization']
   * @param req
   * @param res
   */
  update: async (req, res) => {
    const { body, params, query } = req
    if (!query._userId) return res.status(405).json(JsonResponse('Not authorized!', null))
    const foundUser = await Account.findById(params.userId)
    if (!foundUser) return res.status(403).json(JsonResponse('User is not found!', null))
    if (query._userId !== foundUser._id) return res.status(403).json(JsonResponse('Authorized is wrong!', null))
    const dataUserUpdated = await Account.findByIdAndUpdate(params.userId, { $set: body }, { new: true }).select('-password')
    res.status(201).json(JsonResponse(dataUserUpdated, 201, 'Cập nhật dữ liệu thành công!', false))
  },

  /**
   * delete user by id
   * @param req
   * @param res
   * @param next
   */
  deleteUser: async (req, res, next) => {
    try {
      return await req.user.remove(err => {
        if (err) {
          res.json(JsonResponse('', 404, err, false))
        }
        res.send(JsonResponse('', 200, `Delete user ${req.user.name} success`, false))
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * Secret for unlock key token
   * @param req
   * @param res
   */
  secret: (req, res) => {
    res.status(200).json(JsonResponse('resources!', 200, 'Authorization successfully!', false))
  }
}
