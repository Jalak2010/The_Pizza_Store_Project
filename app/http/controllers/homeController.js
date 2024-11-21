
const Menu = require("../../models/menu");

const Feedback = require('../../models/feedback')


function homeController() {

    return {
         index(req, res) {
            
            return res.render('home');
        },
        async menu(req, res) {
            const pizzas = await Menu.find();
            console.log(pizzas);
            return res.render('menu', { pizzas: pizzas });
            // return res.render('menu') 
        },
        review(req, res) {
            var feedback = new Feedback({
                fname: req.body.fname,
                email: req.body.email,
                feedback: req.body.feedback
            });
            feedback.save((err, doc) => {
                if (!err)
                    res.redirect('/#contact');
            });
        }
    }

}






module.exports = homeController;