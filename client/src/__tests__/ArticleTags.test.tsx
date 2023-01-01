import { render, screen, act } from "@testing-library/react";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import MockAdapter from "axios-mock-adapter";
import { categoriesEnum, IArticle } from "../types/articleTypes";
import { QueryClientProvider, QueryClient } from "react-query";
import { Articles, SingleArticle } from "../pages";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";

const mock = new MockAdapter(axios);

describe("Article Tags", () => {
    const fakeArticles: IArticle[] = [
        {
            title: "Article #1",
            content: "<div>Some content</div>",
            category: categoriesEnum.blog,
            code_languages: ["typescript", "css"],
            source_link: "",
            demo_link: "",
            tags: ["react", "typescript", "jest"],
            image: "",
            img_id: "",
            userId: "123",
            _id: "id123",
            createdAt: new Date(Date.now() - 1000 * 60).toString(),
            updatedAt: new Date().toString(),
            __v: 0,
        },
        {
            title: "Article #2",
            content: "<div>Some content</div>",
            category: categoriesEnum.blog,
            code_languages: ["javascript"],
            source_link: "",
            demo_link: "",
            tags: ["react", "javascript"],
            image: "",
            img_id: "",
            userId: "123",
            _id: "id124",
            createdAt: new Date(Date.now() - 1000 * 30).toString(),
            updatedAt: new Date().toString(),
            __v: 0,
        },
        {
            title: "Article #3",
            content: "<div>Some content</div>",
            category: categoriesEnum.blog,
            code_languages: ["typescript", "css"],
            source_link: "",
            demo_link: "",
            tags: ["express", "typescript", "jest"],
            image: "",
            img_id: "",
            userId: "123",
            _id: "id125",
            createdAt: new Date(Date.now() - 1000 * 10).toString(),
            updatedAt: new Date().toString(),
            __v: 0,
        },
    ];
    test("clicking tags should filter correctly", async () => {
        const queryClient = new QueryClient();
        mock.onGet("/api/article/blog").reply(200, { articles: fakeArticles });
        mock.onGet(`/api/comment/${fakeArticles[2]._id}`).reply(200, {
            comments: [],
        });

        render(
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    <Articles type={categoriesEnum.blog} />
                </QueryClientProvider>
            </BrowserRouter>
        );

        const expressTag = await screen.findByRole("button", {
            name: /express/i,
        });
        const typescriptTag = screen.getByRole("button", {
            name: /typescript/i,
        });
        const reactTag = screen.getByRole("button", { name: /react/i });

        const article1 = screen.getByRole("heading", { name: /article #1/i });
        const article2 = screen.getByRole("heading", { name: /article #2/i });
        const article3 = screen.getByRole("heading", { name: /article #3/i });

        //filter by typescript
        await userEvent.click(typescriptTag);
        expect(article2).not.toBeInTheDocument();

        //cancel filter
        await userEvent.click(typescriptTag);
        expect(
            await screen.findByRole("heading", { name: /article #2/i })
        ).toBeInTheDocument();

        //filter by react and typescript should show only article1
        await userEvent.click(typescriptTag);
        await userEvent.click(reactTag);
        expect(
            await screen.findByRole("heading", { name: /article #1/i })
        ).toBeInTheDocument();
        expect(article2).not.toBeInTheDocument();
        expect(article3).not.toBeInTheDocument();

        //cancel all typescript tag and add express -> should show no articles
        await userEvent.click(typescriptTag);
        await userEvent.click(expressTag);
        expect(article1).not.toBeInTheDocument();
        expect(article2).not.toBeInTheDocument();
        expect(article3).not.toBeInTheDocument();
    });
    test("should save clicked tag between the pages", async () => {
        const queryClient = new QueryClient();
        mock.onGet("/api/article/blog").reply(200, { articles: fakeArticles });

        render(
            <MemoryRouter initialEntries={["/blog"]}>
                <QueryClientProvider client={queryClient}>
                    <Routes>
                        <Route
                            path="/blog"
                            element={<Articles type={categoriesEnum.blog} />}
                        />
                        <Route
                            path={"/blog/:articleId"}
                            element={
                                <SingleArticle type={categoriesEnum.blog} />
                            }
                        />
                    </Routes>
                </QueryClientProvider>
            </MemoryRouter>
        );

        expect(
            await screen.findByRole("button", { name: /express/i })
        ).toBeInTheDocument();

        //all articles found
        const article1 = screen.getByRole("heading", { name: /article #1/i });
        const article2 = screen.getByRole("heading", { name: /article #2/i });
        const article3 = screen.getByRole("heading", { name: /article #3/i });
        userEvent.click(article3);

        //should get to SingleArticle's page
        const expressNavLink = await screen.findByRole("link", {
            name: /express/i,
        });
        expect(expressNavLink).toBeInTheDocument();

        //should get back to Articles page
        await act(async () => await userEvent.click(expressNavLink));

        //filter should work on page land and show only article #3
        const newArticle3 = await screen.findByRole("heading", {
            name: /article #3/i,
        });
        expect(article1).not.toBeInTheDocument();
        expect(article2).not.toBeInTheDocument();
        expect(newArticle3).toBeInTheDocument();
    });
});
