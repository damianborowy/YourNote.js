import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/User";

const userController = {
    async register(req: Request, res: Response) {
        let user = await User.findOne({ email: req.body.email });
        if (user)
            return res
                .status(400)
                .send("User with this e-mail address already exists.");

        user = new User({
            email: req.body.email,
            password: await bcryptjs.hash(req.body.password, 10)
        });

        try {
            await user.save();
            res.status(200).send(`Successfuly registered user ${user.email}.`);
        } catch (e) {
            res.status(400).send("Unable to register a new user.");
        }
    },

    async login(req: Request, res: Response) {
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res
                .status(400)
                .send("User with this e-mail address doesn't exist.");

        const isPasswordCorrect = await bcryptjs.compare(
            req.body.password,
            user.password
        );

        if (!isPasswordCorrect)
            return res.status(400).send("Incorrect password.");

        const jwt_secret = process.env.JWT_SECRET;
        if (!jwt_secret)
            return res
                .status(500)
                .send("Environmental variable JWT_SECRET is missing.");

        res.status(200).send(
            jwt.sign(
                { _id: user._id, email: user.email, role: user.role },
                jwt_secret
            )
        );
    },

    async checkIfEmailExists(req: Request, res: Response) {
        const user = await User.findOne({ email: req.params.email });

        if (!user)
            return res
                .status(400)
                .send("User with this e-mail address doesn't exist.");

        res.status(200).send(user.email);
    },

    async readAll(req: Request, res: Response) {
        const users = await User.find().select("email role");

        if (!users) return res.status(400).send("No users were found.");

        res.status(200).send(users);
    },

    async create(req: Request, res: Response) {
        let user = await User.findOne({ email: req.body.email });
        if (user)
            return res
                .status(400)
                .send("User with this e-mail address already exists.");

        user = new User({
            email: req.body.email,
            password: await bcryptjs.hash(req.body.password, 10)
        });

        try {
            const { email, role } = await user.save();
            const newUser = { email, role };

            res.status(200).send(newUser);
        } catch (e) {
            res.status(400).send("Unable to register a new user.");
        }
    },

    async updateRole(req: Request, res: Response) {
        const user = await User.findOneAndUpdate(
            { email: req.body.email },
            { role: req.body.role }
        );

        if (!user)
            return res
                .status(400)
                .send("User with provided email doesn't exist.");

        res.status(200).send(`Modified user ${user.email} successfully.`);
    },

    async delete(req: Request, res: Response) {
        const email = req.params.email;

        const deletionInfo = await User.deleteOne({ email });

        deletionInfo.deletedCount === 1
            ? res.status(200).send("Successfully deleted user.")
            : res.status(400).send("Bad request.");
    },

    async getViews(req: Request, res: Response) {
        const token = jwt.decode(req.token!);
        // @ts-ignore
        const owner = token["email"];

        const user = await User.findOne({ email: owner });

        if (!user) return res.status(400).send("Invalid user");

        res.status(200).send(user.views);
    },

    async updateViews(req: Request, res: Response) {
        const { views } = req.body;

        const token = jwt.decode(req.token!);
        // @ts-ignore
        const owner = token["email"];

        const user = await User.findOne({ email: owner });

        if (!user) return res.status(400).send("Invalid user");

        user.views = views;
        await user.updateOne(user);

        return res.status(200).send(views);
    }
};

export default userController;
