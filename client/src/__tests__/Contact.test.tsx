import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { QueryClient, QueryClientProvider } from "react-query";
import { describe, expect, test, vi } from "vitest";
import Contact from "../pages/Contact";
import { AppContext } from "../store/AppContext";
import type { AppContextValues, IUser } from "../types/appTypes";

const mock = new MockAdapter(axios);

//mock recaptcha
vi.mock("react-google-recaptcha-v3", () => {
    return {
        useGoogleReCaptcha: () => ({
            executeRecaptcha: () => "success",
        }),
    };
});

describe("Contact", () => {
    test("Should successfully send message", async () => {
        mock.onGet("/api/user/showMe").reply(200, {
            user: { name: "Neirea" },
        });
        mock.onPost("/api/action/testCaptcha").reply(200);
        mock.onPost("/api/action/sendContactMessage").reply(200);

        const queryClient = new QueryClient();

        render(
            <QueryClientProvider client={queryClient}>
                <AppContext.Provider
                    value={
                        {
                            user: { name: "Neirea" } as IUser,
                        } as AppContextValues
                    }
                >
                    <Contact />
                </AppContext.Provider>
            </QueryClientProvider>
        );

        const name = screen.getByLabelText(/your name/i);
        const email = screen.getByLabelText(/your contact email/i);
        const message = screen.getByLabelText(
            /your message/i
        ) as HTMLTextAreaElement;
        const submit = screen.getByRole("button", { name: /send/i });

        await userEvent.type(name, " Soultix");
        await userEvent.type(email, "neireasoultix@gmail.com");
        await userEvent.type(message, "Hello :)");

        //test that controlled component works
        expect(name).toHaveValue("Neirea Soultix");
        expect(email).toHaveValue("neireasoultix@gmail.com");
        expect(message).toHaveValue("Hello :)");
        //check properties of textbox
        expect(message.maxLength).toBe(100000);
        expect(message.required).toBe(true);

        //don't await because we're checking for loading states
        userEvent.click(submit);

        expect(
            await screen.findByRole("button", { name: /Loading.../i })
        ).toBeInTheDocument();

        expect(
            await screen.findByRole("button", { name: /send/i })
        ).toBeInTheDocument();

        const continueBtn = await screen.findByRole("button", {
            name: /continue/i,
        });

        // should appear after successfull sumbission
        expect(continueBtn).toBeInTheDocument();
        expect(message).toHaveValue("");
    });
});
