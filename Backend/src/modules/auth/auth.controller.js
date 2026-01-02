import * as authService from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(
      req.body.email,
      req.body.password
    );
    res.json(result);
  } catch (err) {
    err.status = 401;
    next(err);
  }
};

export const checkEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const isAvailable = await authService.checkEmailAvailability(email);
    res.json({ 
      available: isAvailable, 
      message: isAvailable ? 'Email is available' : 'Email is already registered'
    });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};
