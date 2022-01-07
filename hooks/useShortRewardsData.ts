import { Synths } from 'constants/currency';
import { WEEKS_IN_YEAR } from 'constants/date';
import useSynthetixQueries from 'demaa-queries';
import { ShortRewardsData } from 'demaa-queries';
import Wei, { wei } from '@synthetixio/wei';

type SRData = {
	[name: string]: {
		APR: Wei;
		OI: Wei;
		data: ShortRewardsData | undefined;
	};
};

const useShortRewardsData = (walletAddress: string | null): SRData => {
	const { useExchangeRatesQuery, useShortsQuery } = useSynthetixQueries();
	const exchangeRatesQuery = useExchangeRatesQuery();
	const SNXRate = exchangeRatesQuery.data?.DEM ?? wei(0);
	const usesETHRewards = useShortsQuery('sETH', walletAddress);
	const sETHOpenInterestUSD = usesETHRewards.data?.openInterestUSD ?? wei(0);

	const sETHAPR =
		usesETHRewards.data?.distribution && SNXRate && sETHOpenInterestUSD
			? usesETHRewards.data.distribution.mul(SNXRate).div(sETHOpenInterestUSD).mul(WEEKS_IN_YEAR)
			: wei(0);

	return {
		[Synths.sETH]: {
			APR: sETHAPR,
			OI: sETHOpenInterestUSD,
			data: usesETHRewards.data,
		},
	};
};

export default useShortRewardsData;
