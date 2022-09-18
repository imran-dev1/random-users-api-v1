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
   const selectedUser = users.find((user) => user.id === parseInt(userId));
   if (!selectedUser) {
      res.status(404).send({
         status: "Error",
         message: "User not found!",
      });
   } else if (
      updatedData.gender &&
      updatedData.name &&
      updatedData.contact &&
      updatedData.address &&
      updatedData.photoUrl
   ) {
      selectedUser.name = updatedData.name;
      selectedUser.gender = updatedData.gender;
      selectedUser.contact = updatedData.contact;
      selectedUser.address = updatedData.address;
      selectedUser.photoUrl = updatedData.photoUrl;
      console.log(users);
      res.status(200).send({
         status: "success",
         message: "User has been updated successfully.",
      });
   } else {
      res.status(400).send({
         status: "Error",
         message: "Please provide all the values of the properties!",
      });
   }
};
