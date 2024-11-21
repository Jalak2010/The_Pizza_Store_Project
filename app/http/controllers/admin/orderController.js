
const Order = require('../../../models/order')

function orderController() {
    return {
        index(req,res) {
           Order.find({status: {$ne: 'completed'}}, null, {sort: {'createdAt': -1}}).populate('customerId', '-password').exec((err, orders)=> {
            
            if(req.xhr) {
                return res.json(orders)
            }
            
            return res.render('admin/orders')
           })
        },
        async view(req, res) {
            const corders = await Order.find({ status: { $eq: 'completed' } }, null, { sort: {'createdAt': -1} } )
            return res.render('admin/completedOrder', { corders })
        }
    }
}

module.exports = orderController;