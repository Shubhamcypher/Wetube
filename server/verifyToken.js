import jwt from 'jsonwebtoken';
import refreshTokenModel from './model/refreshToken.model.js';
import { createError } from './error.js';

export const verifyToken = async (req, res, next) => {
    console.log("I am in verify token function");
    const token = req.cookies.access_token;
    console.log(token);

    if (!token) // this is the case when no token is found in cookies, it's not verified whether it is expired or not
        return next(createError(405, "No token found in cookies"));

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                console.log("The error is TokenExpiredError ");

                // Access token expired, check refresh token
                const refreshToken = req.cookies.refresh_token; // Get refresh token from the cookies
                if (!refreshToken) return next(createError(401, "No refresh token provided in cookies"));
                
                console.log("Refresh token is still in cookies");

                try {
                    console.log("The refresh token is: ", refreshToken);
                    console.log("Trying for decoded token");

                    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, async (err, user) => {
                        if (err.name === 'TokenExpiredError') {
                            await refreshTokenModel.findOneAndDelete({ token: refreshToken });
                            console.log("The expired refresh token from DB has been deleted");
                        } else {
                            console.log("Got decoded token");
                            const storedToken = await refreshTokenModel.findOne({ token: refreshToken });
                            console.log("Got stored token which is:");
                            console.log(storedToken);

                            if (!storedToken) {
                                console.log("I think we are not able to fetch stored token or if fetched it should have deleted");
                                return next(createError(401, "Invalid or expired refresh token"));
                            }
                            const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1m' });
                        }
                    });
                    res
                        .cookie("access_token", newAccessToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'None',
                        })
                        .status(200)
                        .json({ accessToken: newAccessToken });

                } catch (refreshError) {
                    return next(createError(401, "Invalid or expired refresh token"));
                }
            } else {
                return next(createError(400, "Token verification failed!!"));
            }
        } else {
            req.user = user;
            next();
        }
    });
};
