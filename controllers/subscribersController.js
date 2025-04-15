const Subscriber = require("../models/subscriber");

exports.getAllSubscribers = (req, res, next) => {
  Subscriber.find({})
    .exec()
    .then(subscribers => {
      res.render("subscribers/index", {
        subscribers: subscribers,
        pageTitle: "Liste des abonnés",
        searchQuery: {}
      });
    })
    .catch(error => {
      console.log(`Erreur lors de la récupération des abonnés: ${error.message}`);
      next(error);
    });
};

exports.getSubscriptionPage = (req, res) => {
    res.render("subscribers/new", {
      pageTitle: "Nouvel abonné",
      errorMessages: [], // Initialise un tableau vide
      formData: {} // Initialise un objet vide pour les données du formulaire
    });
  };

exports.saveSubscriber = async (req, res) => {
    const { name, email, zipCode } = req.body;
    
    try {
      // Validation manuelle supplémentaire si nécessaire
      if (!name || !email || !zipCode) {
        throw new Error('Tous les champs sont obligatoires');
      }
  
      const existingSubscriber = await Subscriber.findOne({ email });
      if (existingSubscriber) {
        throw new Error('Cet email est déjà utilisé');
      }
  
      const newSubscriber = new Subscriber({
        name,
        email,
        zipCode
      });
  
      await newSubscriber.validate(); // Valide explicitement avant sauvegarde
      
      const savedSubscriber = await newSubscriber.save();
      res.render('subscribers/thanks', {
        pageTitle: 'Merci pou+r votre inscription',
        subscriber: savedSubscriber
      });
  
    } catch (error) {
        console.error('Erreur d\'inscription:', error.message);
        
        let errorMessages = [];
        if (error.name === 'ValidationError') {
          errorMessages = Object.values(error.errors).map(err => err.message);
        } else {
          errorMessages.push(error.message);
        }
    
        res.status(400).render('subscribers/new', {
          pageTitle: 'Nouvel abonné',
          errorMessages, // Bien défini maintenant
          formData: req.body // Bien défini maintenant
        });
      }
  };

exports.show = (req, res, next) => {
  let subscriberId = req.params.id;
  Subscriber.findById(subscriberId)
    .then(subscriber => {
      res.render("subscribers/show", {
        subscriber: subscriber,
        pageTitle: `Détails de ${subscriber.name}`
      });
    })
    .catch(error => {
      console.log(`Erreur lors de la récupération d'un abonné par ID: ${error.message}`);
      next(error);
    });
};

// Ajout pour la suppression
exports.deleteSubscriber = (req, res, next) => {
    const subscriberId = req.params.id;
    
    Subscriber.findByIdAndDelete(subscriberId)
      .then(() => {
        console.log(`Abonné ${subscriberId} supprimé avec succès`);
        res.redirect("/subscribers");
      })
      .catch(error => {
        console.error(`Erreur lors de la suppression: ${error.message}`);
        next(error);
      });
  };
  //pour la mod
  exports.getEditPage = (req, res, next) => {
    Subscriber.findById(req.params.id)
      .then(subscriber => {
        res.render("subscribers/edit", {
          subscriber: subscriber,
          pageTitle: `Modifier ${subscriber.name}`
        });
      })
      .catch(next);
  };
  
  exports.updateSubscriber = (req, res, next) => {
    Subscriber.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        zipCode: req.body.zipCode
      },
      { new: true, runValidators: true }
    )
      .then(() => res.redirect(`/subscribers/${req.params.id}`))
      .catch(error => {
        if (error.name === 'ValidationError') {
          return Subscriber.findById(req.params.id)
            .then(subscriber => {
              res.render("subscribers/edit", {
                subscriber: { ...subscriber.toObject(), ...req.body },
                pageTitle: `Modifier ${req.body.name}`,
                error: error.message
              });
            });
        }
        next(error);
      });
  };
  //pour la recherche
  exports.searchSubscribers = (req, res, next) => {
    const { name, zipCode } = req.query;
    const query = {};
  
    if (name) query.name = { $regex: name, $options: 'i' };
    if (zipCode) query.zipCode = zipCode;
  
    Subscriber.find(query)
      .then(subscribers => {
        res.render("subscribers/index", {
          subscribers,
          pageTitle: "Résultats de recherche",
          searchQuery: { name, zipCode }
        });
      })
      .catch(next);
  };