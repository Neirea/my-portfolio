import type { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import CustomError from "../errors";

const fetchResource =
    <T>(Model: Model<T>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const resource = await Model.findOne({ _id: req.params.id });

        if (!resource) {
            throw new CustomError.NotFoundError(
                `Resource not found with id: ${id}`
            );
        }
        req.fetchedData = resource;
        next();
    };

export default fetchResource;
