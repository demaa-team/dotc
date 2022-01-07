import styled, { css } from 'styled-components';
import { resetButtonCSS } from 'styles/common';
import Color from 'color';

type ButtonProps = {
	size?: 'sm' | 'md' | 'lg' | 'xl';
	variant: 'primary' | 'orange' | 'secondary' | 'tertiary' | 'solid' | 'outline' | 'text' | 'green';
	isActive?: boolean;
	isRounded?: boolean;
};

const Button = styled.button<ButtonProps>`
	font-family: ${(props) => props.theme.fonts.condensedMedium};
	height: 2.3rem;
	line-height: 2.3rem;
	font-size: 0.8rem;
	padding: 0 0.6rem;
	border: none;
	border-radius: ${(props) => (props.isRounded ? '100px' : '4px')};
	white-space: nowrap;
	cursor: pointer;
	outline: none;
    color: ${(props) => props.theme.colors.white};
	text-transform: capitalize;

  	&:disabled {
		background: ${(props) => Color(props.theme.colors.blue).alpha(0.5).rgb().string()};
		color: ${(props) => props.theme.colors.white};
		box-shadow: none;
	cursor: not-allowed;

	}

	${(props) =>
		props.size === 'sm' &&
		css`
			height: 24px;
			line-height: 24px;
		`}

	${(props) =>
		props.size === 'md' &&
		css`
			height: 2.3rem;
			line-height: 2.3rem;
		`}

	${(props) =>
		props.size === 'lg' &&
		css`
			padding: 0 40px;
			height: 40px;
			line-height: 40px;
		`}


	${(props) =>
		props.size === 'xl' &&
		css`
			height: 48px;
			line-height: 48px;
		`}

	${(props) =>
		props.variant === 'primary' &&
		css`
			color: ${(props) => props.theme.colors.white};
			background: #F86C29;
			// box-shadow: 0px 0px 10px rgba(0, 209, 255, 0.6);
			// border: 1px solid transparent;
			&:hover {
				background: #F39365;
				&:not(:disabled) {
					background: #F39365;
					// box-shadow: 0px 0px 10px rgba(0, 209, 255, 0.9);
					// border: 1px solid ${(props) => props.theme.colors.blue};
				}
			}
		`}
		${(props) =>
			props.variant === 'orange' &&
			css`
				color:${(props) => props.theme.colors.white};
				background: #F76C2A;
				border-radius:50px;
				height:3.3rem;
				font-size:1rem;
				padding:0 2.9rem;
				font-family: Microsoft YaHei;
				&:hover {
					&:not(:disabled) {
						background: #F76C2A;
					}
				}
			`}
		${(props) =>
			props.variant === 'secondary' &&
			css`
				color: ${(props) => props.theme.colors.blue};
				background: ${(props) => props.theme.colors.grayBlue};
				box-shadow: 0px 0px 10px rgba(0, 209, 255, 0.9);
				border: 1px solid ${(props) => props.theme.colors.blue};
				&:hover {
					&:not(:disabled) {
						background: ${(props) => props.theme.colors.blueHover};
						color: ${(props) => props.theme.colors.black};
					}
				}
			`}

		${(props) =>
			props.variant === 'tertiary' &&
			css`
				color: ${(props) => props.theme.colors.pink};
				background: ${(props) => props.theme.colors.grayBlue};
				box-shadow: 0px 0px 15px rgba(237, 30, 255, 0.6);
				border: 1px solid ${(props) => props.theme.colors.pink};
				&:hover {
					&:not(:disabled) {
						background: ${(props) => props.theme.colors.pink};
						color: ${(props) => props.theme.colors.black};
					}
				}
			`}


		${(props) =>
			props.variant === 'solid' &&
			css`
				color: ${(props) => props.theme.colors.white};
				background: #3f478f;
				&:hover {
					&:not(:disabled) {
						background: #3f478f;
					}
				}
				&:disabled {
					background: ${(props) => Color(props.theme.colors.navy).alpha(0.2).rgb().string()};
				}
			`}


		${(props) =>
			props.variant === 'outline' &&
			css`
				color: ${(props) => props.theme.colors.white};
				background: ${(props) => props.theme.colors.navy};
				border: 1px solid ${(props) => props.theme.colors.grayBlue};
				&:hover {
					&:not(:disabled) {
						background:  #3f478f;
					}
				}
				&:disabled {
					background: ${(props) => Color(props.theme.colors.navy).alpha(0.2).rgb().string()};
					opacity: 0.5;
				}
			`}


		${(props) =>
			props.variant === 'text' &&
			css`
				${resetButtonCSS};
				color: ${(props) => props.theme.colors.white};
				&:hover {
					&:not(:disabled) {
						color: ${(props) => props.theme.colors.blue};
					}
				}
			`}
		${(props) =>
			props.variant === 'green' &&
			css`
				color: #2A377E;
				background: #9BF990;
				border-radius:50px;
				height:3.7rem;
				// box-shadow: 0px 0px 10px rgba(0, 209, 255, 0.6);
				// border: 1px solid transparent;
				&:hover {
					&:not(:disabled) {
						background: #9BF990;
						// box-shadow: 0px 0px 10px rgba(0, 209, 255, 0.9);
						// border: 1px solid ${(props) => props.theme.colors.blue};
					}
				}
			`}
`;

export default Button;
