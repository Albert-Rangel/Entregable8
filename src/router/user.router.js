import { Router } from 'express';
import { userModel } from '../dao/models/user.model.js';

const router = Router();

router.post('/login', async (req, res) => {
  if (req.session.isLogged) {
    return res.redirect('/profile');
  }

  const { email,  password } = req.body;
  const user = await userModel.findOne({ email, password }).lean();

  if (!user) {
    return res.redirect('/login');
  }
  console.log(user)
  req.session.firstname = user.firstname;
  req.session.lastname = user.lastname;
  req.session.age = user.age;
  req.session.email = user.email;
  req.session.isLogged = true;

  // const firstname = req.session.firstname;
  // const lastname = req.session.lastname;
  // const age = req.session.age;
  // const email_ = req.session.email;


  // res.redirect('/profile');
  res.redirect('/products' );
  
});

router.post('/signup', async (req, res) => {
  if (req.session.isLogged) {
    return res.redirect('/profile');
  }

  const { firstname, lastname, email, age, password } = req.body;

  const userExists= await userModel.findOne({email})

  if(userExists){
    return res.send("Ya estas registrado")
  }

  const user = await userModel.create({  firstname, lastname, email, age, password });

  req.session.firstname = firstname;
  req.session.lastname = lastname;
  req.session.age = age;
  req.session.email = email;
  req.session.isLogged = true;

  res.redirect('/profile');
});

export default router;