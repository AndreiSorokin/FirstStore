const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models')


const generateJwt = (id, email, role) => {
   return jwt.sign(
      {id, email, role},
      process.env.SECRET_KEY,
      {expiresIn: '24h'}
      )
}

class UserController {
   async registration(request, response) {
      const {email, password, role} = request.body
      if (!email || !password) {
         return next(ApiError.badRequest('Incorrect email or password'))
      }
      const candidate = await User.findOne({where: {email}})
      if (candidate) {
         return next(ApiError.badRequest('This user has already exist'))
      }
      const hashPassword = await bcrypt.hash(password, 5)
      const user = await User.create({email, role, password: hashPassword})
      const basket = await Basket.create({userId: user.id})
      const token = generateJwt(user.id, user.email, user.role)
         return response.json({token})

   }

   async login(request, response, next) {
      const {email, password} = request.body
      const user = await User.findOne({where: {email}})
      if (!user) {
         return next(ApiError.internal('Wrong email'))
      }
      let comparePassword = bcrypt.compareSync(password, user.password) 
      if (!comparePassword) {
         return next(ApiError.internal('Wrong password'))
      }
      const token = generateJwt(user.id, user.email, user.role)
      return response.json({token})
   }

   async check(request, response, next) {
      const token = generateJwt(request.user.if, request.user.email, request.user.role)
      return response.json({token})
   }
}

module.exports = new UserController()