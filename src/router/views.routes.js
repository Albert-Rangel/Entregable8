import express, { Router } from "express"
import { uploader } from '../dao/middlewares/multer.js'
import ProductManager from '../dao/db/ProductManager.js'
import CartManager from '../dao/db/CartManager.js'
import publicRoutes from "../dao/middlewares/publicRoutes.js"
import privateRoutes from "../dao/middlewares/privateRoutes.js"

const productManager = new ProductManager();
const cartManager = new CartManager()
const router = express.Router()

router.get("/realTimeProducts", async (req, res) => {
    res.render("realTimeProducts", {
        title: "Real Time Products",
        style: "home.css"
    })
})

router.get("/home", async (req, res) => {
    const allProducts = await productManager.getProducts_()
    console.log(allProducts)
    res.render("home", {
        title: "Cards Products",
        style: "home.css",
        Products: allProducts

    })
})

router.get("/products", privateRoutes, async (req, res) => {
   console.log("entro en products en viewrouter")
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const age = req.session.age;
    const email_ = req.session.email;
    const Rol = req.session.admin ? "Admin" : "User"


    res.render("catalog", {
        title: "Catalog",
        style: "home.css",
        firstname, lastname, age, email_, Rol
    })
})

router.get("/carts/:cid", async (req, res) => {

    const cid = req.params.cid
    const allProducts = await cartManager.getProductsinCartById(cid)
    const isString = (value) => typeof value === 'string';
    if (isString(allProducts)) {
        const arrayAnswer = ManageAnswer(allProducts)
        return res.status(arrayAnswer[0]).send({
            status: arrayAnswer[0],
            message: arrayAnswer[1]
        })
    }

    res.render("cart", {
        title: "Cart Products",
        style: "home.css",
        Products: allProducts
    })
})

router.get('/login', publicRoutes, (req, res) => {

    res.render('login');
    res.render("login", {
        title: "Login Form",
        style: "signup.css"
    })
});

router.get('/logout', privateRoutes, (req, res) => {
    req.session.destroy()
    res.render("login", {
        title: "Login Form",
        style: "signup.css"
    })
});

router.get('/signup', publicRoutes, (req, res) => {

    res.render("signup", {
        title: "Signup Form",
        style: "singup.css"
    })
});

router.get('/profile', privateRoutes, (req, res) => {

    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const age = req.session.age;
    const email_ = req.session.email;
    const Rol = req.session.admin ? "Admin" : "User"

    res.render("catalog", {
        title: "Catalog",
        style: "home.css",
        firstname, lastname, age, email_, Rol
    })

});


function ManageAnswer(answer) {
    const arrayAnswer = []
    if (answer) {
        const splitString = answer.split("|");
        switch (splitString[0]) {
            case "E01":
                arrayAnswer.push(400)
                arrayAnswer.push(splitString[1])
                return arrayAnswer
                break;
            case "E02":
                arrayAnswer.push(404)
                arrayAnswer.push(splitString[1])
                return arrayAnswer
                break;
            case "SUC":
                arrayAnswer.push(200)
                arrayAnswer.push(splitString[1])
                return arrayAnswer
                break;
            case "ERR":
            default:
                arrayAnswer.push(500)
                arrayAnswer.push(splitString[1])
                return arrayAnswer
                break;
        }
    }
}
export default router
