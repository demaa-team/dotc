import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FlexDivRow, FlexDivRowCentered } from 'styles/common';
import { formatPercent } from 'utils/formatters/number';

type CRatioProps = {
	ratio:number;
};

const CRatio: React.FC<CRatioProps> = ({ ratio }) => {
	const {t} = useTranslation();
	
	return (
		<Container>
			<Header>{t('market.detail.cratio-label')}</Header>
			<FlexDivRowCentered>
				<Item>
					<Text>{formatPercent(ratio)}</Text>
				</Item>
			</FlexDivRowCentered>
		</Container>
	);
};

const Container = styled(FlexDivRow)`
	width: 100%;
	justify-content: space-between;
`;

const Header = styled.p`
	font-family: ${(props) => props.theme.fonts.interBold};
	font-size: 12px;
	color: ${(props) => props.theme.colors.white};
	text-transform: uppercase;
`;

const Text = styled.span`
	font-family: ${(props) => props.theme.fonts.interBold};
	font-size: 12px;
	color: ${(props) => props.theme.colors.white};
`;

const Item = styled.span`
	display: inline-flex;
	align-items: center;
	cursor: pointer;
	svg {
		margin-left: 5px;
	}
`;

export default CRatio;
