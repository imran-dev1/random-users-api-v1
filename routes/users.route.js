const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const app = express();

app.use(express.json());

// Get Random User API
router.route("/random").get(usersController.getRandomUser);

// Get All Users API
router.route("/all").get(usersController.getAllUsers);

// Save A User API
router.route("/save").post(usersController.saveAUser);

// Update A User API
router.route("/update/:id").patch(usersController.updateAUser);

// Update Bulk User API
router.route("/bulk-update").patch(usersController.updateBulkUser);

// Delete A User API
router.route("/delete/:id").delete(usersController.deleteUser);

module.exports = router;
