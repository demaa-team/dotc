import React, { useState, useEffect } from 'react';
import { UseQueryResult } from 'react-query';

import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { useRecoilValue, constSelector } from 'recoil';
import { useRouter } from 'next/router';
import Pagination from 'components/Table/Pagination'
import styled from 'styled-components';
import WeiXinImg from 'public/images/market/weixin.png';
import PayPalImg from 'public/images/market/paypal.png';
import Img, { Svg } from 'react-optimized-image';
import useOrderHistoryQuery from "queries/otc/subgraph/useOrderHistoryQuery";
import useProfileHistoryQuery from "queries/otc/subgraph/useProfileHistoryQuery";
import {Order, ProfileInfo, PayType} from "queries/otc/subgraph/types";
import {ipfsRepo, defaultAvatar, ipfsEndPoint, getAvatar} from "queries/otc/subgraph/utils";
import WechatIcon from 'assets/order/wechat.svg';
import AliylipayIcon from 'assets/order/alipay.svg';
import PaypalIcon from 'assets/order/paypal.svg';
import VisaIcon from 'assets/order/visa.svg';
import OtherIcon from 'assets/order/other.svg';

const Market = () => {
	const router = useRouter();
	const { t } = useTranslation();
	const profileHistoryQuery = useProfileHistoryQuery();
	const data = profileHistoryQuery.isSuccess?profileHistoryQuery.data: [];

	console.log(data)
	const itemCardContentData=[
		{
			label:'remaining',
			val:1000,
			unit:'USDT'
		},
		{
			label:'price',
			val:6.33,
			unit:'CNY'
		},
		{
			label:'volume',
			val:250000,
			unit:'USDT'
		},
		{
			label:'time cost',
			val:10,
			unit:'MIN'
		}
	]

	const handleJumpDetail=(account)=>{
		router.push(`/market/detail/${account}`);
	}

	const [pageIndex,setPageIndex] = useState(0)
	const [pageCount,setPageCount] = useState(20)
	const [canNextPage,setCanNextPage] = useState(true)
	const [canPreviousPage,setCanPreviousPage]=useState(false)
	const gotoPage=(page:number)=>{
		setPageIndex(page)
	}

	const previousPage=()=>{
		setPageIndex(pageIndex-1)
	}

	const nextPage=()=>{
		setPageIndex(pageIndex+1)
	}

	useEffect(() => {
		if(pageIndex===0){
			setCanPreviousPage(false)
		}else{
			setCanPreviousPage(true)
		}
		if(pageIndex === pageCount-1){
			setCanNextPage(false)
		}else{
			setCanNextPage(true)
		}
	},[pageIndex])

	return (
		<>
			<Head>
				<title>{t('market.page-title')}</title>
			</Head>
			<Container>
				{
					data.map(p=>(
						<ItemCard key={p.account}>
							<HeaderBox>
								<div className="avatarBox">
									<img className='avatar' src={getAvatar(p.avatar)} alt="" />
								</div>
								<div className="name">{p.alias}</div>
								<div className="desc">{p.ad}</div>
							</HeaderBox>
							<SplitLine/>
							<ItemContent>
								{
									itemCardContentData.map((v,i)=> {
										if(0 == i ){
											return	<div className="row" key={i}>
											<div className="label">{v.label}</div>
											<div className="val">{p.order?.leftAmount??0}</div>
											<div className="unit">{v.unit}</div>
										</div>
										} else if(1 == i){
											return	<div className="row" key={i}>
											<div className="label">{v.label}</div>
											<div className="val">{p.order?.price??0}</div>
											<div className="unit">{v.unit}</div>
										</div>
										} else if(2 == i) {
											return	<div className="row" key={i}>
											<div className="label">{v.label}</div>
											<div className="val">{p.order?.volume??0}</div>
											<div className="unit">{v.unit}</div>
										</div>
										} else if(3 == i) {
											return	<div className="row" key={i}>
											<div className="label">{v.label}</div>
											<div className="val">{p.order?.leftAmount??0}</div>
											<div className="unit">{v.unit}</div>
										</div>
										}
									}
									)
								}
								<div className="row">
									<div className="label">Pay Methods</div>
									<div className="payType">
										{
											p.pays.map((v,i)=>{
												if(v.type === 'wechat'){
													return <Img className='payImg' src={WechatIcon}/>
												} else if(v.type === 'alipay') {
													return <Img className='payImg' src={AliylipayIcon}/>
												}else if(v.type === 'paypal') {
													return <Img className='payImg' src={PaypalIcon}/>
												}else if(v.type === 'visa') {
													return <Img className='payImg' src={VisaIcon}/>
												} else {
													return <Img className='payImg' src={OtherIcon}/>
												}
											})
										
										}
									
									</div>
								</div>
								<JumpBtn className='jumpBtn' onClick={()=>handleJumpDetail(p.account)}/>
							</ItemContent>
						</ItemCard>
					))
				}
			</Container>
			<PaginationBox>
				<Pagination
					pageIndex={pageIndex}
					pageCount={pageCount}
					canNextPage={canNextPage}
					canPreviousPage={canPreviousPage}
					setPage={gotoPage}
					previousPage={previousPage}
					nextPage={nextPage}
				/>
			</PaginationBox>
		</>
	);
};

const Container = styled.div`
	font-family: ${(props) => props.theme.fonts.condensedMedium};
	padding: 80px 10px;
	/* display: flex;
    flex-wrap: wrap;
	justify-content: center; */
	display: grid;
	justify-content: center;
	grid-template-columns: repeat(auto-fill,440px);
	grid-gap: 35px 35px;
`;

const ItemCard= styled.div`
	/* width: 440px;
	height: 680px; */
	/* border: 2px solid #1F54A5; */
	/* border-image: linear-gradient(0deg, #5AD3C5, #1CB6CC) 10 10; */
	/* background: linear-gradient(0deg, rgba(90, 211, 197,0.26) 0%, rgb(28, 182, 204,0.26) 99%); */
	background: #203298;
	/* border-radius: 10px; */
	padding: 30px 20px;
	/* margin: 35px; */
	box-shadow: 0px 0px 20px rgb(0 0 0 / 20%);
	position: relative;
	&:hover{
		/* border-color: #1EB7CC; */
		background: #2839C1;
		box-shadow: 0 0 28px -12px #000;
		.jumpBtn{
			background-image: url('/images/market/arrow-right-hover.png');
		}
		&::before{
			background: #F86C29;
		}
	}
	&::before{
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 4px;
    	height: 466px;
		background: #5C6CF2;
	}
`;

const HeaderBox=styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	.avatarBox{
		width: 122px;
		height: 122px;
		border: 2px dashed #49C8BA;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.avatar{
		width: 104px;
		height: 104px;
		border-radius: 50%;
	}
	.name{
		//color:yellow;
		font-size: 25px;
		font-weight:bolder;
		text-align: center;
		margin-top: 20px;
	}
	.desc{
		//color:yellow;
		text-align: center;
		margin-top: 22px;
	}
`;

const SplitLine =styled.div`
	width: 100%;
	height: 2px;
	background: linear-gradient(251deg, #5AD2C5 0%, #20B9CD 100%);
	border-radius: 1px;
	margin-top: 17px;
`

const PaginationBox=styled.div`
	width: 100%;
	padding-right: 20%;
`

const ItemContent=styled.div`
	margin-top: 17px;
	.row{
		display: flex;
		margin-bottom: 23px;
		.label{
			flex:1;
			//color:gray;
			font-weight: bold;
			text-transform:uppercase;
			&::before{
				content:'';
				display: inline-block;
				width: 10px;
				height: 10px;
				background: #F86C29;
				border-radius: 50%;
				margin-right: 10px;
			}
			font-size: 15px;
		}
		.val{
			flex: 1;
			width: 80px;
			height: 35px;
			font-weight: bolder;
			line-height: 35px;
			text-align:center;
			color:red;
			background: rgba(7, 20, 92, 0.54);
			margin-left: 30px;
		}
		.unit{
			flex: 1;
			height: 35px;
			padding-left: 20px;
			line-height: 35px;
			text-align: left;
			font-weight: bold;
			//color:gray;
		}
		.payType{
			flex:1;
			height: 35px;
			//margin-left: 30px;
			.payImg{
				width: 27px;
				height: 27px;
				margin-right: 5px;
			}
		}
	}
`

const JumpBtn=styled.div`
	width: 66px;
	height: 66px;
	margin: 48px auto 0;
	background-image: url('/images/market/arrow-right.png');
	background-size: 100%;
	cursor: pointer;
`

export default Market;
