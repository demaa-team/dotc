import { useQuery, UseQueryOptions } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import { gql, request } from 'graphql-request';

import { appReadyState } from 'store/app';
import { Deal } from './types';
import QUERY_KEYS from 'constants/queryKeys';
import {OTC_GRAPH_ENDPOINT, formatDeal} from './utils';
import { walletAddressState, isWalletConnectedState, networkState } from 'store/wallet';

const useDealHistoryQuery = (options?: UseQueryOptions<Deal[]>) => {
	const isAppReady = useRecoilValue(appReadyState);
	const isWalletConnected = useRecoilValue(isWalletConnectedState);
	const walletAddress = useRecoilValue(walletAddressState);
	const network = useRecoilValue(networkState);

	return useQuery<Deal[]>(
		QUERY_KEYS.Otc.Deals(network?.id!, walletAddress),
		async () => {
			let deals = [];
			let response = await request(
				OTC_GRAPH_ENDPOINT,
				gql`
					query deals($maker: String!) {
						deals(where: {maker: $maker}, orderBy: dealID, orderDirection: desc) {
							dealID
							orderID
							maker
							taker
							currencyCode
							coinCode
							price
							amount
							fee
							collateralType
							collateral
							lockedAmount
							dealState
							cTime
							uTime
							adjudicationInfo{
								dealID
								plaintiff
								defendant
								adjudicator
								winner
								evidence
								explanation
								verdict
								progress
								cTime
								uTime
							}
						}
					}
				`,
				{
					maker: walletAddress,
				}
			);
			deals = response.deals;

			response = await request(
				OTC_GRAPH_ENDPOINT,
				gql`
					query deals($taker: String!) {
						deals(where: {taker: $taker}, orderBy: dealID, orderDirection: desc) {
							dealID
							orderID
							maker
							taker
							currencyCode
							coinCode
							price
							amount
							fee
							collateralType
							collateral
							lockedAmount
							dealState
							cTime
							uTime
							adjudicationInfo{
								dealID
								plaintiff
								defendant
								adjudicator
								winner
								evidence
								explanation
								verdict
								progress
								cTime
								uTime
							}
						}
					}
				`,
				{
					taker: walletAddress,
				}
			);
			deals = deals.concat(response.deals);
		    return (deals.map(formatDeal) as Deal[])
		},
		{
			enabled: isAppReady && !!network && isWalletConnected,
			...options,
        }
    );
};

export default useDealHistoryQuery;
