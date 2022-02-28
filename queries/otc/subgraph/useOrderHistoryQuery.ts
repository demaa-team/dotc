import { useQuery, UseQueryOptions } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import { gql, request } from 'graphql-request';

import { appReadyState } from 'store/app';
import { Order } from './types';
import QUERY_KEYS from 'constants/queryKeys';
import {OTC_GRAPH_ENDPOINT, formatOrder} from './utils';

import {networkState } from 'store/wallet';

const useOrderHistoryQuery = (options?: UseQueryOptions<Order[]>) => {
    const isAppReady = useRecoilValue(appReadyState);
    const network = useRecoilValue(networkState);

	return useQuery<Order[]>(
		QUERY_KEYS.Otc.Orders(network?.id!, true),
		async () => {
			const response = await request(
				OTC_GRAPH_ENDPOINT,
				gql`
					query orders($isClosed: Boolean!) {
						orders(where: {closed: $isClosed}, orderBy: orderID, orderDirection: desc) {
                            orderID
                            maker
                            currencyCode
                            coinCode
                            price
							volume
                            leftAmount
                            lockedAmount
						}
					}
				`,
				{
					isClosed: false,
				}

				
			);
			return (response?.orders??[]).map(formatOrder);
		},
		{
			enabled: isAppReady && !!network,
			...options,
        }
    );
};

export default useOrderHistoryQuery;
