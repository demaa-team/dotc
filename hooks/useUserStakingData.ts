import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

// import useStakingCalculations from 'sections/staking/hooks/useStakingCalculations';
import { Synths } from 'constants/currency';
import { WEEKS_IN_YEAR } from 'constants/date';

import { isL2State } from 'store/wallet';
import Wei, { wei } from '@synthetixio/wei';
import useSynthetixQueries from 'demaa-queries';

export const useUserStakingData = (walletAddress: string | null) => {
	try{
		const [hasClaimed, setHasClaimed] = useState<boolean>(false);
		const isL2 = useRecoilValue(isL2State);
	
		const {
			useFeeClaimHistoryQuery,
			useGetFeePoolDataQuery,
			useGetDebtDataQuery,
			useClaimableRewardsQuery,
		} = useSynthetixQueries();
	
		const history = useFeeClaimHistoryQuery(walletAddress);
		const currentFeePeriod = useGetFeePoolDataQuery(0);
		const {
			useTotalIssuedSynthsExcludeOtherCollateralQuery,
			useExchangeRatesQuery,
			useGlobalStakingInfoQuery,
		} = useSynthetixQueries();
		const exchangeRatesQuery = useExchangeRatesQuery();
		const totalIssuedSynthsExclOtherCollateral = useTotalIssuedSynthsExcludeOtherCollateralQuery(
			Synths.sUSD
		);
		const previousFeePeriod = useGetFeePoolDataQuery(1);
		const {
			currentCRatio,
			targetCRatio,
			debtBalance,
			collateral,
			targetThreshold,
		} = {};
		const globalStakingInfo = useGlobalStakingInfoQuery();
		const debtData = useGetDebtDataQuery(walletAddress);
		const feesToDistribute = previousFeePeriod?.data?.feesToDistribute ?? wei(0);
		const rewardsToDistribute = previousFeePeriod?.data?.rewardsToDistribute ?? wei(0);
	
		const totalsUSDDebt = wei(totalIssuedSynthsExclOtherCollateral?.data ?? 0);
		const sUSDRate = wei(exchangeRatesQuery.data?.sUSD ?? 0);
		const SNXRate = wei(exchangeRatesQuery.data?.DEM ?? 0);
	
		const isBelowCRatio = currentCRatio.gt(targetCRatio.mul(wei(1).add(targetThreshold)));
		const stakedValue =
			collateral.gt(0) && currentCRatio.gt(0)
				? collateral.mul(Wei.min(wei(1), currentCRatio.div(targetCRatio))).mul(SNXRate)
				: wei(0);
	
		const weeklyRewards = sUSDRate.mul(feesToDistribute).add(SNXRate.mul(rewardsToDistribute));
	
		let stakingAPR = wei(0);
	
		// compute APR based on the user staked DEM
		if (stakedValue.gt(0) && debtBalance.gt(0) && totalsUSDDebt.gt(0)) {
			stakingAPR = weeklyRewards
				.mul(debtBalance.div(totalsUSDDebt).mul(WEEKS_IN_YEAR))
				.div(stakedValue);
		} else if (
			SNXRate != null &&
			sUSDRate != null &&
			previousFeePeriod.data != null &&
			currentFeePeriod.data != null &&
			globalStakingInfo.data != null &&
			debtData.data != null
		) {
			// compute APR based using useSNXLockedValueQuery (top 1000 holders)
			stakingAPR = isL2
				? debtData.data.totalSupply.eq(0)
					? wei(0)
					: wei(WEEKS_IN_YEAR).mul(rewardsToDistribute).div(debtData.data.totalSupply)
				: globalStakingInfo.data.lockedValue.eq(0)
				? wei(0)
				: sUSDRate
						.mul(currentFeePeriod.data.feesToDistribute)
						.add(SNXRate.mul(currentFeePeriod.data.rewardsToDistribute))
						.mul(WEEKS_IN_YEAR)
						.div(globalStakingInfo.data.lockedValue);
		}
	
		const availableRewards = useClaimableRewardsQuery(walletAddress);
	
		const tradingRewards = availableRewards?.data?.tradingRewards ?? wei(0);
		const stakingRewards = availableRewards?.data?.stakingRewards ?? wei(0);
	
		const { currentFeePeriodStarts, nextFeePeriodStarts } = useMemo(() => {
			return {
				currentFeePeriodStarts: new Date(
					currentFeePeriod.data?.startTime ? currentFeePeriod.data.startTime * 1000 : 0
				),
				nextFeePeriodStarts: new Date(
					currentFeePeriod.data?.startTime
						? (currentFeePeriod.data.startTime + currentFeePeriod.data.feePeriodDuration) * 1000
						: 0
				),
			};
		}, [currentFeePeriod]);
	
		useEffect(() => {
			const checkClaimedStatus = () =>
				setHasClaimed(
					history.data
						? history.data?.some((tx) => {
								const claimedDate = new Date(tx.timestamp);
								return claimedDate > currentFeePeriodStarts && claimedDate < nextFeePeriodStarts;
						  })
						: false
				);
			checkClaimedStatus();
		}, [history, currentFeePeriodStarts, nextFeePeriodStarts]);
	
		return {
			hasClaimed,
			stakedValue,
			stakingAPR,
			tradingRewards,
			stakingRewards,
			debtBalance,
			isBelowCRatio,
		};
	}catch(e){
		// 
	}
};

export default useUserStakingData;
