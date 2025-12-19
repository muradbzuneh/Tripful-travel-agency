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
