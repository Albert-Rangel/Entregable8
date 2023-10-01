const publicRoutes = (req, res, next) => {

    console.log("entrando a una ruta publica")
    if (req.session.isLogged) {
        return res.redirect('/profile');
    }
    next() 
}
export default publicRoutes