import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MintCircle from 'assets/svg/app/mint-circle.svg';
import { Svg } from 'react-optimized-image';
import ButtonTile from '../ButtonTile';
import { StakingPanelType } from 'store/staking';
import { FlexDivCol } from 'styles/common';
import styled from 'styled-components';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { amountToMintState, MintActionType, mintTypeState } from 'store/staking';
import { useRouter } from 'next/router';
import InfoBox from '../../components/InfoBox';
type MintTilesProps = {};

const mintIcon = <Svg src={MintCircle} />;

const MintTiles: React.FC<MintTilesProps> = () => {
	const { t } = useTranslation();
	const [mintType, onMintTypeChange] = useRecoilState(mintTypeState);
	const onMintChange = useSetRecoilState(amountToMintState);

	useEffect(() => {
		onMintChange('');
	}, [mintType, onMintChange]);
	const router = useRouter();
	const defaultTab = (router.query.action && router.query.action[0]) || StakingPanelType.MINT;
	return (
		<Container>
			<Col>
				<Container2>
					<StyledButtonTile
						title={t('staking.actions.mint.tiles.max.title')}
						subtext={t('staking.actions.mint.tiles.max.subtext')}
						icon={mintIcon}
						onAction={() => {
							onMintTypeChange(MintActionType.MAX);
						}}
					/>
					<StyledButtonTile
						title={t('staking.actions.mint.tiles.custom.title')}
						subtext={t('staking.actions.mint.tiles.custom.subtext')}
						icon={mintIcon}
						onAction={() => onMintTypeChange(MintActionType.CUSTOM)}
					/>
				</Container2>
			</Col>
		<Col> 
			<InfoBox currentTab={defaultTab} />
		</Col>
	</Container>
	);
};
const Col = styled(FlexDivCol)``;
const Container=styled.div`
	width: 100%; 
	margin-top:1rem;
	display: grid;
	grid-template-columns: 2fr 1fr;
	grid-gap: 1rem;
`;
const Container2 = styled(FlexDivCol)`
	width: 100%;
	flex: 1;
`;
const StyledButtonTile = styled(ButtonTile)`
	padding: 3.65rem 0;
	flex: 0;
	margin: 0.4rem 0px;
	background:#1A2479;
`;

export default MintTiles;
