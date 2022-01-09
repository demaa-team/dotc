import { ReactNode, FC } from 'react';
import styled, { css } from 'styled-components';
import { FlexDivColCentered } from 'styles/common';

type ButtonTileProps = {
	title: string;
	icon: ReactNode;
	subtext: string;
	onAction: () => void;
	disabled?: boolean;
};

const ButtonTile: FC<ButtonTileProps> = ({
	title,
	icon,
	subtext,
	onAction,
	disabled = false,
	...rest
}) => {
	return (
		<Container disabled={disabled} onClick={() => !disabled && onAction()} {...rest}>
			{/* <IconContainer>{icon}</IconContainer> */}
			<Title disabled={disabled} className="tile-title">
				{title}
			</Title>
			<Subtext disabled={disabled} className="tile-subtext">
				{subtext}
			</Subtext>
		</Container>
	);
};

const Container = styled(FlexDivColCentered)<{ disabled: boolean }>`
	text-align: center;
	justify-content: center;
	width: 100%;
	background: #1A2479;
	padding: 3rem 0;
	flex: 1;
	margin: 8px 0px;
	cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
	${(props) =>
		!props.disabled &&
		css`
			&:hover {
				background: ${(props) => props.theme.colors.mediumBlueHover};
				transition: background-color 0.5s;
			}
		`}
`;

const IconContainer = styled.div`
	margin: 2px 0px;
`;

const Title = styled.p<{ disabled: boolean }>`
	font-family: Microsoft YaHei;
	font-size: 1.5rem;
	text-transform: uppercase;
	color: ${(props) => (props.disabled ? props.theme.colors.gray : props.theme.colors.white)};
	// margin-top:20px;
	margin-block-start: 0;
    margin-block-end: 0;
`;

const Subtext = styled.p<{ disabled: boolean }>`
	font-size: 0.8rem;
	font-family: Microsoft YaHei;
	color: ${(props) => (props.disabled ? props.theme.colors.gray : props.theme.colors.white)};
	margin-top:1rem;
`;

export default ButtonTile;
