import { v2 as cloudinary } from "cloudinary";
import type { Request, Response } from "express";
import type { UploadedFile } from "express-fileupload";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import sanitizeHtml from "sanitize-html";
import CustomError from "../errors";
import Article from "../models/Article";

const sanitizeOptions = {
    allowedIframeHostnames: ["www.youtube.com"],
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "iframe"]),
    allowedAttributes: {
        iframe: ["src"],
        a: ["href", "name", "target"],
        img: [
            "src",
            "srcset",
            "alt",
            "title",
            "width",
            "height",
            "loading",
            "style",
        ],
        span: ["style"],
    },
};

export const getAllArticles = async (req: Request, res: Response) => {
    //gets category based on url of get request
    let getCategory = req.url.toString().replace("/", "");

    const articles = await Article.find(
        !getCategory ? {} : { category: `${getCategory}` }
    ).sort({ createdAt: "descending" });
    if (!articles.length) {
        throw new CustomError.NotFoundError(`No ${getCategory}s found`);
    }
    res.status(StatusCodes.OK).json({ articles });
};

export const getSingleArticle = async (req: Request, res: Response) => {
    const { id: articleId } = req.params;
    const article = await Article.findOne({ _id: articleId });
    if (!article) {
        throw new CustomError.NotFoundError(
            `No article with id : ${articleId}`
        );
    }
    res.status(StatusCodes.OK).json({ article });
};

export const createArticle = async (req: Request, res: Response) => {
    try {
        const newArticle = {
            ...req.body,
            content: sanitizeHtml(req.body.content, sanitizeOptions),
        };
        const article = await Article.create(newArticle);
        res.status(StatusCodes.CREATED).json({ article });
    } catch (error) {
        //delete uploaded image if creation has failed
        await cloudinary.uploader.destroy(req.body.img_id);
        throw new CustomError.BadRequestError("Failed to create article");
    }
};

export const updateArticle = async (req: Request, res: Response) => {
    const { id: articleId } = req.params;

    const article = await Article.findOne({ _id: articleId });

    if (!article) {
        throw new CustomError.NotFoundError(
            `No article with id : ${articleId}`
        );
    }

    const currentImgId = article.img_id;

    const newArticle = {
        ...req.body,
        content: sanitizeHtml(req.body.content, sanitizeOptions),
    };
    //assigns newArticle values to article
    Object.assign(article, newArticle);

    article
        .save()
        .then(async () => {
            //delete deprecated image on success
            if (article.img_id !== currentImgId) {
                await cloudinary.uploader.destroy(currentImgId);
            }
            res.status(StatusCodes.OK).json({ article });
        })
        .catch(async () => {
            //delete uploaded image if update has failed
            if (req.body.img_id !== currentImgId) {
                await cloudinary.uploader.destroy(req.body.img_id);
            }
            res.status(StatusCodes.BAD_REQUEST).json({
                msg: "Failed to update an article",
            });
        });
};

export const deleteArticle = async (req: Request, res: Response) => {
    const { id: articleId } = req.params;

    const article = await Article.findOne({ _id: articleId });
    if (!article) {
        throw new CustomError.NotFoundError(
            `No article with id : ${articleId}`
        );
    }
    await cloudinary.uploader.destroy(article.img_id);

    await article.deleteOne();

    res.status(StatusCodes.OK).json({ msg: "Success! Article is removed" });
};

//upload image to cloudinary
export const uploadArticleImage = async (req: Request, res: Response) => {
    const imageFile = req.files?.image as UploadedFile;
    if (!imageFile) {
        throw new CustomError.BadRequestError("Image was not attached");
    }

    const result = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        transformation: [
            {
                width: 1280,
                height: 720,
                crop: "fill",
            },
            {
                fetch_format: "webp",
            },
        ],

        folder: "portfolio",
    });
    fs.unlinkSync(imageFile.tempFilePath);
    res.status(StatusCodes.OK).json({
        image: { src: result.secure_url, img_id: result.public_id },
    });
};
