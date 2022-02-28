// @ts-nocheck
import { useQuery, UseQueryOptions } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';
import { concat as uint8ArrayConcat } from 'uint8arrays/concat';
import { appReadyState } from 'store/app';
import {Evidence} from './subgraph/types';
import QUERY_KEYS from 'constants/queryKeys';
import {ipfsEndPoint} from './subgraph/utils';
import {create as ipfsApi} from 'ipfs-http-client';
const ipfsClient = ipfsApi(ipfsEndPoint);
import {isWalletConnectedState, networkState } from 'store/wallet';

const useEvidenceQuery = (cid:string|null, options?: UseQueryOptions<Evidence>) => {
    const isAppReady = useRecoilValue(appReadyState);
    const network = useRecoilValue(networkState);
    const isWalletConnected = useRecoilValue(isWalletConnectedState);
    cid = cid??"";
	return useQuery<Evidence>(
		QUERY_KEYS.Otc.Evidence(cid),
		async () => {
            let data: Uint8Array = [];
            try{
                for await (const chunck of ipfsClient.cat(cid)){
                    data = uint8ArrayConcat(data, chunck);
                }
            }catch(err){
                return {ver:-1, dealID:-1, evidence:["","","",""], explanation:["","","",""], verdict:""}
            }
        
            let evidence: any = uint8ArrayToString(data);
            if(evidence){
                evidence = JSON.parse(evidence);
                return evidence as Evidence;
            }
        
            return {
                ver: -1,
                dealID: 0,
                evidence:[],
                explanation:[],
                verdict:'',
            };
		},
		{
			enabled: isAppReady && isWalletConnected && !!network && cid !== "",
			...options,
        }
    );
}

export default useEvidenceQuery;