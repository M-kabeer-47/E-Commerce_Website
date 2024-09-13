
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
dotenv.config();
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"hp/auth/google/callback",
    
    
},async (accessToken,refreshToken,profile,done)=>{
    User.findOne({email:profile._json.email}).then(async (currentUser)=>{
        const token = jwt.sign({

            email:profile._json.email,
        
            },process.env.JWT_SECRET
               
            
        )

            
            
        if(currentUser){

            console.log("Hello");
            
             return done(null,{token});
        }
        else{
            const password = profile.id+profile._json.email.substring(0,4);
            const genSalt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,genSalt)

            await new User({
                email:profile._json.email,
                firstName:profile._json.given_name,
                lastName:profile._json.family_name,
                password:hashedPassword,
            
                platform:"Google",
                cart:[],
                wishlist:[],
            }).save().then((newUser)=>{
                return done(null,{token});
                
                
                
            })
        }
    }
    )
}
))
passport.serializeUser((user,done)=>{
    done(null,user);
    
}
)
passport.deserializeUser((user,done)=>{
    done(null,user);
}
)   
export default passport;