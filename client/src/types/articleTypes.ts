import { Dispatch, SetStateAction } from "react";

export enum ACTIONS {
	reply = "reply",
	edit = "edit",
	none = "none",
}

export enum categoriesEnum {
	blog = "blog",
	project = "project",
}

export interface IArticle {
	title: string;
	content: string;
	category: categoriesEnum;
	code_languages: string[];
	source_link: string;
	demo_link: string;
	tags: string[];
	image: string;
	img_id: string;
	userId: number;
	_id: number;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface IComment {
	articleId: number;
	parentId: number;
	message: string;
	replies: IComment[];
	user: {
		id: number;
		name: string;
		isBanned: boolean;
	};
	_id: number;
	createdAt: string;
	editedAt: string;
}

export interface IJsxComment {
	level: number;
	comment: IComment;
}

export interface IArticleData {
	title: string;
	category: string;
	_id: number;
}

export interface ICommentState {
	type: ACTIONS;
	id: number | null;
	message: string;
}

export interface IUploadedImageResponse {
	image: { src: string; img_id: string };
}

export interface IArticleValues {
	title: string;
	category: categoriesEnum;
	demo_link: string;
	source_link: string;
	content?: string;
	image?: string;
	img_id?: string;
	userId?: number;
}

export interface ArticleContextValues {
	alert: {
		show: boolean;
		text: string;
		type: string;
	};
	showAlert: ({
		text,
		type,
	}: {
		text: string;
		type?: string | undefined;
	}) => void;
	hideAlert: () => void;
	loading: boolean;
	setLoading: Dispatch<SetStateAction<boolean>>;
	articleId: string | null;
	article: IArticle | null;
	comments: IJsxComment[];
	setComments: Dispatch<SetStateAction<IJsxComment[]>>;
	commentState: ICommentState;
	setCommentState: Dispatch<SetStateAction<ICommentState>>;
	articlesData: IArticleData[];
}
