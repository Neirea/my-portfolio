import type { Request, Response } from "express";
import type { Profile as GithubProfile } from "passport-github2";
import type {
    Profile as GoogleProfile,
    VerifyCallback,
} from "passport-google-oauth20";
import app from "../app";
import CustomError from "../errors";
import User, { platformEnum, userRoles } from "../models/User";
import { randomUserName } from "../utils/randomUserName";
import crypto from "crypto";

const clientUrl =
    process.env.NODE_ENV !== "production"
        ? "http://localhost:5173"
        : "https://www.neirea.com";

export const failedLogin = (req: Request, res: Response) => {
    res.status(401).redirect(`${clientUrl}/login?error=login_failed`);
};

export const logout = (req: Request, res: Response) => {
    if (req.session) {
        //deletes from session from mongoDB too
        req.session.destroy((err) => {
            if (err) {
                res.status(400).send("Unable to log out");
            }
        });
    }
    res.clearCookie("s_id", { domain: "neirea.com" });
    res.status(200).json({ msg: "Log out" });
};

/* OAuth Callbacks */
const callbackFunction = (req: Request, res: Response) => {
    const redirect = app.get("redirect");
    app.set("redirect", undefined);

    if (!req.user) {
        throw new CustomError.BadRequestError(
            "Authentication error. User error!"
        );
    }
    if (req.session) {
        req.session.user = req.user.user;
        req.session.csrfToken = crypto.randomUUID();
    }

    // Successful authentication, redirect to page where user specifies username
    res.redirect(`${clientUrl}/${redirect}`);
};

export const githubCallback = (req: Request, res: Response) => {
    callbackFunction(req, res);
};
export const googleCallback = (req: Request, res: Response) => {
    callbackFunction(req, res);
};

/* login actions */
export async function loginGoogle(
    req: Request,
    accessToken: string | undefined,
    refreshToken: string | undefined,
    profile: GoogleProfile,
    done: VerifyCallback
) {
    let user = await User.findOne({
        platform_id: profile.id,
        platform_type: platformEnum.google,
    });
    const { id, name, displayName, _json } = profile;

    if (user) {
        //update profile if different
        let changed = false;
        if (_json.picture && user.avatar_url !== _json.picture) {
            user.avatar_url = _json.picture;
            changed = true;
        }
        if (name && user.platform_name !== name.givenName) {
            user.platform_name = name.givenName;
            changed = true;
        }
        if (displayName && user.name !== displayName) {
            user.name = displayName;
            changed = true;
        }
        changed && user.save();
    } else {
        const isFirstAccount = (await User.countDocuments({})) === 0;
        user = await User.create({
            platform_id: id,
            platform_name: name?.givenName || randomUserName(),
            platform_type: platformEnum.google,
            name: displayName || randomUserName(),
            roles: isFirstAccount ? Object.values(userRoles) : [userRoles.user],
            avatar_url: _json.picture,
        });
    }
    user = user.toObject();
    done(null, { user });
}

interface GithubUserProfile extends GithubProfile {
    _json: {
        [key: string]: string;
    };
}

export const loginGithub = async (
    accessToken: string | undefined,
    refreshToken: string | undefined,
    profile: GithubUserProfile,
    done: (err: any, id?: unknown) => void
) => {
    //check if user is in DB, if not -> create one
    let user = await User.findOne({
        platform_id: profile.id,
        platform_type: platformEnum.github,
    });
    const { id, username, displayName, _json } = profile;

    if (user) {
        //update profile if different
        let changed = false;
        if (_json.avatar_url && user.avatar_url !== _json.avatar_url) {
            user.avatar_url = _json.avatar_url;
            changed = true;
        }
        if (username && user.platform_name !== username) {
            user.platform_name = username;
            changed = true;
        }
        if (displayName && user.name !== displayName) {
            user.name = displayName;
            changed = true;
        }
        changed && user.save();
    } else {
        const isFirstAccount = (await User.countDocuments({})) === 0;
        user = await User.create({
            platform_id: id,
            platform_name: username || randomUserName(),
            platform_type: platformEnum.github,
            name: displayName || randomUserName(),
            roles: isFirstAccount ? ["admin", "user"] : ["user"],
            avatar_url: _json.avatar_url,
        });
    }
    user = user.toObject();
    done(null, { user });
};
