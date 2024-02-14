const UserModel = require("../models/user.model");

const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findOne({id:id});
    if (user) {
      res.status(200).json({ msg: "Open", user: user });
    } else {
      res.status(200).json({ msg: "Add" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


const addUser=async(req,res)=>{
   const { id, name, email, phone, website, city, company } = req.body;
   try {
     const newUser = new UserModel({
       id: id,
       name: name,
       email: email,
       phone: phone,
       website: website,
       city: city,
       company: company,
     });
     await newUser.save()
     res.status(201).json({ msg: "Open", user: newUser });
   } catch (error) {
     res.status(400).json({ msg: error.message });
   }
}


module.exports = { getUser ,addUser};
