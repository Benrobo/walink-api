const User = require("../models/Users.model");
const sendResponse = require("../helpers/response")
const { validateEmail, validatePhonenumber } = require("../helpers/validate")
const { compareHash, genHash, genId } = require("../helpers")
const { genRefreshToken , genAccessToken} = require("../helpers/token")

class AuthController{
  async login(res, payload) {
        if (res === undefined) {
            throw new Error("expected a valid 'res' object but got none ");
        }
        if (Object.entries(payload).length === 0) {
            return sendResponse(
                res,
                400,
                false,
                "failed to log In, missing payload."
            );
        }

        const { email, password } = payload;

        if (email === "") {
            return sendResponse(res, 400, false, "email is missing");
        }

        if (password === "") {
            return sendResponse(res, 400, false, "password is missing");
        }

        if (!validateEmail(email))
            return sendResponse(res, 400, false, "email given is invalid");

        // check if user with this email address already exists
        const userExistsResult = await User?.find({ email });

        if (userExistsResult.length === 0)
            return sendResponse(
                res,
                404,
                false,
                "Invalid credentials."
            );

        // check if password is correct
        const userData = await User.findOne({ email });

        if (!compareHash(password, userData?.hash))
            return sendResponse(res, 400, false, "Invalid Credentials");

        try {
            const userPayload = {
                id: userData?.id,
                username: userData?.username,
                email: userData?.email,
            };
            const refreshToken = genRefreshToken(userPayload);
            const accessToken = genAccessToken(userPayload);

            const filter = { email };
            const update = { token: refreshToken };

            await User.findOneAndUpdate(filter, update);

            return sendResponse(res, 201, true, "Logged In successful", {
                ...userPayload,
                accessToken,
            });
        } catch (e) {
            console.log(e);
            sendResponse(res, 500, false, "something went wrong logging in", {
                error: e.message,
            });
        }
    }
  
  async register(res, payload){
    if (res === undefined) {
            throw new Error("expected a valid 'res' object but got none ");
        }
    if (Object.entries(payload).length === 0) {
            return sendResponse(
                res,
                400,
                false,
                "failed to log In, missing payload."
            );
        }

    const { email, password, name } = payload;

    if (email === "") {
            return sendResponse(res, 400, false, "email is missing");
        }

    if (password === "") {
            return sendResponse(res, 400, false, "password is missing");
        }
        
    if (name === "" || typeof name === "undefined") {
          return sendResponse(res, 400, false, "name is missing");
        }

    if (!validateEmail(email))
      return sendResponse(res, 400, false, "email given is invalid");

    // check if user with this email address already exists
    const userExistsResult = await User.find({ email });

    if (userExistsResult.length > 0)
        return sendResponse(
            res,
            404,
            false,
            "User with this email address already exists."
        );

    try {
        const userPayload = {
            id: genId(),
            name: name,
            email: email,
            hash: genHash(password), 
        };
        
        await User.create(userPayload)
        
        return sendResponse(res, 201, true, "Register successful");
    } catch (e) {
        console.log(e);
        sendResponse(res, 500, false, "something went wrong registering ", {
            error: e.message,
        });
    }
    }
  
}

module.exports = AuthController