//controller for authentication
import bcrypt from "bcrypt"; //for hashing the password
import userModel from "../modals/userModel.js"; //importing the user model
import jwt from "jsonwebtoken"; //for generating the token
imoport transporter from "../config/emailConfig.js" //for sending email

export const register = async (req, res) => {
  //details required for a user to register
  const { name, email, password } = req.body;

  //these fields are mendatory
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  //if all fields are present then move further

  try {
    const existingUser = await userModel.findOne({ email }); //checking if the user already exists in the database
    if (existingUser) {
      return res.status(400).json({ success: false, message: "user already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10); //hashing the password with salt rounds of 10
    //write this before so that we can save in db
    const newUser = new userModel({ name, email, password: hashedPassword }); //creating a new user
    await newUser.save();

    //generating a token for the user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "6d" }); //generating a token with the user id and secret key and expires in 1 day

    res.status(201).json({ success: true, message: "user registered successfully", token }); //sending the response to the client
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //only send cookie over https in production
      maxAge: 6 * 24 * 60 * 60 * 1000, //6 days
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    }); //setting the token in the cookie


    //send wlcoome email after registering 
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        sbject: "welcome",
        text: `welcome to our website , you created an account with email: ${email}`    
    }
        await transporter.sendMail(mailOptions) //sending the email to the user
        return res.status(201).json({ success: true, message: "user registered successfully", token }); //sending the response to the client
    

  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  //now we dont need for name
  const { email, password } = req.body;

  //these fields are mendatory
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "all fields are required" });
  }
  try {
    //find that user in db
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "user does not exist" });
    }
    //if user exists then compare the password with the hashed password in db
    const isPasswordCorrect = await bcrypt.compare(password, user.password); //comparing the password with the hashed password in db
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "invalid credentials" });
    }

    //if password is correct then generate a token for the user (with this user will be able ot login and access the protected routes)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "6d" }); //generating a token with the user id and secret key and expires in 6 days

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //only send cookie over https in production
      maxAge: 6 * 24 * 60 * 60 * 1000, //6 days
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    }); //setting the token in the cookie
    // CODE REMAINS SAME FOR TOKEN AND COOKIE
    res.status(200).json({ success: true, message: "user logged in successfully", token });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //only send cookie over https in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    }); //clearing the token from the cookie
    res.status(200).json({ success: true, message: "user logged out successfully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};


//send otp to user email

const sendVerifyOTP = async (req, res) =>{
    
// flow = get userID => check if user Exist => if UserExist => generate OTP => save OTP in DB => send OTP to user email
    try{
        const { userID } = req.body;

        const user = userModel.findById(userID);

        if(user.isAccountVerified){
            res.json({success: false, message: "Account is already verified"});
        }

        //otherwse generate otp

        const otp = String(Math.floor(100000 + Math.random() * 900000)); //generating a random 6 digit otp
        user.verifyOTP = otp;  //store in db, in future helps in verifuing the user
        user.verifyOTPExpireAt = Date.now() + 10 * 60 * 1000; //otp will expire in 10 minutes

        await user.save() //wait for these property values to save 
        

        //send mail for otp 
        mailOptions = {
            from:process.env.EMAIL_USER,
            to:user.email,
            subject: "verify your account",
            text: `your otp is ${otp} and it will expire in 10 minutes`
        }
        await transporter.sendMail(mailOptions) //sending mail
        res.json({success: true, message: "otp sent to your email"});


    }catch(err){
        res.json({success: false, message: err.message});
    }
}



//now logic for verifying user with otp 

export const verifyUserWithOTP = async(req, res) =>{
    //otp send to user and stored in db , after user input if both match , user verified
    

    const {userID, otp}= req.body;   //we cannot get this userID directly, as user will only enter the otp, we can get this with cookies for that we need a middleware 
     
    //check if userID and otp exist

    if(!userID || !otp){
        return res.json({success: false, message: "missing otp or userID"});
        //will return it because if not present we want the logic to end here
    }

    try{
        //find user
        const user = userModel.findById(userID);
        if(!user){
            return res.json({success: false, message: "user not found"});
        }

        //logic for , if otp doesnt match
        if(user.verifyOTP !== otp || user.verifyOTP === " "){
            return res.json({success: false, message: "invalid otp"});
        }

        //check whether otp expired or not
        if(user.expireOTPExpireAt < Date.now()){
            return res.json({success: f}alse, message: "otp expired"});
        }

        //everything is fine , now we can verify the user
        user.isAccountVerified = true;
        //reset the otp and expire time
        user.verifyOTP = " ";
        user.verifyOTPExpireAt = 0;
        

        //always remember to save changes

        await user.save();

        return res.json(success: true, message: "user verified successfully");
    }catch(err){
        return res.json({success: false, message: err.message});
    }
    
}
