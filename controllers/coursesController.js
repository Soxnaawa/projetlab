const Course = require("../models/courses");

// Fonction utilitaire pour extraire les paramètres du cours du corps de la requête
const getCourseParams = body => {
    return {
      title: body.title,
      description: body.description,
      maxStudents: parseInt(body.maxStudents, 10),
      cost: parseFloat(body.cost),
      level: body.level || "Débutant"
    };
  };
  

module.exports = {
  index: async (req, res, next) => {
    try {
      const courses = await Course.find({});
      console.log("Cours trouvés:", courses);
      res.locals.courses = courses;
      next();
    } catch (error) {
      console.error("Erreur:", error);
      next(error);
    }
  },
  indexView: (req, res) => {
    res.render("courses/index", {
      pageTitle: "Nos Cours",
      courses: res.locals.courses
    });
  },
      

  new: (req, res) => {
    res.render("courses/new", { pageTitle: "Créer un cours" });
  },

  create: (req, res, next) => {
    let courseParams = {
      title: req.body.title,
      description: req.body.description,
      maxStudents: req.body.maxStudents,
      cost: req.body.cost
    };
  
    Course.create(courseParams)
      .then(course => {
        console.log("✅ Nouveau cours créé :", course); // <-- Ajoute ceci
        res.locals.redirect = "/courses";
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`❌ Erreur lors de la création du cours: ${error.message}`);
        next(error);
      });
  },
  
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) {
      res.redirect(redirectPath);
    } else {
      next();
    }
  },
  

  show: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .populate("students")
      .then(course => {
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Erreur lors de la récupération du cours par ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("courses/show", { pageTitle: "Détail du cours" });
  },

  edit: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.render("courses/edit", {
          course: course,
          pageTitle: "Modifier un cours"
        });
      })
      .catch(error => {
        console.log(`Erreur lors de la récupération du cours par ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let courseId = req.params.id,
      courseParams = getCourseParams(req.body);
    Course.findByIdAndUpdate(courseId, {
      $set: courseParams
    })
      .then(course => {
        res.locals.redirect = `/courses/${courseId}`;
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Erreur lors de la mise à jour du cours par ID: ${error.message}`);
        next(error);
      });
  },
  delete: async (req, res, next) => {
    try {
        const courseId = req.params.id;
        await Course.findByIdAndDelete(courseId);
        req.session.notification = {
            type: 'success',
            message: 'Cours supprimé avec succès'
        };
        res.locals.redirect = "/courses";
        next();
    } catch (error) {
        console.error("Erreur suppression:", error);
        req.session.notification = {
            type: 'error',
            message: 'Échec de la suppression'
        };
        res.locals.redirect = `/courses/${req.params.id}`;
        next();
    }
},
};
