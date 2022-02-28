// @ts-nocheck
import { useQuery, UseQueryOptions } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import { gql, request } from 'graphql-request';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';
import { concat as uint8ArrayConcat } from 'uint8arrays/concat';
import { appReadyState } from 'store/app';
import { Order, Profile, ProfileInfo, ContactType, ContactIno, PayType, PayInfo } from './types';
import QUERY_KEYS from 'constants/queryKeys';
import {OTC_GRAPH_ENDPOINT, formatOrder, ipfsEndPoint} from './utils';
import {create as ipfsApi} from 'ipfs-http-client';
const ipfsClient = ipfsApi(ipfsEndPoint);
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

const queryProfile = async (account:string):ProfileInfo =>{
    let response = await request(
        OTC_GRAPH_ENDPOINT,
        gql`
            query profiles($account: String!) {
                profiles(where: {account: $account, destroyed:false},  orderDirection: desc) {
                    account
                    ipfsHash
                    destroyed
                }
            }
        `,
        {
            account: account,
        }
    );
    return response.profiles[0];
}

const queryProfileInfo = async (ipfsHash:string):ProfileInfo =>{
    let data: Uint8Array = [];
    try{
        for await (const chunck of ipfsClient.cat(ipfsHash)){
            data = uint8ArrayConcat(data, chunck);
        }
    }catch(err){
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

const useProfileQuery = (options?: UseQueryOptions<ProfileInfo>) => {
    const isAppReady = useRecoilValue(appReadyState);
    const network = useRecoilValue(networkState);
    const isWalletConnected = useRecoilValue(isWalletConnectedState);
    const walletAddress = useRecoilState(walletAddressState);
    const address = walletAddress[0];

	return useQuery<ProfileInfo>(
		QUERY_KEYS.Otc.Profile(network?.id!, address),
		async () => {
            let profile = {ipfsHash:null};
            try{
                 profile = await queryProfile(address);
            }catch(_){
                
            }
            let profileInfo:ProfileInfo = null;
            if(profile.ipfsHash !== null  && profile.ipfsHash != ""){
                profileInfo = await queryProfileInfo(profile.ipfsHash);
            }
            if(profileInfo === null){
                profileInfo =  {
                    ipfsHash: '',
                    account: address,
                    alias: '',
                    avatar:'',
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
            profileInfo.order = await queryOrder(address);
            profileInfo.account = address;
            profileInfo.volume = profileInfo.order?.volume??0;
            return profileInfo;
		},
		{
			enabled: isAppReady && isWalletConnected && !!walletAddress && !!network ,
			...options,
        }
    );
};

export default useProfileQuery;
