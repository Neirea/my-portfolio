import styled from "styled-components";
import { MenuItem } from "./HeaderStyles";

export const UserMenuWrapper = styled(MenuItem)`
	color: var(--faded-text-color);

	@media (hover: hover) and (pointer: fine) {
		&:hover {
			color: var(--main-text-color);
			transition: color var(--transition);
		}
	}
	.user-name {
		display: none;
		margin-right: 1rem;
		@media (min-width: 640px) {
			display: inline-block;
		}
	}

	.toggle-user-menu {
		display: flex;
		height: 100%;
		align-items: center;
		text-transform: none;
		user-select: none;
		cursor: pointer;

		.activated {
			color: var(--main-text-color);
		}
		.user-menu-item {
			display: flex;
			align-items: center;
			width: var(--icon-size);
			height: 100%;
			transition: transform var(--transition);

			.user-avatar {
				width: 100%;
			}
		}
	}

	.user-menu-dropdown {
		display: flex;
		align-items: center;

		position: absolute;
		top: 4rem;
		padding: 0 0.5rem;

		height: 0;
		box-shadow: var(--shadow-3);
		border-radius: 0 0 0.3rem 0.5rem;
		background-color: var(--header-bg-color);

		transition: height var(--transition);
		overflow: hidden;

		.user-menu-link {
			padding: 0.3rem 0.3rem;
			user-select: none;
		}
	}
`;
