import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
	useCallback,
} from "react";
import {
	ICommentState,
	ICommentError,
	ACTIONS,
	IJsxComment,
} from "../../../types/articleTypes";
import { UseQueryResult } from "react-query";

import useComments from "./useComments";

interface commentsContextValues {
	articleId: string | undefined;
	commentsQuery: UseQueryResult<IJsxComment[], unknown>;
	commentState: ICommentState;
	setCommentState: Dispatch<SetStateAction<ICommentState>>;
	commentError: ICommentError;
	setCommentError: Dispatch<SetStateAction<ICommentError>>;
	resetCommentState: () => void;
}

export const CommentsContext = createContext({} as commentsContextValues);

const initialCommentState = {
	type: ACTIONS.none,
	id: null,
	message: "",
	index: undefined,
	error: "",
};
const initialCommentError = {
	index: undefined,
	msg: "",
};

export const CommentsProvider = ({
	children,
	value,
}: {
	value: { articleId: string | undefined };
	children: ReactNode;
}) => {
	const articleId = value.articleId;
	const [commentState, setCommentState] =
		useState<ICommentState>(initialCommentState);
	const [commentError, setCommentError] =
		useState<ICommentError>(initialCommentError);

	const commentsQuery = useComments(value.articleId);

	const resetCommentState = useCallback(() => {
		setCommentState(initialCommentState);
		setCommentError(initialCommentError);
	}, [setCommentState, setCommentError]);

	return (
		<CommentsContext.Provider
			value={{
				articleId,
				commentsQuery,
				commentState,
				setCommentState,
				commentError,
				setCommentError,
				resetCommentState,
			}}
		>
			{children}
		</CommentsContext.Provider>
	);
};

const useCommentsContext = () => {
	return useContext(CommentsContext);
};

export default useCommentsContext;
