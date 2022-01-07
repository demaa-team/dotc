import { useMemo } from 'react';
import { orderBy } from 'lodash';

import { CryptoCurrency, Synths } from 'constants/currency';
import { assetToSynth } from 'utils/currencies';

import useSynthetixQueries from 'demaa-queries';
import { NetworkId } from 'demaa-contracts-interface';
import Wei, { wei } from '@synthetixio/wei';
import { renBTCToken, wBTCToken, wETHToken } from 'contracts';
import { useRecoilValue } from 'recoil';
import { networkState } from 'store/wallet';
import { ethers } from 'ethers';

const { ETH, WETH, DEM, BTC, WBTC, RENBTC } = CryptoCurrency;

export type CryptoBalance = {
	currencyKey: string;
	balance: Wei;
	usdBalance: Wei;
	synth?: string;
	transferrable?: Wei;
};

const useCryptoBalances = (walletAddress: string | null) => {
	const {
		useTokensBalancesQuery,
		useExchangeRatesQuery,
		useGetDebtDataQuery,
	} = useSynthetixQueries();

	const networkId = useRecoilValue(networkState);

	const tokenDefs = [
		{
			symbol: 'ETH',
			address: ethers.constants.AddressZero,
			decimals: 18,
			logoURI: '',
			name: 'Ethereum',
			chainId: 1,
			tags: [],
		},
	];

	if (networkId?.id === NetworkId.Mainnet) {
		tokenDefs.push(
			...[
				{
					symbol: 'WBTC',
					address: wBTCToken.address,
					decimals: 18,
					logoURI: '',
					name: 'Wrapped Bitcoin',
					chainId: 1,
					tags: [],
				},
				{
					symbol: 'WETH',
					address: wETHToken.address,
					decimals: 18,
					logoURI: '',
					name: 'Wrapped Ethereum',
					chainId: 1,
					tags: [],
				},
				{
					symbol: 'renBTC',
					address: renBTCToken.ADDRESSES['mainnet'],
					decimals: 18,
					logoURI: '',
					name: 'renBTC',
					chainId: 1,
					tags: [],
				},
			]
		);
	}

	const balancesQuery = useTokensBalancesQuery(tokenDefs, walletAddress);

	const exchangeRatesQuery = useExchangeRatesQuery();

	const debtQuery = useGetDebtDataQuery(walletAddress);

	const exchangeRates = exchangeRatesQuery.data ?? null;

	const isLoaded = balancesQuery.isSuccess && exchangeRatesQuery.isSuccess;

	const balancesData = balancesQuery.data!;

	const ETHBalance = (balancesQuery.isSuccess && balancesData['ETH']?.balance) || wei(0);
	const SNXBalance = debtQuery?.data?.collateral || wei(0);
	const wETHBalance = (balancesQuery.isSuccess && balancesData['WETH']?.balance) || wei(0);
	const wBTCBalance = (balancesQuery.isSuccess && balancesData['WBTC']?.balance) || wei(0);
	const renBTCBalance = (balancesQuery.isSuccess && balancesData['renBTC']?.balance) || wei(0);
	const transferrableSNX = debtQuery?.data?.transferable ?? wei(0);

	const balances = useMemo<CryptoBalance[]>(() => {
		if (isLoaded && exchangeRates != null && exchangeRates != undefined) {
			return orderBy(
				[
					{
						currencyKey: ETH,
						balance: ETHBalance,
						usdBalance: ETHBalance.mul(exchangeRates[ETH]),
						synth: assetToSynth(ETH),
					},
					{
						currencyKey: WETH,
						balance: wETHBalance,
						usdBalance: wETHBalance.mul(exchangeRates[ETH]),
						synth: assetToSynth(ETH),
					},
					{
						currencyKey: DEM,
						balance: SNXBalance,
						usdBalance: SNXBalance.mul(exchangeRates[DEM]),
						synth: assetToSynth(ETH),
						transferrable: transferrableSNX,
					},
				].filter((cryptoBalance) => cryptoBalance.balance.gt(0)),
				(balance) => balance.usdBalance.toNumber(),
				'desc'
			);
		}
		return [];
	}, [
		isLoaded,
		ETHBalance,
		SNXBalance,
		wETHBalance,
		wBTCBalance,
		renBTCBalance,
		exchangeRates,
		transferrableSNX,
	]);

	return {
		balances,
		isLoaded,
	};
};

export default useCryptoBalances;
