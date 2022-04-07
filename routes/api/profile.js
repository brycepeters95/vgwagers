const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Bank = require('../../models/Bank');
const TeamWager = require('../../models/TeamWager');
const { avataruploadaws } = require('../../s3/avataruploadaws');
const multer = require('multer');
const upload = multer();

const { deleteOldAvatar } = require('../../s3/deleteavatar');


// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['username', 'avatar', 'won', 'lost']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
 

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post('/', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
console.log(req.body,'req.body')
  const { formDataSelf, password,newPassword,confirmPassword } = req.body;
  const bio = formDataSelf.bio;
  const twitter = formDataSelf.twitter;
  const youtube = formDataSelf.youtube;
  const instagram = formDataSelf.instagram;
  const pc = formDataSelf.pc;
  const xbox = formDataSelf.xbox;
  const playstation = formDataSelf.playstation


 console.log(bio,'bio', twitter, 'twitter', pc, 'pc')

  //profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (bio) profileFields.bio = bio;
  // if (ssn) profileFields.ssn = ciper;
  // if (mailingAddress) profileFields.mailingAddress = mailingAddress;
  //social site objects
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (instagram) profileFields.social.instagram = instagram;

  profileFields.gamertags = {};
  if (pc) profileFields.gamertags.pc = pc;
  if (xbox) profileFields.gamertags.xbox = xbox;
  if (playstation) profileFields.gamertags.playstation = playstation;

  try {
    const user = await User.findOne({_id: req.user.id});
   
    if(password.length !== 0){
     const isMatch = await bcrypt.compare(password, user.password);
     console.log(isMatch);
     if (!isMatch) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Invalid Current Password',
          },
        ],
      });
    }
    if(newPassword !== confirmPassword){
      return res.status(400).json({
        errors: [
          {
            msg: 'new Password and confirm passwords do not match',
          },
        ],
      });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    }
    await user.save();

    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }
    // create profile
    profile = new Profile(profileFields);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', [
      'username',
      'avatar',
    ]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['username', 'avatar', 'won', 'lost']);

    if (!profile) return res.status(400).json({ msg: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/profile
// @desc     Delete profile, user 
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username');
    const wagers = await TeamWager.find({
      $and: [
        {
          $or: [
            {
              homeTeamDecision: {
                $elemMatch: {
                  username: user.username,
                },
              },
            },

            {
              awayTeamDecision: {
                $elemMatch: {
                  username: user.username,
                },
              },
            },
          ],
        },
        { statuses: { $elemMatch: { user: user.username, accepted: true } } },
      ],
    });
    const userBankBalance = await Bank.findOne({ user: req.user.id}).select('balance');
    if (userBankBalance.balance !== 0) {
      return res.status(400).json({
        errors: [
          {
            msg: 'There is still money in your bank. Please request a payout before deleting your account.',
          },
        ]
      });
    }
    if (wagers.length !== 0) {
      return res.status(400).json({
        errors: [
          {
            msg: "cant delete your account you are still in a wager",
          },
        ]
      });
    }

    // Remove bank
    await Bank.findOneAndRemove({ user: req.user.id});
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/uploadAvatar', avataruploadaws.single('upload'), auth, async(req, res) => {
  try {
    let location = '';
    let user = await User.findById(req.user.id).select('avatar');
    console.log(user);

    if (req.file) {
      location = req.file.location;
      deleteOldAvatar(user.id);
      user.avatar = location;
    }

    await user.save();
    res.status(200).send('OK');

  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }

});

module.exports = router;
