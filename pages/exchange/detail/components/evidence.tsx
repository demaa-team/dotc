// @ts-nocheck
import React,{useMemo, useState, FC} from 'react';
import styled from 'styled-components';
import Img from 'react-optimized-image';
import Button from 'components/Button';
import Upload from 'rc-upload';
import IconPlaceholder from 'public/images/deal/evidence.svg';
import {ipfsRepo, defaultAvatar, ipfsEndPoint, GAS_LIMIT, GAS_PRICE, USDT_ADDRESS, getAvatar} from "queries/otc/subgraph/utils";
import {create as ipfsApi} from 'ipfs-http-client';

const ipfsClient = ipfsApi({url:ipfsEndPoint});

type EvidenceProps = {
index:number;
onUpload:(index:number, cid:string)=>void;
evidence:any;
};

const Evidence:FC<EvidenceProps> =({index, onUpload, evidence = IconPlaceholder})=>{

    const UploadProps={
		type: 'drag',
		action: async (file) => {
			if(file){
				try{
					const ret = await ipfsClient.add(file);
					if(ret){
                        onUpload(index, ret.cid.toString());
					}
				}catch(_){

				}
			}
		},
		onStart(file:any) {
		},
		onSuccess(ret:any) {
		},
		onError(err:any) {
		},
	}
    return (
        <Container>
            <Upload {...UploadProps}>
            <ImgWrapper>
              <img src={evidence ===""?IconPlaceholder:getAvatar(evidence)}/>
              <div>{index}</div>
              </ImgWrapper>
            </Upload>
        </Container>
    )
}
const Container=styled.div`
    display:flex;
    justify-content: space-around;
    align-items: center;
`
const ImgWrapper=styled.div`
    border-style: dashed;
    border-color: gray;
    width: 180px;
    height: 180px;
    position:relative;
    &:hover{
            cursor: pointer;
        }
    div{
        color:yellow;
        position: absolute;
        text-align:center;
        font-size: 120px;
        top:0;
        left:55px;
    }
    img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`


export default Evidence;
