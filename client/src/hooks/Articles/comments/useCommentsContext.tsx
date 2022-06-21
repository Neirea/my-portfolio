import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
	useCallback,
} from "react";
import type { ICommentState, ICommentError } from "../../../types/articleTypes";

interface commentsContextValues {
	articleId: string | undefined;
	commentState: ICommentState;
	setCommentState: Dispatch<SetStateAction<ICommentState>>;
	commentError: ICommentError;
	setCommentError: Dispatch<SetStateAction<ICommentError>>;
	resetCommentState: () => void;
}

export const CommentsContext = createContext({} as commentsContextValues);

const initialCommentState: ICommentState = {
	type: "none",
	id: null,
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

	const resetCommentState = useCallback(() => {
		setCommentState(initialCommentState);
		setCommentError(initialCommentError);
	}, [setCommentState, setCommentError]);

	return (
		<CommentsContext.Provider
			value={{
				articleId,
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
