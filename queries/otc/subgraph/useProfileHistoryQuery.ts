// @ts-nocheck
import { useQuery, UseQueryOptions } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import { gql, request } from 'graphql-request';

import { appReadyState } from 'store/app';
import { Order, Profile, ProfileInfo, ContactType, ContactIno, PayType, PayInfo } from './types';
import QUERY_KEYS from 'constants/queryKeys';
import {OTC_GRAPH_ENDPOINT, formatOrder} from './utils';

import {networkState } from 'store/wallet';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';
import { concat as uint8ArrayConcat } from 'uint8arrays/concat';
import {create as ipfsApi} from 'ipfs-http-client';
const ipfsClient = ipfsApi('http://221.237.167.6:5001');

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

const queryProfileInfo = async (ipfsHash:string):ProfileInfo =>{
    let data: Uint8Array = [];
    try{
        for await (const chunck of ipfsClient.cat(ipfsHash)){
            data = uint8ArrayConcat(data, chunck);
        }
    } catch(_){
        return {
        ver:0,
        ipfsHash:ipfsHash,
        account: "",
        alias: '',
        avatar: '',
        ad: '',
        auth: '',
        order: null,
        contacts: [],
        pays: [],
        disputeCount: 0,
        violationCount:0 ,
        volume:0
        }
    }

    let orProfile: any = uint8ArrayToString(data);
    if(orProfile){
        orProfile = JSON.parse(orProfile);
        const contacts: ContactIno[] = orProfile.contacts.map(c=>{
            return c as ContactIno;
        });
        const pays: PayInfo[] = orProfile.pays.map(p=>{
            return p as PayInfo;
        });

        return {
            ver:orProfile.ver??0,
            ipfsHash:ipfsHash,
            account: "",
            alias: orProfile.alias,
            avatar:orProfile.avatar,
            ad: orProfile.ad,
            auth: orProfile.auth,
            order: null,
            contacts: contacts,
            pays: pays,
            disputeCount: 0,
            violationCount:0 ,
            volume:0
        }
    }

    return null;
};

const queryProfile = async (excludeDestroyed:boolean):Profile =>{
    let response = await request(
        OTC_GRAPH_ENDPOINT,
        gql`
            query profiles($destroyed: Boolean!) {
                profiles(where: {destroyed: $destroyed},  orderDirection: desc) {
                    account
                    ipfsHash
                    destroyed
                }
            }
        `,
        {
            destroyed: !excludeDestroyed,
        }
    );
    return response.profiles;
}


const useProfileHistoryQuery = (options?: UseQueryOptions<ProfileInfo[]>) => {
    const isAppReady = useRecoilValue(appReadyState);
    const network = useRecoilValue(networkState);

	return useQuery<ProfileInfo[]>(
		QUERY_KEYS.Otc.Profiles(network?.id!),
		async () => {
			let profiles = await queryProfile(true);

            const profileInfos: ProfileInfo[] = [];
            for(const p of profiles){
                if(p.ipfsHash !=null && p.ipfsHash !==""){
                    let profile =   {
                    account: p.account,
                    alias: "",
                    avatar: '',
                    ad: '',
                    auth: '',
                    order: null,
                    contacts: [],
                    pays: [],
                    disputeCount: 0,
                    violationCount:0 ,
                    volume:0
                    };

                    try{
                        profile = await queryProfileInfo(p.ipfsHash);
                    } catch(_){
                        console.log("error=== ++");
                    }
                    const order = await queryOrder(p.account);
                    profile.account = p.account;
                    profile.order = order;
                    profile.volume = order?.volume??0;
                    profileInfos.push(profile);
                }
            }
            return profileInfos as ProfileInfo[];
		},
		{
			enabled: isAppReady && !!network,
			...options,
        }
    );
};

export default useProfileHistoryQuery;
