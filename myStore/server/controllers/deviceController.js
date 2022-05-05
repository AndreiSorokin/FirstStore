const uuid = require('uuid')
const path = require('path')
const {Device, DeviceInfo} = require('../models/models')
const ApiError = require('../error/ApiError')


class DeviceController {
   async create(request, response, next) {

      try{
         const {name, price, brandId, typeId, info} = request.body
      const {img} = request.files
      let fileName = uuid.v4() + ".jpg"
      img.mv(path.resolve(__dirname, '..', 'static', fileName))

      if (info) {
         info = JSON.parse(info)
         info.forEach(i => DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: device.id
         }))
      }

      const device = await Device.create({name, price, brandId, typeId, img: fileName})

      return response.json(device)
      } catch(e) {
         next(ApiError.badRequest(e.message))
      }
      
   }

   async getAll(request, response) {

      let {brandId, typeId, limit, page} = request.query
      page = page || 1
      limit = limit || 1
      let offset = page * limit - limit
      let devices

      if (!brandId && !typeId) {
         devices = await Device.findAndCountAll({limit, offset})
      }

      if (brandId && !typeId) {
         devices = await Device.findAndCountAll({where: {brandId}, limit, offset})
      }

      if (!brandId && typeId) {
         devices = await Device.findAndCountAll({where: {typeId}, limit, offset})
      }

      if (brandId && typeId) {
         devices = await Device.findAndCountAll({where: {brandId, typeId}, limit, offset})
      }

      return response.json(devices)
   }

   
   async getOne(request, response) {
      const {id} = request.params
      const device = await Device.findOne(
         {
            where: {id},
            include: [{model: DeviceInfo, as: 'info'}]
         }
      )
      return response.json(device)
   }
}

module.exports = new DeviceController()