export const randomUserName = () => {
	return "User" + (Math.floor(Math.random() * 9000) + 1000).toString();
};
