const courses = [
    {
        title: "Introduction à l'IA",
        description: "Découvrez les fondamentaux de l'intelligence artificielle.",
        price: 199,
        level: "Débutant"
    },
    {
        title: "Machine Learning Fondamental",
        description: "Apprenez les principes du machine learning et les algorithmes de base.",
        price: 299,
        level: "Intermédiaire"
    },
    {
        title: "Deep Learning Avancé",
        description: "Maîtrisez les réseaux de neurones profonds et leurs applications.",
        price: 399,
        level: "Avancé"
    }
];

exports.index = (req, res) => {
    res.render("index", { pageTitle: "Accueil" });
};

exports.about = (req, res) => {
    res.render("about", { pageTitle: "À propos" });
};

/*exports.courses = (req, res) => {
    res.render("courses", {
        pageTitle: "Nos Cours",
        courses: courses
    });
};*/

//nouveau courses
exports.courses = (req, res) => {
    let filteredCourses = [...courses];
    
    // Filtre par niveau
    if (req.query.level) {
        filteredCourses = filteredCourses.filter(c => c.level.toLowerCase() === req.query.level.toLowerCase());
    }
    
    // Filtre par prix max
    if (req.query.maxPrice) {
        filteredCourses = filteredCourses.filter(c => c.price <= parseInt(req.query.maxPrice));
    }

    res.render("courses", {
        pageTitle: "Nos Cours",
        courses: filteredCourses
    });
};

exports.contact = (req, res) => {
    res.render("contact", { pageTitle: "Contact" });
};

/*exports.processContact = (req, res) => {
    console.log("Données du formulaire reçues:");
    console.log(req.body);
    res.render("thanks", {
        pageTitle: "Merci",
        formData: req.body
    });
};*/

//nouveau processContact 
exports.processContact = (req, res) => {
    const { name, email } = req.body; // Seuls les champs obligatoires

    // Validation minimale mais essentielle
    if (!name || !email) {
        req.session.notification = {
            type: "error",
            message: "Nom et email sont obligatoires"
        };
        req.session.formData = req.body;
        return res.redirect("/contact"); 
    }

    // Validation du format email (optionnel mais recommandé)
    if (!email.includes('@')) {
        req.session.notification = {
            type: "error",
            message: "Format d'email invalide"
        };
        return res.redirect("/contact");
    }
    // Ajoutez cette validation si nécessaire
if (name.length > 50) {
    req.session.notification = {
        type: "error",
        message: "Le nom ne doit pas dépasser 50 caractères"
    };
    return res.redirect("/contact");
}

    // Si tout est valide
    req.session.notification = {
        type: "success",
        message: "Message envoyé avec succès"
    };
    res.redirect("/thanks");
};
exports.showThanks = (req, res) => {
    res.render("thanks", {
        pageTitle: "Merci",
        formData: req.session.formData || {} 
    });
};
//pour faq
exports.faq = (req, res) => {
    const faqItems = [
        { question: "Qui peut suivre les cours ?", reponse: "Nos cours sont ouverts a tous, debutants comme experts." },
        { question: "Comment acceder a nos cours ?", reponse: "Apres inscription, vous recevrez un lien d'acces par email." },
        { question: "Puis-je obtenir un certificat ?", reponse: "Oui, un certificat est delivree apres reussite a l'examen final." },
        { question: "Quelle est la duree des cours ?", reponse: "Entre 8 et 16 semaines." },
        { question: "Y a-t-il un accompagnement ?", reponse: "Oui, nos instructeurs repondent a vos questions ." }
    ];
    res.render("faq", { 
        pageTitle: "FAQ",
        faqs: faqItems 
    });
};