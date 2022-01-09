import { FC } from 'react';
import styled from 'styled-components';

import { FlexDivCentered, FlexDivCol, FlexDivRowCentered } from 'styles/common';
import ProgressBar from 'components/ProgressBar';
import { ProgressBarType } from 'components/ProgressBar/ProgressBar';

type BarStatsRowProps = {
	title: string;
	type: ProgressBarType;
	value: string;
	percentage: number;
};

const BarStatsRow: FC<BarStatsRowProps> = ({ title, type, value, percentage }) => (
	<BarStatBox>
		<FlexDivRowCentered>
			<BarTitle>{title}</BarTitle>
			<BarValue>{value}</BarValue>
		</FlexDivRowCentered>
		<StyledProgressBar percentage={percentage} variant={type} />
	</BarStatBox>
);

export const BarStatBox = styled(FlexDivCol)`
	margin:0 1.2rem;
	padding: 0.8rem 0;
	// margin-top: 18px;
	border-top:1px solid #4C5496;
	&:last-child {
		margin-bottom: 45px;
		margin-top: -10px;
	}
`;

export const BarTitle = styled(FlexDivCentered)`
	font-size: 0.9rem;
	font-family: Microsoft YaHei;
	color: #fff;
	text-transform: uppercase;
`;

export const BarValue = styled.span`
	font-size: 0.7rem;
	color: ${(props) => props.theme.colors.white};
	font-family: Microsoft YaHei;
`;

export const StyledProgressBar = styled(ProgressBar)`
	height: 6px;
	margin: 10px 0;
`;

export default BarStatsRow;
