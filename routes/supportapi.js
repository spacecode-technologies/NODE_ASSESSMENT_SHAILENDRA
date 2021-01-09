const express = require('express');
const session = require('express-session');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let router 	= express.Router();

let userSchema = require('../model/users');
let addressSchema = require('../model/address');
let companySchema = require('../model/company');

router.use(session({
	secret: 'somerandonstuffs',
	resave: false,
	saveUninitialized: false,
	cookie: { expires: 6000000 }
}));

/* userRegister API */
router.post('/userRegister', async (req, res, next) => {
    if (!req.body.first_name || !req.body.email || !req.body.phone_number || !req.body.password || !req.body.confirm_password || !req.body.house_no || !req.body.street_address || !req.body.city || !req.body.pin_code || !req.body.company_name || !req.body.company_email || !req.body.company_phone || !req.body.company_address) {
        return res.status(400).json({ success: false, message: "Required field can not be empty" });
    }

    let  first_name = req.body.first_name;
    let  last_name = req.body.last_name;
    let  email = req.body.email;
    let  phoneNnumber = req.body.phone_number;
    let  password = req.body.password;
    let  confirmPassword = req.body.confirm_password;
    
    if (password !==confirmPassword) {
        res.json({ message: "Password and confirm password must be same!!" });
    }
    if (email) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		var results = re.test(email)
		if (results == false) {
			return res.json({success: false, message: "Invalid Email Id"});
		}
    }
    const checkPhone = await userSchema.find({"phone_number": phoneNnumber });
	if (checkPhone.length > 0) {
		return res.json({ success: false, message: "phone number already exists!" });
    }
    const checkEmail = await userSchema.find({"email": email });
	if (checkEmail.length > 0) {
		return res.json({ success: false, message: "email already exists!" });
	}
	if (phoneNnumber.length!=10) {
		res.json({ success: false, message: "phone number must be enter 10 Digit"});
		return;
	}
	if(isNaN(phoneNnumber)||phoneNnumber.indexOf(" ")!=-1) {
		res.json({ success: false, msg: "invalid phone number enter valid digit" });
        return false;
    }
    
    else {
        bcrypt.hash(password, 8, function(err, hash) {
            if(err) {
              return  res.json({success: false, message: "Somthing wrong Try Later", error: err}); 
            }
            else {
                let userDetails = new userSchema({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    phone_number: phoneNnumber,
                    password: hash
                })
                userDetails.save().then(doc => {
                    let addressDetails = new addressSchema({
                        user_id: doc._id,
                        house_no: req.body.house_no,
                        street_address: req.body.street_address,
                        city: req.body.city,
                        pin_code: req.body.pin_code
                    })
                    addressDetails.save()

                    let companyDetails = new companySchema({
                        user_id: doc._id,
                        company_name: req.body.company_name,
                        company_email: req.body.company_email,
                        company_phone: req.body.company_phone,
                        company_address: req.body.company_address
                    })
                    companyDetails.save()
                    res.status(201).json({
                        success: true,
                        message: "User Registered Successfully ",
                        data:doc
                    });
                }).catch(err => {
                    console.log(err)
                    res.json(err);
                });
            }
        });
    }
});

/* userLogin API */
router.post('/userLogin', async (req, res, next) => {
    console.log('-> call function Login');
    let  email = req.body.email;
    
    userSchema.find({email: email})
    .exec()
    .then(user => {
        if (user.length<1) {
            return res.status(404).json({success: false, message: 'Auth Failed.'});
        }
        else {
            bcrypt.compare(req.body.password, user[0].password, function(err, result) {
                if(err) {
                    return res.status(404).json({success: false, message: 'Auth Failed.'});
                }
                if(result) {
                    let token = jwt.sign(
                        {
                            email: user[0].email,
                            user_id: user[0]._id,
                        },
                        'secret',
                        {
                            expiresIn: "2h"
                        }
                    );
                    return res.status(200).json({success: true, message: 'User Found', token: token});
                }
                else {
                    return res.status(404).json({success: false, message: 'Auth Failed.'});
                }
            }); 
        }  
    }).catch(err => {
        console.log(err);
        res.json({error: err});
    })
});

/* Token Info API */
router.post('/info', async (req, res) => {
    let token = req.body.token;
    jwt.verify(token, 'secret', function(err, decoded) {
        if(!err){
            return res.status(200).json({success: true, details: decoded});
        }
        else
        {
            return res.status(400).json({success: false, message: "jwt token are explained"});
        }
    });
});

/* getUserById API */
router.post('/getById', async (req, res, next) => {
    let token = req.body.token;
    
    var decoded = jwt.verify(token, 'secret');
    const user = await userSchema.find({"_id": decoded.user_id})
	.select('first_name last_name email phone_number')
	if (user != undefined && user.length > 0) {
		return res.status(200).json({success: true, data: user });
	}
	else {
		return res.status(400).json({success: false, msg:"No user found"});
	}
});

/* Update List API */
router.get('/getAllUser', async (req, res, next) => {
    await userSchema.find({}).exec().then(doc => {
		if (doc != undefined && doc.length > 0) {
			res.status(200).json({success: true, message : 'users List', data: doc});
		}
		else {
			return res.status(400).json({success: false, success:"No user found"});
		}
	}).catch(err => {
		console.log(err);
		res.status(500).json({ error: err });
	});
});

/* Update User API */
router.post('/updateById', async (req, res) => {
	const user = await userSchema.findOne({_id : req.body.user_id});
	if(user) {
		let editUser = await userSchema.update({_id : req.body.user_id},
			{ $set : {
				first_name : req.body.first_name,
				last_name : req.body.last_name,
				email : req.body.email,
				phone_number : req.body.phone_number,
				created_at : new Date().getTime()
			}
		});
		return res.status(200).json({success: true, msg : 'update details successfully'});
    return;
	}
	else {
		return res.status(400).json({success: false, error_msg:"User not found."});
	}
});

/* Delete user API */
router.delete('/deleteById/:id', async (req, res) => {
    try {
        const user = await userSchema.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(400).json({success: false, success:"No user found"});
        }
        else {
            return res.status(200).json({success: true, message:"user deleted Successfully"});
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({success: false, error: err})
    }
});

module.exports = router;