import { render, screen } from "@testing-library/react";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Contact from "../pages/Contact";
import { AppContext } from "../store/AppContext";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { QueryClient, QueryClientProvider } from "react-query";
import type { AppContextValues, IUser } from "../types/appTypes";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);
const solvedRecaptchaKey = process.env.REACT_APP_RECAPTCHA_CLIENT;

describe("Contact", () => {
	test("Should successfully send message", async () => {
		mock.onGet("/api/user/showMe").reply(200, { user: { name: "Neirea" } });
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
					<GoogleReCaptchaProvider reCaptchaKey={solvedRecaptchaKey}>
						<Contact />
					</GoogleReCaptchaProvider>
				</AppContext.Provider>
			</QueryClientProvider>
		);

		const name = screen.getByLabelText(/your name/i);
		const email = screen.getByLabelText(/your contact email/i);
		const message = screen.getByLabelText(
			/your message/i
		) as HTMLTextAreaElement;
		const submit = screen.getByRole("button", { name: /send/i });

		userEvent.type(name, " Soultix");
		userEvent.type(email, "neireasoultix@gmail.com");
		userEvent.type(message, "Hello :)");

		//test that controlled component works
		expect(name).toHaveValue("Neirea Soultix");
		expect(email).toHaveValue("neireasoultix@gmail.com");
		expect(message).toHaveValue("Hello :)");
		//check properties of textbox
		expect(message.maxLength).toBe(100000);
		expect(message.required).toBe(true);

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
