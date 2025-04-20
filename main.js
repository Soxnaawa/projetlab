const express = require("express");
const layouts = require("express-ejs-layouts");
const session = require("express-session");
const mongoose = require("mongoose"); // Ajout de Mongoose
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController");
const usersController = require("./controllers/usersController");
const coursesController = require("./controllers/coursesController");
const methodOverride = require('method-override');
//ce que jai ajoute 09/04
// Configuration de la connexion à MongoDB
mongoose.connect(
    "mongodb://localhost:27017/ai_academy",
    { useNewUrlParser: true }
  );
  
  const db = mongoose.connection;
  db.once("open", () => {
    console.log("Connexion réussie à MongoDB en utilisant Mongoose!");
  });
  
const app = express();
//
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
//app.use(methodOverride('_method'));
app.use(methodOverride("_method", {
    methods: ["POST", "GET"]
    
    }));
app.use(express.json());
// Configuration de base
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.set("layout", "layout"); // Spécifie explicitement le fichier layout


// Configuration des sessions (DEV)
app.use(session({
    secret: "glsi25",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
// Middleware pour les notifications
app.use((req, res, next) => {
    res.locals.notification = req.session.notification;
    delete req.session.notification;
    next();
});


// Middlewares
app.use(layouts);

// Routes
app.get("/", homeController.index);
app.get("/about", homeController.about);
//app.get("/courses", homeController.courses);
//app.get("/contact", homeController.contact);
app.get("/contact", (req, res) => {
    res.render("contact", {
        pageTitle: "Contact",
        formData: req.session.formData || {},
        notification: req.session.notification || undefined 
    });
});
app.post("/contact", homeController.processContact);
app.get("/thanks", homeController.showThanks);
app.get("/thanks", (req, res) => {
    res.render("thanks", {
        pageTitle: "Merci",
        formData: req.session.formData || {}, 
        notification: req.session.notification
    });
});
app.get("/faq", homeController.faq);
app.get("/subscribers", subscribersController.getAllSubscribers);
app.get("/subscribers/new", subscribersController.getSubscriptionPage);
app.post("/subscribers/create", subscribersController.saveSubscriber);
app.delete("/subscribers/:id", subscribersController.deleteSubscriber);
//routes modification 
app.get("/subscribers/:id/edit", subscribersController.getEditPage);
app.put("/subscribers/:id", subscribersController.updateSubscriber);
//route recherche bi
app.get("/subscribers/search", subscribersController.searchSubscribers);
//j ai deplace
app.get("/subscribers/:id", subscribersController.show);

// Routes pour les utilisateurs
app.get("/users", usersController.index, usersController.indexView);
app.get("/users/new", usersController.new);
app.post("/users/create", usersController.create, usersController.redirectView);
app.get("/users/:id", usersController.show, usersController.showView);
app.get("/users/:id/edit", usersController.edit);
app.put("/users/:id/update", usersController.update, usersController.redirectView);
app.delete("/users/:id/delete", usersController.delete, usersController.redirectView);

// Routes pour les cours
app.get("/courses", coursesController.index, coursesController.indexView);
app.get("/courses/new", coursesController.new);
app.post("/courses/create", coursesController.create, coursesController.redirectView);
app.get("/courses/:id", coursesController.show, coursesController.showView);
app.get("/courses/:id/edit", coursesController.edit);
app.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
//app.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);
// Route pour la suppression
app.delete("/courses/:id/delete", 
    coursesController.delete,
    coursesController.redirectView
  );
// Gestion des erreurs (doit être après les autres routes)
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

// Démarrage du serveur
app.listen(app.get("port"), () => {
    console.log(`Serveur démarré sur http://localhost:${app.get("port")}`);
    console.log("Appuyez sur Ctrl+C pour arrêter");
});