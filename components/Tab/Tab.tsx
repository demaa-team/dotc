import { ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { resetButtonCSS } from 'styles/common';

type TabButtonProps = {
	color?:string;
	name: string;
	active: boolean;
	onClick?: () => void;
	children: ReactNode;
	blue: boolean;
	tabHeight?: number;
	inverseTabColor?: boolean;
	isSingle?: boolean;
	isDisabled?: boolean;
};

export const TabButton = (props: TabButtonProps) => (
	<StyledTabButton
		id={`${props.name}-tab`}
		role="tab"
		color={props.color}
		aria-selected={props.active}
		aria-controls={`${props.name}-tabpanel`}
		tabIndex={-1}
		isDisabled={props.isDisabled}
		{...props}
	/>
);

export const TabList = ({ children, ...props }: { children: ReactNode;isFill:boolean; noOfTabs: number }) => (
	<StyledTabList {...props}>{children}</StyledTabList>
);

export const TabPanel = ({
	name,
	active,
	children,
	height,
	padding,
	...props
}: {
	name: string;
	active: boolean;
	children: ReactNode;
	height?: number;
	padding: number;
}) =>
	active ? (
		<TabPanelContainer
			id={`${name}-tabpanel`}
			role="tabpanel"
			aria-labelledby={`${name}-tab`}
			tabIndex={-1}
			height={height}
			padding={padding}
			{...props}
		>
			{children}
		</TabPanelContainer>
	) : null;

export const TabPanelContainer = styled.div<{ height?: number; padding: number }>`
	outline: none;
	background: transparent;
	// height:30rem;
	padding-top:1rem;
	// box-shadow: 0px 0px 20px ${(props) => props.theme.colors.backgroundBoxShadow};
	// ${(props) => (props.height != null ? `min-height: ${props.height}px` : 'height: unset')};
	// padding: ${(props) => props.padding}px;
`;

const StyledTabList = styled.div.attrs({ role: 'tablist' })<{ isFill:boolean;noOfTabs: number }>`
	width: ${(props) =>(props.isFill ? '100%' : '56.2rem')};
	grid-template-columns: ${(props) => '1fr '.repeat(props.noOfTabs)};
	display: grid;
`;

const StyledTabButton = styled.button<TabButtonProps>`
	${resetButtonCSS};
	font-family: ${(props) => props.theme.fonts.condensedBold};
	padding:0.5rem 0;
	color: ${(props) => (props.active ? props.theme.colors.white : props.theme.colors.gray)};

	${(props) =>
		props.active
			? props.color? css`
					border-bottom: 2px solid #F86C29;
				`
				: css`
					border-bottom: 2px solid #F86C29;
				`
			: css`
				border-bottom: ${`2px solid #3F4FA7`};
			`
		}

	${(props) =>
		props.isSingle &&
		css`
			border-left: none;
			border-right: none;
		`}

		${(props) =>
			props.isDisabled &&
			css`
				pointer-events: none;
				opacity: 0.3;
			`}

	height: ${(props) => (props.tabHeight ? `${props.tabHeight}px` : '3.5rem')};

	display: flex;
	align-items: center;
	justify-content: center;
`;
