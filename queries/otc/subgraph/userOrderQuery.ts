// @ts-nocheck
import { useQuery, UseQueryOptions } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import { gql, request } from 'graphql-request';

import { appReadyState } from 'store/app';
import { Order, Profile, ProfileInfo, ContactType, ContactIno, PayType, PayInfo } from './types';
import QUERY_KEYS from 'constants/queryKeys';
import {OTC_GRAPH_ENDPOINT, formatOrder} from './utils';

import { toString as uint8ArrayToString } from 'uint8arrays/to-string';
import { concat as uint8ArrayConcat } from 'uint8arrays/concat';
import { walletAddressState, isWalletConnectedState, networkState } from 'store/wallet';


const queryOrder = async (account:string):Order => {
    const response = await request(
        OTC_GRAPH_ENDPOINT,
        gql`
            query orders($maker: String!) {
                orders(first:1, where: {maker: $maker}, orderBy: orderID, orderDirection: desc) {
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
            maker: account,
        }
    );
    return response.orders.map(formatOrder)[0];
};


const useOrderQuery = (options?: UseQueryOptions<Order[]>) => {
    const isAppReady = useRecoilValue(appReadyState);
    const network = useRecoilValue(networkState);
    const isWalletConnected = useRecoilValue(isWalletConnectedState);
    const walletAddress = useRecoilState(walletAddressState);

	return useQuery<Order[]>(
		QUERY_KEYS.Otc.Order(network?.id!, walletAddress, true),
		async () => {
            return await queryOrder(walletAddress);
		},
		{
			enabled: isAppReady && isWalletConnected && !!walletAddress && !!network ,
			...options,
        }
    );
};

export default useOrderQuery;
