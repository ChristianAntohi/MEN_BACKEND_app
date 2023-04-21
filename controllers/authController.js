const User =  require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const cookies = req.cookies;
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo":{
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '60s'}
        );
        const newRefreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        );


        let newRefreshTokenArray = !cookies?.jwt 
        ? foundUser.refreshToken
        : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);
        if (cookies?.jwt) { 

            //reuse detection
            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken}).exec();
            
            //detected refresh token reuse!
            if(!foundToken) {

                console.log('attempted refresh token reuse at login')
                //clear out all previous refresh tokens
                newRefreshTokenArray = [];

            }

            res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
    }


        //saving refreshtoken with current user 
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();
        console.log(result);
        console.log(roles);

        //Create Secure cookie with refresh token
        res.cookie('jwt', newRefreshToken, {httpOnly: true, sameSite: 'None', maxAge: 24*60*60*1000});

        //Send authorization roles and acces token to user
        res.json({roles, accessToken});
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };