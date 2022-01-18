import React,{useMemo} from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import castArray from 'lodash/castArray';
import Personal from './components/personal';
import Pledge from './components/pledge';
import ItemCard from './components/item-card';
import FooterCard from './components/footer-card';

import AmountIcon from 'public/images/market/amount-icon.png';
import RecordIcon from 'public/images/market/record-icon.png';
import TicketIcon from 'public/images/market/ticket-icon.png';
import ArrivalIcon from 'public/images/market/arrival-icon.png';


const Detail = () => {
    const router = useRouter();
	const marketQuery = useMemo(
		() => (router.query.id ? castArray(router.query.id)[0] : null),
		[router.query]
	);
	const { t } = useTranslation();
	const listData=[
		{
			icon:AmountIcon,
			list:[
				{
					label:'剩余数量',
					val:'1000'
				},{
					label:'最小交易数量',
					val:'50'
				},{
					label:'最大交易数量',
					val:'1000'
				}
			]
		},{
			icon:RecordIcon,
			list:[
				{
					label:'成交数量',
					val:'25000'
				},{
					label:'锁定数量',
					val:'50'
				},{
					label:'争议次数',
					val:'1000'
				},{
					label:'失信次数',
					val:'1000'
				}
			]
		},{
			icon:TicketIcon,
			list:[
				{
					label:'罚款金额',
					val:'1000'
				},{
					label:'补偿金额',
					val:'1000'
				},{
					label:'最短用时',
					val:'10分钟'
				}
			]
		},{
			icon:ArrivalIcon,
			list:[
				{
					label:'实际到帐',
					val:'1000'
				},{
					label:'手续费',
					val:'1000'
				},{
					label:'实际抵押',
					val:'1000'
				}
			]
		}
	]
	return (
		<>
			<Head>
				<title>{t('market.detail.page-title')}</title>
			</Head>
			<Container>
				<LeftBox>
					<Personal></Personal>
					<PledgeWrap>
						<Pledge></Pledge>
					</PledgeWrap>
				</LeftBox>
				<RightBox>
					{
						listData.map((v,i)=>
							<ItemCard key={i} {...v}></ItemCard>
						)
					}
				</RightBox>
			</Container>
			<SubmitBtn>提交</SubmitBtn>
			<FooterCard></FooterCard>
		</>
	);
};

const Container = styled.div`
	padding: 26px;
	display: flex;
	flex-wrap: wrap;
`;

const PledgeWrap = styled.div`
	margin-top: 24px;
`

const LeftBox=styled.div`
	flex: 1;
`

const RightBox=styled.div`
	flex: 1;
	margin-left: 26px;
`
const SubmitBtn=styled.div`
	width: 54vw;
	height: 54px;
	line-height: 54px;
	text-align: center;
	background: #F86C29;
	border-radius: 14px;
	font-size: 24px;
	font-weight: bold;
	color: #FFFFFF;
	margin: auto;
	cursor: pointer;
`

export default Detail;
