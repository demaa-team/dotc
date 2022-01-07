import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import Wei from '@synthetixio/wei';
import styled from 'styled-components';
import IncentivesMainnet from './IncentivesMainnet';
import IncentivesDefault from './IncentivesDefault';

import { isMainnetState, delegateWalletState } from 'store/wallet';

type IncentivesProps = {
	tradingRewards: Wei;
	stakingRewards: Wei;
	totalRewards: Wei;
	stakingAPR: Wei;
	stakedAmount: Wei;
	hasClaimed: boolean;
};

const Incentives: FC<IncentivesProps> = (props) => {
	const isMainnet = useRecoilValue(isMainnetState);
	const delegateWallet = useRecoilValue(delegateWalletState);
	const Incentives = isMainnet && !delegateWallet ? IncentivesMainnet : IncentivesDefault;

	return <ContainerT>
			<Incentives {...props} />
		</ContainerT>;
};

const ContainerT = styled.div`
	background:#203298;
	padding:1rem 5rem;
	border-radius:1.1rem;
`
export default Incentives;
