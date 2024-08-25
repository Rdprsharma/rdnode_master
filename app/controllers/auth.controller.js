const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Video = db.video;
const mongoose = require('mongoose');

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rudrasharmaup52@gmail.com',
    pass: 'jyaudsktyesvymcc',
  },
});

exports.signup = (req, res) => {
  
  const gpassword = generatePassword(req.body.firstname, req.body.lastname, req.body.mobile);
  console.log("gpassword",gpassword);
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    mobile:req.body.mobile,
    password: bcrypt.hashSync(gpassword, 8)
  });
  
  
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }else{
      const mailOptions = {
        from: 'rudrasharmaup52@gmail.com',
        to: user.email,
        subject: 'User Password',
        text: `Hi ${user.firstname},\n\n Your account has been successfully created.\n\nYour password is: ${gpassword}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(500).send({ message: error });
        } else {
          res.send({ message: "User was registered successfully!"});
        }
      });
      
    }
  });
};

exports.signin = async (req, res) => {
  const user = await User.findOne({
    firstname: req.body.firstname
  });
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      const token = jwt.sign({ id: user.id },
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: 86400, // 24 hours
                              });
      user.token = token;
      await user.save();
      res.status(200).send({
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        mobile: user.mobile,
        accessToken: token
      });
};

exports.updateBio = async (req, res) => {
  try {
    const { user_id, bio } = req.body;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    user.bio = bio;
    await user.save();
    res.send({ message: 'Bio updated successfully!' });
  } catch (error) {
    res.status(500).send({ message: 'Error updating bio', error: error.message });
  }
};

exports.uploadVideo = (req, res) => {
  try {
  const video = new Video({
    title: req.body.title,
    description: req.body.description,
    video: req.file.path,
    user_id: req.body.user_id
  });
  video.save((err, savedVideo) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: 'Data created successfully!', video: savedVideo });
  });
} catch (error) {
  res.status(500).send({ message: 'Error updating bio', error: error.message });
}
};

exports.getvideoDetails = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const result = await User.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(user_id) } 
      },
      {
        $lookup: {
          from: 'uservideos', 
          localField: '_id',
          foreignField: 'user_id',
          as: 'videos'
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(404).send({ message: "No videos found for this user." });
    }

    const response = result[0]; 

    res.status(200).json(response);

  } catch (error) {
    res.status(500).send({ message: error.message || "Server error" });
  }
};


exports.getAllData= async(req,res) => {
  try {
    const users = await User.find();
    const videos = await Video.find();
    const usersWithVideos = users.map(user => ({
      ...user.toObject(),
      videos: videos.filter(video => video.user_id.toString() === user._id.toString())
    }));
    res.status(200).json(usersWithVideos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

function getRandomCharacters(str, length) {
  let result = '';
  for (let i = 0; i < length; i++) {
      result += str.charAt(Math.floor(Math.random() * str.length));
  }
  return result;
}

function generatePassword(firstname, lastname, number) {
  const firstNamePart = getRandomCharacters(firstname, 3);
  const lastNamePart = getRandomCharacters(lastname, 3);
  const numberPart = getRandomCharacters(number.toString(), 3);

  return `${firstNamePart}${lastNamePart}${numberPart}`;
}