import React,{useMemo, useState, useEffect} from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Button from 'components/Button';
import castArray from 'lodash/castArray';
import useDealHistoryQuery from "queries/otc/subgraph/useDealHistoryQuery";
import useEvidenceQuery from "queries/otc/useEvidenceQuery";
import {formatDate, ipfsEndPoint, GAS_LIMIT, GAS_PRICE, formatTimeLeft, DEAL_EXPIRED, ONE_HOUR, RESPONDE_EXPIRED, getAvatar} from "queries/otc/subgraph/utils";
import TxConfirmationModal from 'sections/shared/modals/TxConfirmationModal';
import {
	FormContainer,
	InputsContainer,
	InputsDivider,
	SettingsContainer,
	SettingContainer,
	ErrorMessage,
	TxModalContent,
	TxModalItem,
	TxModalItemSeperator,
} from 'sections/otc/common';
import { appReadyState } from 'store/app';
import { walletAddressState, isWalletConnectedState, networkState } from 'store/wallet';
import IconPlaceholder from 'public/images/deal/evidence.svg';

import DetailCard from '../components/detail-card';
import useSynthetixQueries from 'demaa-queries';
import { BigNumber } from 'ethers';
import audIcon from 'public/images/deal/aud.svg';

import BaseModal from 'components/BaseModal';
import Evidence from './components/evidence';
import {create as ipfsApi} from 'ipfs-http-client';
import { de } from 'date-fns/locale';
import {Deal} from "queries/otc/subgraph/types";



const ipfsClient = ipfsApi({url:ipfsEndPoint});

const Detail = () => {
    const router = useRouter();
	const { t } = useTranslation();
    const [arbitrationModal,setArbitrationModal]=useState(false);
    const [arbitrationHistoryModal,setArbitrationHistoryModal]=useState(false);
	const id = useMemo(
		() => (router.query.id ? castArray(router.query.id)[0] : null),
		[router.query]
	);
    const walletAddress = useRecoilValue(walletAddressState);
	const {useSynthetixTxn, useContractTxn } = useSynthetixQueries();
	const [actionState, setActionState] = useState<string>("");
	const [txModalOpen, setTxModalOpen] = useState<boolean>(false);
    const [arbitrationInfo, setArbitrationInfo] = useState({ver:-1, dealID:-1, evidence:["","","",""], explanation:["","","",""], verdict:""});
    const [arbitrationCid, setArbitrationCid] = useState("");
	const dealQuery = useDealHistoryQuery();
	const deals = dealQuery.isSuccess?dealQuery.data:[];

    const confirmDealTxn = useSynthetixTxn(
		"OTC",
		'confirmDeal',
		[BigNumber.from(id??0)], 
	{ gasPrice: GAS_PRICE.toBN(), gasLimit:GAS_LIMIT}
	);

	const cancelDealTxn = useSynthetixTxn(
		"OTC",
		'cancelDeal',
		[BigNumber.from(id??0)], 
	{ gasPrice: GAS_PRICE.toBN(), gasLimit:GAS_LIMIT}
	);

    const applyArbitrationTxn = useSynthetixTxn(
		"OTCDao",
		'applyAdjudication',
		[BigNumber.from(id??0), arbitrationCid], 
	{ gasPrice: GAS_PRICE.toBN(), gasLimit:GAS_LIMIT}
	);

	useEffect(() => {
		switch (confirmDealTxn.txnStatus) {
			case 'unsent':
				setTxModalOpen(false);
				break;
			case 'pending':
				setTxModalOpen(true);
				break;
			case 'confirmed':
				setTxModalOpen(false);
				//router.push('/loans/list');
				break;
		}
	}, [confirmDealTxn.txnStatus]);

	useEffect(() => {
		switch (cancelDealTxn.txnStatus) {
			case 'unsent':
				setTxModalOpen(false);
				break;
			case 'pending':
				setTxModalOpen(true);
				break;
			case 'confirmed':
				setTxModalOpen(false);
				//router.push('/loans/list');
				break;
		}
	}, [cancelDealTxn.txnStatus]);

    const deal = deals.find(i=>(i as Deal).dealID == Number(id));
    console.log()
    useEffect(() => {
		switch (applyArbitrationTxn.txnStatus) {
			case 'unsent':
				setTxModalOpen(false);
				break;
			case 'pending':
				setTxModalOpen(true);
				break;
			case 'confirmed':
				setTxModalOpen(false);
				//router.push('/loans/list');
				break;
		}
	}, [applyArbitrationTxn.txnStatus]);

    const evidenceQuery = useEvidenceQuery(deal?.adjudicationInfo?.evidence??null)
    const evidence = evidenceQuery.isSuccess?evidenceQuery.data:null;
    useEffect(()=>{
      if(evidence && evidence.ver > arbitrationInfo.ver){
          setArbitrationInfo(evidence);
      }

    }, [deal?.adjudicationInfo, evidence]);

    if(null == deal){
        return null;
    }

	const handleConfirmDeal= ()=>{
		setTxModalOpen(true);
		setActionState("confirm");
        confirmDealTxn.mutate();
	}

	const handleCancelDeal= ()=>{
		setTxModalOpen(true);
		setActionState("cancel");
        cancelDealTxn.mutate();
	}

    const confirmLeftTime = (deal.cTime + ONE_HOUR) - Date.now();
    let timeLeftPromt = "Expired";
    if(confirmLeftTime > 0){
        timeLeftPromt = formatTimeLeft(confirmLeftTime);
    }
	const listDataFrist=[
        {
            key:'1',
            list:[
                {
                    label:'DEAL ID',
                    val: deal?.dealID??0
                },{
                    label:'ORDER ID',
                    val:deal?.orderID??0
                },
                {
                    label:'MAKER',
                    val: deal?.maker
                },
                {
                    label:'TAKER',
                    val:deal?.taker
                },
                {
                    label:'CTIME',
                    val: formatDate(new Date(deal?.cTime), 'yyyy-MM-dd hh:mm:ss')
                },
                {
                    label:'UTIME',
                    val: formatDate(new Date(deal?.uTime), 'yyyy-MM-dd hh:mm:ss')
                },
                 {
                    label:'COIN',
                    val:deal?.coinCode
                },{
                    label:'UNIT',
                    val:deal?.currencyCode
                }
            ]
        },{
            key:'2',
            list:[
                {
                    label:'AMOUNT',
                    val:`${Number(deal?.amount).toFixed(2)} ${deal?.coinCode}`
                },{
                    label:'PRICE',
                    val:`${deal?.price} ${deal?.currencyCode}`
                },{
                    label:'FEE',
                    val: `${Number(deal?.fee).toFixed(1)} ${deal?.coinCode}`
                },{
                    label:'PAYMENT',
                    val:`${(Number(deal?.amount) * Number(deal?.price)).toFixed(2)} ${deal?.currencyCode}`
                },{
                    label:'COLLATERAL',
                    val: `${Number(deal?.collateral).toFixed(2)} ${deal?.collateralType}`
                },{
                    label:'LOCKED',
                    val: `${Number(deal?.lockedAmount).toFixed(2)} ${deal?.coinCode}`
                },
                {
                    label:'STATUS',
                    val:deal?.dealState
                },{
                    label:'ACTION',
                    val: <HandleBtnGroup>
                    {
                    deal.dealState === 'Confirming' ? ( walletAddress === deal.maker?
                        <Button variant="text" size='xl'><SubmitTxt onClick={handleConfirmDeal}>Confirm ({timeLeftPromt})</SubmitTxt></Button>:
                        <Button variant="text" size='xl'><SubmitTxt onClick={handleCancelDeal}>Cancel ({timeLeftPromt})</SubmitTxt></Button>):"Noop"
                        }
                </HandleBtnGroup>
                }
            ]
        }
    ]

    const onUploadEvidence=(index:number, cid:string)=>{
        if(!deal.adjudicationInfo){
            arbitrationInfo.evidence[index] = cid;
            setArbitrationInfo(Object.assign({...arbitrationInfo}));
        } else {
            arbitrationInfo.explanation[index] = cid;
            setArbitrationInfo(Object.assign({...arbitrationInfo}));
        }
    }
    
    const onApplyForArbitration = ()=>{
        arbitrationInfo.dealID = deal.dealID;
        arbitrationInfo.ver += 1;
        const arbitration = JSON.stringify(arbitrationInfo);
        ipfsClient.add(arbitration).then(r=>{
            // shutdown arbitration dialog
            setArbitrationModal(false);
            setArbitrationCid(r.cid.toString());
            setTxModalOpen(true);
            applyArbitrationTxn.mutate();
        }).catch(e=>{})
    }

    const timeLeft = (deal.cTime + DEAL_EXPIRED) - Date.now();

    const ArbitrationInfo = ()=>{
        if(deal.dealState !== 'Confirming' || timeLeft > 0){
            return <DealNormalMsg>DEAL IS NORMAL</DealNormalMsg>;
        } else if(deal.adjudicationInfo === null){
            return <Button variant="text" size='md'>
            <SubmitTxt onClick={()=>setArbitrationModal(true)}>Deal has been expired, apply for arbitration here</SubmitTxt>
          </Button>
        } else if((deal.adjudicationInfo.cTime + RESPONDE_EXPIRED - Date.now()) <= 0){
            return <Button variant="text" size='md'>
                    <SubmitTxt>Arbitraion Expired</SubmitTxt>
                  </Button>
        }else if((deal.adjudicationInfo?.plaintiff === walletAddress && deal.adjudicationInfo.evidence === "") ||
                 (deal.adjudicationInfo?.defendant === walletAddress && deal.adjudicationInfo.explanation === "")){
            return <>
                <Button variant="text" size='md'>
                    <SubmitTxt onClick={()=>setArbitrationModal(true)}>You have been charged, defend yourself here</SubmitTxt>
                </Button>
                <Button variant="text" size='md'>
                    <SubmitTxt onClick={()=>setArbitrationHistoryModal(true)}>View arbitration progress...</SubmitTxt>
                </Button>
                </>
        } else {
            return<Button variant="text" size='md'>
              <SubmitTxt onClick={()=>setArbitrationHistoryModal(true)}>You have submitted evidence, View arbitration progress...</SubmitTxt>
              </Button>
        }
    }

	return (
		<>
			<Head>
				<title>{t('exchange.detail.page-title')}</title>
			</Head>
			<Container>
                {
                    listDataFrist.map((v,i)=>
                        <DetailCard key={v.key} isLast={false} list={v.list} showHistory={setArbitrationHistoryModal}></DetailCard>
                    )
                }
			</Container>
            <Arbitration>
            <ArbitrationIcon ><img src={audIcon.src}/></ArbitrationIcon>
            <ArbitrationInfo/>
			</Arbitration>
            {actionState === "confirm" && confirmDealTxn.errorMessage !== "" && <ErrorMessage>{confirmDealTxn.errorMessage}</ErrorMessage>}
			{actionState === "cancel" && cancelDealTxn.errorMessage !== "" && <ErrorMessage>{cancelDealTxn.errorMessage}</ErrorMessage>}
            {applyArbitrationTxn.errorMessage !== "" && <ErrorMessage>{applyArbitrationTxn.errorMessage}</ErrorMessage>}

				{txModalOpen && actionState === "confirm" && (
				<TxConfirmationModal
					onDismiss={() => setTxModalOpen(false)}
					txError={confirmDealTxn.errorMessage}
					attemptRetry={confirmDealTxn.mutate}
					content={
						<TxModalContent/>
					}
				/>
				)}

				
			{txModalOpen  &&  actionState === "cancel" && (
				<TxConfirmationModal
					onDismiss={() => setTxModalOpen(false)}
					txError={cancelDealTxn.errorMessage}
					attemptRetry={cancelDealTxn.mutate}
					content={
						<TxModalContent/>
					}
				/>
				)}

            <StyledBaseModal isOpen={arbitrationModal} onDismiss={()=>setArbitrationModal(false)}>
                <ModalWrap>
                    <MTitile>Submit evidence</MTitile>
                    <MDesc>
                    The evidence needs to be the transfer record for more than 3 days or the receipt record for more than 1 day from the time of transaction generation, and a maximum of 4 screenshots of transaction records can be submitted. 
                    Evidence pictures must be clear, time-continuous, and without PS modification. The system will automatically use the picture detection tool to judge whether the evidence has been modified. Once the picture is found to be modified, the arbitration will determine the evidence provider as the perpetrator and execute the final arbitration.
                        {/*
                        证据需为交易生成时间开始3天以上的转账记录或1天以上的收款记录，最多可提交4张交易
                        记录截图。证据图片需清晰，时间连续，无PS修改。系统将自动使用图片检测工具对证据是
                        否存在修改情况作出判断，一旦发现图片有修改痕迹，仲裁将该证据提供者判定为作恶者，
                        并执行最终仲裁。
                        */}
                    </MDesc>
                    <EvidenceList>
                        {
                            [1,2,3,4].map((_, i)=>
                                <Evidence key={i} index={i} onUpload={onUploadEvidence} evidence={arbitrationInfo.evidence[i]}></Evidence>
                            )
                        }
                    </EvidenceList>
                    <HandleBtnGroup>
                    <Button variant="primary" size='md'>
                                <SubmitTxt onClick={onApplyForArbitration}>Submit</SubmitTxt>
                    </Button>
                    </HandleBtnGroup>
                </ModalWrap>
            </StyledBaseModal>

            <ArbitrationHistory isOpen={arbitrationHistoryModal} onDismiss={()=>setArbitrationHistoryModal(false)}>
                <ModalWrap>
                    <MTitile>Arbitration History</MTitile>
                    <MLABEL>
                        <div className='ArbitrationRole'>Plaintiff</div>
                        <div className='ArbitrationAddress'>{deal.adjudicationInfo?.plaintiff}</div>
                    </MLABEL>
                    <ArbitrationRecords>
                    {
                            arbitrationInfo.evidence.map(v=>
                                <ImgWrapper key={v}>
                                    <img className='img' src={getAvatar(v, IconPlaceholder)}/>
                                </ImgWrapper>
                            )
                        }
                    </ArbitrationRecords>
                    <MLABEL>
                        <div className='ArbitrationRole'>Defendant</div>
                        <div className='ArbitrationAddress'>{deal.adjudicationInfo?.defendant}</div>
                    </MLABEL>
                    <ArbitrationRecords>
                    {
                           arbitrationInfo.explanation.map(v=>
                            <ImgWrapper key={v}>
                                <img className='img' src={getAvatar(v, IconPlaceholder)}/>
                            </ImgWrapper>
                            )
                    }
                    </ArbitrationRecords>
                </ModalWrap>
            </ArbitrationHistory>
		</>
	);
};

const Container = styled.div`
	font-family: ${(props) => props.theme.fonts.condensedMedium};
	padding: 26px;
	display: flex;
    justify-content: space-between;
    width: 100%;
    >div{
        width: 49%;
       >div{
        margin-right: 1%;
        margin-bottom: 32px;
        >div{
            width: 50%;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
       }
    }
`;

const SubmitTxt = styled.span`
    display: inline-block;
    color:yellow;
    text-decoration: underline;
    &:hover{
        color:red;
    }
`
const DealNormalMsg = styled.div`
    color:yellow;
    font-weight:bold;
`

const Arbitration = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin:0px 26px 0px 26px;
	padding: 26px;
    background: #203298;
    border-radius: 13px;
`

const ArbitrationIcon = styled.div`
        display: flex;
        align-items: center;
        justify-content: center;
        //margin-top: 26px;
        margin-bottom: 26px;
`

const HandleBtnGroup=styled.div`
    width: 100%;
    margin:auto;
    padding: 0px 26px;
    button{
        width: 100%;
    }
`

const ModalWrap=styled.div`
    /* padding: 16px 25px 33px; */
`
const MTitile=styled.div`
    font-size: 22px;
    font-weight: bold;
    color: #FFFFFF;
    text-align: left;
`

const MLABEL = styled.div`
    width: 100%;
    display: flex;
    font-size: 1.5rem;
    text-transform:uppercase;
    margin-top: 20px;
    //margin-bottom: 10px;
    background-color: #1A2479;

    .ArbitrationRole{
        flex: 2;
        color: white;

    }
    .ArbitrationAddress{
        flex: 8;
        color: yellow;
        text-align: end;
    }
`
const MDesc=styled.div`
    border-style: solid;
    //font-style: italic;
    text-transform:uppercase;
    font-size: 18px;
    font-weight: 400;
    color: gray;
    line-height: 29px;
    margin-top: 30px;
    margin-bottom: 10px;
    padding: 0 35px;
`
const EvidenceList=styled.div`
    margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    justify-content: center;
    grid-column-gap: 40px;
    margin-bottom: 20px;
`

const BtnBox=styled.div`
    width: 100%;
    text-align: right;
    margin-top: 10px;
`

const ArbitrationRecords=styled.div`
    display: flex;
    padding: 20px 0px 20px 0px;
    justify-content: space-around;
    background-color: rgba(3, 11, 80,.23);

`

const ImgWrapper=styled.div`
    width: 180px;
    height: 180px;
    border-color: gray;
    border-style: dashed;
    img{
        height:100%;
        width:100%;
        object-fit: contain;
    }
`

const StyledBaseModal = styled(BaseModal)`
	[data-reach-dialog-content] {
		width: 910px;
	}
`;

const ArbitrationHistory = styled(StyledBaseModal)`

`

const SubmitBtn=styled.div`
    margin: 30px auto 0;
    width: 476px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #F86C29;
    border-radius: 11px;
    font-size: 20px;
    font-weight: bold;
    color: #FFFFFF;
`

export default Detail;
