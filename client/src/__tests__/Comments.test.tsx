import { render, screen, act } from "@testing-library/react";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Comments from "../pages/Articles/articleComponents/Comments/Comments";
import { BrowserRouter } from "react-router-dom";
import { AppContext } from "../store/AppContext";
import { CommentsProvider } from "../hooks/Articles/comments/useCommentsContext";
import { QueryClient, QueryClientProvider } from "react-query";

import MockAdapter from "axios-mock-adapter";
import type { AppContextValues, IUser } from "../types/appTypes";
import type { IComment } from "../types/articleTypes";

const mock = new MockAdapter(axios);

describe("Comments", () => {
	test("Should get comment, reply to it, delete first new comment correctly and then delete tree of comments", async () => {
		//data received after login
		const fakeUser = {
			name: "Yevhenii Shumilin",
			_id: "111",
			roles: ["admin", "user"],
			isBanned: false,
		} as IUser;

		const fakeComment: IComment = {
			articleId: "123",
			message: "test message",
			replies: [],
			parentId: "",
			user: {
				id: fakeUser._id,
				name: fakeUser.name,
				avatar: "image",
			},
			_id: "456",
			createdAt: new Date().toString(),
			editedAt: new Date().toString(),
		};
		const fakeReply: IComment = {
			articleId: fakeComment.articleId,
			message: "FAKE REPLY",
			replies: [],
			parentId: "456",
			user: fakeComment.user,
			_id: "789",
			createdAt: new Date().toString(),
			editedAt: new Date().toString(),
		};
		const fakeReplyEdit: IComment = {
			articleId: fakeReply.articleId,
			message: "message was edited",
			replies: [],
			parentId: fakeReply.parentId,
			user: fakeReply.user,
			_id: fakeReply._id,
			createdAt: fakeReply.createdAt,
			editedAt: new Date(Date.now() + 1000 * 60 * 3).toString(), //3minutes into future
		};

		const queryClient = new QueryClient();

		mock
			.onGet(`/api/comment/${fakeComment.articleId}`)
			.reply(200, { comments: [fakeComment] });

		render(
			<BrowserRouter>
				<QueryClientProvider client={queryClient}>
					<AppContext.Provider value={{ user: fakeUser } as AppContextValues}>
						<CommentsProvider value={{ articleId: fakeComment.articleId }}>
							<Comments />
						</CommentsProvider>
					</AppContext.Provider>
				</QueryClientProvider>
			</BrowserRouter>
		);

		expect(
			await screen.findByRole("heading", { name: /loading comments.../i })
		).toBeInTheDocument();
		expect(
			await screen.findByRole("heading", { name: /comments\(1\):/i })
		).toBeInTheDocument();

		//reply to comment
		mock
			.onPost(`/api/comment/${fakeComment.articleId}`)
			.reply(200, { comment: fakeReply });
		mock
			.onGet(`/api/comment/${fakeComment.articleId}`)
			.reply(200, { comments: [fakeComment, fakeReply] });
		userEvent.click(
			screen.getByRole("button", { name: /reply to #0 comment/i })
		); //click reply button on comment #1
		const replyForm = screen.getByRole("textbox", {
			name: /reply to: yevhenii shumilin/i,
		});
		userEvent.type(replyForm, "reply message");

		//submit reply
		await act(
			async () =>
				await userEvent.click(screen.getByRole("button", { name: /submit/i }))
		);
		expect(
			await screen.findByRole("heading", { name: /comments\(2\):/i })
		).toBeInTheDocument();

		// editing submitted reply
		mock
			.onPatch(`/api/comment/${fakeComment.articleId}/${fakeReply._id}`)
			.reply(200, { comment: fakeReplyEdit });
		mock
			.onGet(`/api/comment/${fakeComment.articleId}`)
			.reply(200, { comments: [fakeComment, fakeReplyEdit] });
		userEvent.click(
			await screen.findByRole("button", { name: /edit #1 comment/i })
		);
		userEvent.clear(screen.getByRole("textbox"));
		userEvent.type(screen.getByRole("textbox"), "message was edited");
		//submit reply
		await act(
			async () =>
				await userEvent.click(screen.getByRole("button", { name: /submit/i }))
		);
		expect(screen.getByText(/message was edited/i)).toBeInTheDocument();

		//deleting comment
		fakeComment.message = "";
		mock
			.onDelete(`/api/comment/${fakeComment.articleId}/${fakeComment._id}`)
			.reply(200);
		mock
			.onGet(`/api/comment/${fakeComment.articleId}`)
			.reply(200, { comments: [fakeComment, fakeReplyEdit] });

		await act(
			async () =>
				await userEvent.click(
					screen.getByRole("button", { name: /delete #0 comment/i })
				)
		);
		expect(screen.getByText(/message was deleted/i)).toBeInTheDocument();

		//deleting tree of comments
		mock
			.onDelete(
				`/api/comment/${fakeComment.articleId}/d_all/${fakeComment._id}`
			)
			.reply(200);

		mock
			.onGet(`/api/comment/${fakeComment.articleId}`)
			.reply(200, { comments: [] });
		await act(
			async () =>
				await userEvent.click(
					screen.getByRole("button", { name: /delete tree of #0 comment/i })
				)
		);

		expect(
			screen.getByRole("heading", { name: /comments\(0\):/i })
		).toBeInTheDocument();
	});
});
