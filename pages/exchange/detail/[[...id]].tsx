import React,{useMemo} from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import castArray from 'lodash/castArray';
// import Personal from './components/personal';
// import Pledge from './components/pledge';
// import ItemCard from './components/item-card';
import DetailCard from '../components/detail-card';

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
        },{
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
				<title>{t('staking.page-title')}</title>
			</Head>
			<Container>
                {
                    listData.map(v=>
                        <DetailCard key={v.key} list={v.list}></DetailCard>
                    )
                }

			</Container>
            <HandleBtnGroup>
                <div className="btn">确认</div>
                <div className="btn">取消</div>
                <div className="btn">申请仲裁</div>
                <div className="btn">辩护</div> 
            </HandleBtnGroup>
		</>
	);
};

const Container = styled.div`
	padding: 26px;
	display: grid;
    justify-content: center;
    grid-template-columns: repeat(auto-fill, 760px);
    grid-column-gap: 26px;
    grid-row-gap: 22px;
`;

const HandleBtnGroup=styled.div`
    display: grid;
    grid-template-columns: calc(50% - 13px) calc(50% - 13px);
    grid-template-rows: 60px 60px;
    grid-row-gap: 17px;
    grid-column-gap: 26px;
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

export default Detail;
