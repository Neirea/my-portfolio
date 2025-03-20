import crypto from "crypto";
import type { Request, Response } from "express";
import type { Profile as GithubProfile } from "passport-github2";
import type {
    Profile as GoogleProfile,
    VerifyCallback,
} from "passport-google-oauth20";
import app from "../app.js";
import CustomError from "../errors/index.js";
import User, { type User as TUser } from "../models/User.js";
import { randomUserName } from "../utils/randomUserName.js";
import { appConfig } from "../utils/appConfig.js";

export const failedLogin = (req: Request, res: Response): void => {
    res.status(401).redirect(`${appConfig.clientUrl}/login?error=login_failed`);
};

export const logout = (req: Request, res: Response): void => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                res.status(400).send("Unable to log out");
            }
        });
    }
    res.clearCookie("s_id", { domain: "neirea.com" });
    res.status(200).json({ msg: "Log out" });
};

const callbackFunction = (req: Request, res: Response): void => {
    const redirect = app.get("redirect") as string | undefined;
    app.set("redirect", undefined);

    if (!req.user) {
        throw new CustomError.BadRequestError(
            "Authentication error. User error!",
        );
    }
    if (req.session) {
        req.session.user = req.user.user as TUser;
        req.session.csrfToken = crypto.randomUUID();
    }
    if (!redirect) {
        res.redirect(`${appConfig.clientUrl}`);
        return;
    }

    res.redirect(`${appConfig.clientUrl}/${redirect}`);
};

export const githubCallback = (req: Request, res: Response): void => {
    callbackFunction(req, res);
};
export const googleCallback = (req: Request, res: Response): void => {
    callbackFunction(req, res);
};

export const loginGoogle = (
    req: Request,
    accessToken: string | undefined,
    refreshToken: string | undefined,
    profile: GoogleProfile,
    done: VerifyCallback,
): void => {
    void (async (): Promise<void> => {
        let user = await User.findOne({
            platform_id: profile.id,
            platform_type: "google",
        });
        const { id, name, displayName, _json } = profile;

        if (user) {
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
            if (changed) {
                await user.save();
            }
        } else {
            const isFirstAccount = (await User.countDocuments({})) === 0;
            user = await User.create({
                platform_id: id,
                platform_name: name?.givenName || randomUserName(),
                platform_type: "google",
                name: displayName || randomUserName(),
                roles: isFirstAccount ? ["admin", "user"] : ["user"],
                avatar_url: _json.picture,
            });
        }
        done(null, { user });
    })();
};

type GithubUserProfile = GithubProfile & {
    _json: {
        [key: string]: string;
    };
};

export const loginGithub = (
    accessToken: string | undefined,
    refreshToken: string | undefined,
    profile: GithubUserProfile,
    done: (err: any, id?: unknown) => void,
): void => {
    void (async (): Promise<void> => {
        let user = await User.findOne({
            platform_id: profile.id,
            platform_type: "github",
        });
        const { id, username, displayName, _json } = profile;

        if (user) {
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
            if (changed) {
                await user.save();
            }
        } else {
            const isFirstAccount = (await User.countDocuments({})) === 0;
            user = await User.create({
                platform_id: id,
                platform_name: username || randomUserName(),
                platform_type: "github",
                name: displayName || randomUserName(),
                roles: isFirstAccount ? ["admin", "user"] : ["user"],
                avatar_url: _json.avatar_url,
            });
        }
        done(null, { user });
    })();
};
