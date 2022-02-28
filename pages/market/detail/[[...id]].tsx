import React,{useMemo,useState, useEffect} from 'react';
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
import BuyCoin from './components/BuyCoin';
import Button from 'components/Button';
import Input from 'components/Input/Input';
import LabelInput from '../../pending-order/components/label-input';
import ActionInput from './components/ActionInput';
import AmountIcon from 'public/images/market/amount-icon.png';
import RecordIcon from 'public/images/market/record-icon.png';
import TicketIcon from 'public/images/market/ticket-icon.png';
import ArrivalIcon from 'public/images/market/arrival-icon.png';
import {newProfileInfo} from 'queries/otc/subgraph/types'; 
let timer: number | null=null;
const TIME=60;
let time=60;
import useProfileHistoryQuery from "queries/otc/subgraph/useProfileHistoryQuery";

const Detail = () => {
    const router = useRouter();
	const id = useMemo(
		() => (router.query.id ? castArray(router.query.id)[0] : null),
		[router.query]
	);
	const { t } = useTranslation();
	const profileHistoryQuery = useProfileHistoryQuery();
	const data = profileHistoryQuery.data??[];
	const profile = data.find(i=>i.account === id);

	const [countDown,setCountDown]=useState(TIME);
    const [isCounting,setIsCounting]=useState(false);
    const [maxNum,setMaxNum]=useState();
    const [requestData,setRequestData]=useState({tel:'',code:''});
    const [selectVal,setSelectVal]=useState('')

	const handleGetVerifyCode=()=>{
        if(isCounting)return;
        setIsCounting(true);
        timer=setInterval(()=>{
            if(time-1===0){
                setIsCounting(false);
                clearInterval(timer as any);
            }
            time=time-1;
            setCountDown(time);
            if(time===0){
                time=TIME;
            }
        },1000)
    }
    useEffect(()=>{
        return ()=>{
            clearInterval(timer as any);
        }
    },[])

	if(profile == null){
		return null
	}

	const handleChange=(key:string,val:any)=>{
        setRequestData({...requestData,[key]:val})
    }

	const statsData=[
		{
			icon:AmountIcon,
			list:[
				{
					label:'remaining',
					val:`${profile?.order?.leftAmount??0}`
				},{
					label:'Min',
					val:'50'
				},{
					label:'Max',
					val:'1000'
				}
			]
		},{
			icon:RecordIcon,
			list:[
				{
					label:'Volume',
					val:`${profile?.volume??0}`
				},{
					label:'Locked',
					val:`${profile?.order?.lockedAmount??0}`
				},{
					label:'Disputed',
					val:`${profile?.disputeCount??0}`
				},{
					label:'Violated',
					val:`${profile?.violationCount??0}`
				}
			]
		},{
			icon:TicketIcon,
			list:[
				{
					label:'Penalty',
					val:'1000'
				},{
					label:'Compensated',
					val:'1000'
				},{
					label:'Shortest',
					val:`10 min`
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
					<Personal profile={profile}></Personal>
					{/*<PledgeWrap>
						<Pledge onSelectChange={()=>setListData(demoData)}></Pledge>
					</PledgeWrap>
					*/}
				</LeftBox>
				<RightBox>
					{
						statsData.map((v,i)=>
							<ItemCard key={i} {...v}></ItemCard>
						)
					}
				</RightBox>
			</Container>
			<Container>
				<Tradezone>
					<BuyCoin profile={profile} />
				</Tradezone>
				<PledgeInfoWrap>
					<PledgeTip>
						<PledgeTipTitle>Tip:</PledgeTipTitle>
						<PledgeTipDes>{t('modals.market.pledge-tool-tip')}</PledgeTipDes>
						<PledgeIndicator>Check bellow to bind the trusted verification source.</PledgeIndicator>
					</PledgeTip>
					<PledgeBindId>
						<ActionInput 
						label='Contact' 
						name='tel' 
						defaultValue='Type phone number' 
						value={requestData.tel} 
						btnText={isCounting?countDown+'s':'Get Code'}
						isNumber={true} 
						isBtnDisable={requestData.tel.length==0} 
						onBtnClick={handleGetVerifyCode}
						onValueChange={handleChange} />
						<ActionInput 
						label='Verification code' 
						name='code' 
						defaultValue='0-0-0-0' 
						value={requestData.code} 
						isNumber={true} 
						btnText='Bind'
						isBtnDisable={requestData.code.length==0} 
						onValueChange={handleChange} />
					</PledgeBindId>
				</PledgeInfoWrap>
			</Container>
			<Container>
			<FooterCard profile={profile}/>
			</Container>
		</>
	);
};

const Container = styled.div`
	font-family: ${(props) => props.theme.fonts.condensedMedium};

	padding: 0px 26px;
	display: flex;
	//flex-wrap: wrap;
`;

const LeftBox=styled.div`
	flex: 1;
	padding:26px 0px;
`

const RightBox=styled.div`
	flex: 1;
	margin-left: 26px;
	padding:26px 0px;
`
const Tradezone=styled.div`
	flex: 2;
//padding:26px 0px;
	margin-right: 26px;

	background: #203298;
    border-radius: 22px;
`
const PledgeInfoWrap = styled.div`
	//display: flex;
	flex-direction: column;
	justify-content: space-between;
	flex: 1;
	//margin-left: 26px;
	//padding:26px 0px;
    padding: 15px 26px 26px 26px;
    border-radius: 22px;
	background: #203298;
`

const PledgeIndicator = styled.div`
	margin-top: 15px;
	color: yellow;
	text-transform: uppercase;
	font-weight: bolder;
	text-align: center;
	text-decoration:underline;

	&:hover{
		color: red;
	}
`
const PledgeTipDes = styled.div`
	font-style: italic;
	color: silver;
`
const PledgeTip = styled.div`
	//text-transform: uppercase;

	//flex:1;
`

const PledgeTipTitle = styled.p`
	font-weight: bolder;
	font-size: 1.5rem;
`

const PledgeBindId = styled.div`
	margin-top: 45px;
	//::first-letterflex:1;

`

const BtnBox=styled.div`
	width: 100%;
	text-align: center;
`

const SubmitTxt=styled.span`
	display:inline-block;
	width: 300px;
	text-align: center;
	font-weight: bold;
	cursor: pointer;
`

export default Detail;
