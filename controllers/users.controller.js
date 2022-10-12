const { response } = require("express");
const fs = require("fs");
const { resolve } = require("path");
const users = JSON.parse(fs.readFileSync("users.json", "utf8"));

// Random User Controller
module.exports.getRandomUser = (req, res) => {
   const randomUser = users[Math.floor(Math.random() * users.length)];

   res.send(randomUser);
};

// All Users Controller
module.exports.getAllUsers = (req, res) => {
   const query = req.query;
   if (users.length < query.limit) {
      res.send({
         error: "Limit is greater then the users!",
      });
   } else {
      const limitedUsers = users.slice(0, query.limit);
      res.send(limitedUsers);
   }
};

// Save A User Controller
module.exports.saveAUser = (req, res) => {
   const data = req.body;
   if (Object.keys(data).length === 0) {
      res.send({
         message:
            "You must provide the data(gender, name, contact, address, photoUrl) through the body to save the user",
      });
   } else {
      if (
         data.gender &&
         data.name &&
         data.contact &&
         data.address &&
         data.photoUrl
      ) {
         const newUser = {
            id: users.length + 1,
            gender: data.gender,
            name: data.name,
            contact: data.contact,
            address: data.address,
            photoUrl: data.photoUrl,
         };
         users.push(newUser);
         console.log(users);
         fs.writeFile("users.json", JSON.stringify(users), (err) => {
            if (err) {
               res.send({ error: "There was an error adding the user!" });
            } else {
               res.send({ message: "Successfully added the user!" });
            }
         });
      } else {
         res.send({
            message:
               "You must provide the data of all the properties(gender, name, contact, address, photoUrl) through the body to save the user",
         });
      }
   }
};

// Update A User Controller
module.exports.updateAUser = (req, res) => {
   const userId = req.params.id;
   const updatedData = req.body;
   const updatedDataKeys = Object.keys(updatedData);
   const usersDataKeys = Object.keys(users[0]);

   const selectedUser = users.find((user) => user.id === parseInt(userId));
   if (!selectedUser) {
      res.status(404).send({
         status: "Error",
         message: "User not found!",
      });
   } else if (updatedDataKeys.every((key) => usersDataKeys.includes(key))) {
      updatedDataKeys.forEach((key) => {
         selectedUser[key] = updatedData[key];
      });
      fs.writeFile("users.json", JSON.stringify(users), (err) => {
         if (err) {
            res.send({
               error: "Something went wrong while writing the json file",
            });
         } else {
            res.status(200).send({
               status: "success",
               message: "User has been updated successfully.",
            });
         }
      });
   } else {
      res.status(400).send({
         status: "Error",
         message: "Please provide the valid property value!",
      });
   }
};

// Update Bulk User Controller
module.exports.updateBulkUser = (req, res) => {
   const userIds = req.body.id;
   const updatedData = req.body.data;
   if (userIds.length === updatedData.length) {
      const usersData = updatedData.map((user, index) => {
         user.id = userIds[index];
         return user;
      });

      let selectedUsers = [];

      for (let i = 0; i < usersData.length; i++) {
         const userData = usersData[i];

         for (let j = 0; j < users.length; j++) {
            const user = users[j];
            if (user.id === userData.id) {
               Object.keys(userData).forEach((key) => {
                  user[key] = userData[key];
               });
            }
         }
      }
      fs.writeFile("users.json", JSON.stringify(users), (err) => {
         if (err) {
            res.send({
               error: "Something went wrong while writing the json file",
            });
         } else {
            res.status(200).send({
               status: "success",
               message: "Users has been updated successfully.",
            });
         }
      });
   } else {
      res.send({ message: "Id and data counts should be same" });
   }
};

// Delete User Controller
module.exports.deleteUser = (req, res) => {
   const id = req.params.id;
   const index = users.findIndex((obj) => obj.id === parseInt(id));
   console.log(index);
   if (index > -1) {
      users.splice(index, 1);
      fs.writeFile("users.json", JSON.stringify(users), (err) => {
         if (err) {
            res.send({
               status: "Error",
               message: "There was an error deleting the user!",
            });
         } else {
            res.status(200).send({
               status: "success",
               message: "User deleted successfully.",
            });
         }
      });
   } else {
      res.status(404).send({
         status: "Error",
         message: "User not found!",
      });
   }
};
