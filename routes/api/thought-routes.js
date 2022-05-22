const router = require("express").Router();

const {} = require("../../controllers/thought-controller");

//Set up GET all and POST at /api/routes
router.route("/").get(getAllThought);

//Set up GET one, PUT, and DELETE at /api/pizzas/:id
router.route("/:id").get(getThoughtById).put().delete();

module.exports = router;
