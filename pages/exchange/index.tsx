import { FC, useEffect } from 'react';
import Head from 'next/head';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import UIContainer from 'containers/UI';

const Exchange: FC = () => {
	const { t } = useTranslation();
	const { setTitle } = UIContainer.useContainer();

	// header title
	useEffect(() => {
		setTitle('staking', 'earn');
	}, [setTitle]);

	return (
		<>
			<Head>
				<title>{t('earn.page-title')}</title>
			</Head>
			<div>exchange content</div>
			{/* <StatsSection>
				<UpcomingRewards
					title={t('common.stat-box.upcoming-rewards')}
					value={formatFiatCurrency(getPriceAtCurrentRate(totalRewards), {
						sign: selectedPriceCurrency.sign,
					})}
				/>
				<APR
					title={t('common.stat-box.earning')}
					value={formatPercent(stakingAPR ? stakingAPR : 0)}
					size="lg"
				/>
				<LifetimeRewards
					title={t('common.stat-box.lifetime-rewards')}
					value={formatFiatCurrency(getPriceAtCurrentRate(totalFees), {
						sign: selectedPriceCurrency.sign,
					})}
				/>
			</StatsSection>
			<LineSpacer />
			<Incentives
				tradingRewards={tradingRewards}
				stakingRewards={stakingRewards}
				totalRewards={totalRewards}
				stakingAPR={stakingAPR}
				stakedAmount={SNXRate.eq(0) ? wei(0) : stakedValue.div(SNXRate)}
				hasClaimed={hasClaimed}
			/> */}
		</>
	);
};

export default Exchange;
