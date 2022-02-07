import React,{useMemo, useState} from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Button from 'components/Button';
import castArray from 'lodash/castArray';
// import Personal from './components/personal';
// import Pledge from './components/pledge';
// import ItemCard from './components/item-card';
import DetailCard from '../components/detail-card';

import BaseModal from 'components/BaseModal';
import Evidence from './components/evidence';


const Detail = () => {
    const router = useRouter();
	const { t } = useTranslation();
    const [arbitrationModal,setArbitrationModal]=useState(false);
    const [arbitrationHistoryModal,setArbitrationHistoryModal]=useState(false);

	const listDataFrist=[
        {
            key:'1',
            list:[
                {
                    label:'交易ID',
                    val:'1'
                },{
                    label:'挂单ID',
                    val:'1'
                },{
                    label:'商品类型',
                    val:'USDT'
                },{
                    label:'货币类型',
                    val:'CNY'
                },{
                    label:'交易价格',
                    val:'6.33'
                }
            ]
        },{
            key:'2',
            list:[
                {
                    label:'Maker',
                    val:'0xxx11'
                },{
                    label:'Taker',
                    val:'0xxx31'
                },{
                    label:'创建时间',
                    val:'2021.12.01'
                },{
                    label:'货币类型',
                    val:'CNY'
                },{
                    label:'交易价格',
                    val:'6.33'
                },{
                    label:'到账数量',
                    val:'980'
                }
            ]
        }
    ]

    const listDataSecond=[
        {
            key:'3',
            list:[
                {
                    label:'Maker',
                    val:'0xxx11'
                },{
                    label:'Taker',
                    val:'0xxx31'
                },{
                    label:'创建时间',
                    val:'2021.12.01'
                },{
                    label:'货币类型',
                    val:'CNY'
                },{
                    label:'交易价格',
                    val:'6.33'
                }
            ]
        },{
            key:'4',
            list:[
                {
                    label:'Maker',
                    val:'0xxx11'
                },{
                    label:'Taker',
                    val:'0xxx31'
                },{
                    label:'创建时间',
                    val:'2021.12.01'
                },{
                    label:'货币类型',
                    val:'CNY'
                }
            ]
        }
    ]

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
            <Container>
                {
                    listDataSecond.map((v,i)=>
                        <DetailCard key={v.key} list={v.list} isLast={i===listDataSecond.length-1} showHistory={setArbitrationHistoryModal}></DetailCard>
                    )
                }
			</Container>
            <HandleBtnGroup>
                <Button variant="primary" size='xl'>
                    <SubmitTxt width='100%'>确认</SubmitTxt>
                </Button>
                <Button variant="primary" size='xl' disabled>
                    <SubmitTxt width='100%'>取消</SubmitTxt>
                </Button>
                <Button variant="primary" size='xl' onClick={()=>setArbitrationModal(true)}>
                    <SubmitTxt width='100%'>申请仲裁</SubmitTxt>
                </Button>
                <Button variant="primary" size='xl' disabled>
                    <SubmitTxt width='100%'>辩护</SubmitTxt>
                </Button>
            </HandleBtnGroup>

            <StyledBaseModal isOpen={arbitrationModal} onDismiss={()=>setArbitrationModal(false)}>
                <ModalWrap>
                    <MTitile>申请仲裁</MTitile>
                    <MDesc>
                        证据需为交易生成时间开始3天以上的转账记录或1天以上的收款记录，最多可提交4张交易
                        记录截图。证据图片需清晰，时间连续，无PS修改。系统将自动使用图片检测工具对证据是
                        否存在修改情况作出判断，一旦发现图片有修改痕迹，仲裁将该证据提供者判定为作恶者，
                        并执行最终仲裁。
                    </MDesc>
                    <EvidenceList>
                        {
                            [1,2,3,4].map(v=>
                                <Evidence key={v}></Evidence>
                            )
                        }
                    </EvidenceList>
                    <SubmitBtn>提交</SubmitBtn>
                </ModalWrap>
            </StyledBaseModal>

            <StyledBaseModal isOpen={arbitrationHistoryModal} onDismiss={()=>setArbitrationHistoryModal(false)}>
                <ModalWrap>
                    <MTitile>查看仲裁和申诉历史</MTitile>
                    <MDesc>
                        仲裁记录
                    </MDesc>
                    <ArbitrationRecords>
                    {
                            [1,2,3,4].map(v=>
                                <ImgWrapper key={v}>
                                    <img className='img' src="http://m.imeitou.com/uploads/allimg/2016062920/ke4rrvvmx5g.jpg"/>
                                </ImgWrapper>
                            )
                        }
                    </ArbitrationRecords>
                    <MDesc>
                        申诉记录
                    </MDesc>
                    <ArbitrationRecords>
                    {
                            [1,2,3,4].map(v=>
                                <ImgWrapper key={v}>
                                    <img className='img' src="http://m.imeitou.com/uploads/allimg/2016062920/ke4rrvvmx5g.jpg"/>
                                </ImgWrapper>
                            )
                        }
                    </ArbitrationRecords>
                    <BtnBox>
                        <Button variant="primary" size='xl' onClick={()=>setArbitrationHistoryModal(false)}>
                            <SubmitTxt width='100%'>取消</SubmitTxt>
                        </Button>    
                    </BtnBox>
                </ModalWrap>
            </StyledBaseModal>


		</>
	);
};

const Container = styled.div`
	padding: 26px;
	display: flex;
    justify-content: space-around;
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
    width:${(props) => props.width};;
`

const HandleBtnGroup=styled.div`
    display: grid;
    grid-template-columns: calc(50% - 13px) calc(50% - 13px);
    grid-template-rows: 60px 60px;
    grid-row-gap: 17px;
    grid-column-gap: 26px;
    width: 84%;
    margin:auto;
    .btn{
        line-height: 60px;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        color: #FFFFFF;
        background: #203298;
        border-radius: 18px;
        cursor: pointer;
        &:hover{
            background: #F86C29;
        }
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
const MDesc=styled.div`
    font-size: 18px;
    font-weight: 400;
    color: #FFFFFF;
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
`

const BtnBox=styled.div`
    width: 100%;
    text-align: right;
    margin-top: 10px;
`

const ArbitrationRecords=styled.div`
    display: flex;
    justify-content: space-between;
`

const ImgWrapper=styled.div`
    width: 24%;
    img{
        height:120px
    }
`

const StyledBaseModal = styled(BaseModal)`
	[data-reach-dialog-content] {
		width: 910px;
	}
`;

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
