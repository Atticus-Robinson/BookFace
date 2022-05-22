const router = require("express").Router();

const {
  getAllThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
} = require("../../controllers/thought-controller");

//Set up GET all and POST at /api/routes
router.route("/").get(getAllThoughts).post(createThought);

//Set up GET one, PUT, and DELETE at /api/thoughts/:id
router
  .route("/:thoughtId")
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

//Set up reactions
router.route("/:thoughtId/reactions").put(addReaction);
router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaction);

module.exports = router;
