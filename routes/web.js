
const homeController = require("../app/http/controllers/homeController");

const cartController = require("../app/http/controllers/customers/cartController")

const authController = require("../app/http/controllers/authController");

const orderController = require("../app/http/controllers/customers/orderController");


const AdminOrderController = require("../app/http/controllers/admin/orderController");

const StatusController = require("../app/http/controllers/admin/StatusController");

const multer = require('multer')

//admin
const dataController = require('../app/http/controllers/admin/dataController');
const viewController = require('../app/http/controllers/admin/viewController');



//middlewares
const auth = require('../app/http/middlewares/auth')

const guest = require('../app/http/middlewares/guest');

const admin = require('../app/http/middlewares/admin')

// const statusController = require('../app/http/controllers/admin/statusController');
const updateController = require('../app/http/controllers/admin/updateController');



function initRoutes(app) {

    app.get('/', homeController().index);

    //routing -- home page
    app.get('/menu', homeController().menu);

    //routing -- login page
    app.get('/login', guest, authController().login);

    app.post('/login', authController().postLogin);

    
    //routing -- register page
    app.get('/register',guest, authController().register);

    app.post('/register',  authController().postRegister);

    app.post('/logout',  authController().logout);

    

    //routing -- cart page
    app.get('/cart', cartController().index);

    app.post('/update-cart', cartController().update) 

    app.get('/cart/delete/:id', cartController().delete)
    app.get('/cart/plus/:id', cartController().plus)


    //customer routes
     //routing -- orders form page
     app.post('/orders',auth, orderController().store)
     app.get('/customer/orders',auth, orderController().index)
     app.get('/customer/orders/:id', auth , orderController().show)


     
    const storage = multer.diskStorage({
        destination: (req, file, cb)=>{
            cb(null, './public/img');
        },
        filename: (req, file, cb)=>{
            console.log(file)
            cb(null, Date.now() + file.originalname);
        }
    }); 
    const upload = multer({
        storage: storage
    });

   



    //  Admin routes
    app.get('/admin/orders',admin, AdminOrderController().index)
    app.post('/admin/order/status',admin, StatusController().update)
    app.get('/admin/completedOrder', admin, AdminOrderController().view)
    app.get('/admin/view', admin, viewController().view)
    app.get('/admin/data', admin, dataController().add)
    app.post('/admin/data', admin, upload.single('image'), dataController().data)
    app.get('/admin/view/delete/:id', admin, dataController().delete)
    app.get('/admin/update/:id', admin, updateController().view)
    app.get('/admin/update', admin, updateController().add)
    app.post('/admin/update', admin, upload.single('image'), updateController().data)

   
    //about 
    app.get('/about',(req,res)=>{
        res.render('about');
    })

    //menu
    app.get('/menu',(req,res)=> {
        res.render('menu')
    })

    //contact
    app.get('/contact', (req,res)=> {
        res.render('contact')
    })
    
    //blog
    app.get('/blog', (Req,res)=> {
        res.render('blog')
    })

    //login
    app.get('/login',(req,res)=> {
        res.render('auth/login')
    })

}



module.exports = initRoutes;