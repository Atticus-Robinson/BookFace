const { User, Thought } = require("../models");

const userController = {
  //Get all users
  getAllUsers(req, res) {
    User.find({})
      .select("-__v")
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },
  //Get one user
  getOneUser({ params }, res) {
    User.findOne({ _id: params.userId })
      .populate({ path: "friends" })
      .populate({ path: "thoughts" })
      .select("-__v")
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },
  //Create new user
  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },
  //Update user
  updateUser({ body, params }, res) {
    User.findOneAndUpdate({ _id: params.userId }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },
  //Delete user
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.userId })
      .then((dbUserData) => {
        Thought.deleteMany({ username: dbUserData.username })
          .then(res.json({ message: "Deleted" }))
          .catch((err) => res.status(400).json(err));
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = userController;
