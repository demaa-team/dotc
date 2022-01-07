import styled from 'styled-components';
import { FlexDivCentered, FlexDivCol, FlexDivRowCentered } from 'styles/common';

import ProgressBar from 'components/ProgressBar';

export const BarStatBox = styled(FlexDivCol)`
	width: 100%;
	margin-bottom: 35px;
	&:last-child {
		margin-bottom: 45px;
		margin-top: -10px;
	}
`;

export const BarHeaderSection = styled(FlexDivRowCentered)``;

export const BarTitle = styled(FlexDivCentered)`
	font-size: 0.7rem;
	font-family:  Microsoft YaHei;
	color: ${(props) => props.theme.colors.white};
	text-transform: uppercase;
`;

export const BarValue = styled.span`
	font-size: 0.6rem;
	color: ${(props) => props.theme.colors.white};
	font-family: Microsoft YaHei;
	font-weight:500;
`;

export const StyledProgressBar = styled(ProgressBar)`
	height: 6px;
	margin: 10px 0;
`;
