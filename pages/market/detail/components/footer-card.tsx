import React,{useMemo} from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import castArray from 'lodash/castArray';

import WeiXinIcon from 'public/images/market/weixin-icon.png';
import PaypalIcon from 'public/images/market/paypal-icon.png';
import PhoneIcon from 'public/images/market/phone-icon.png';


const FooterCard=()=>{
    return (
        <Container>
            <div className="itemBox">
                <div className="title">联系方式</div>
                <div className="row">
                    <img className='icon' src={PhoneIcon} alt="" />
                    <div className="desc">+8612345678</div>
                </div>
                <div className="row">
                    <img className='icon' src={WeiXinIcon} alt="" />
                    <div className="desc">+8612345678</div>
                </div>
            </div>
            <div className="itemBox">
            <div className="title">支付方式</div>
                <div className="row">
                    <img className='icon' src={WeiXinIcon} alt="" />
                    <div className="desc">+8612345678</div>
                </div>
                <div className="row">
                    <img className='icon' src={PaypalIcon} alt="" />
                    <div className="desc">+8612345678</div>
                </div>
            </div>
        </Container>
    )
}

const Container=styled.div`
    width: 100%;
    height: 210px;
    background: #203298;
    border-radius: 22px;
    display: flex;
    justify-content: space-between;
    padding: 0 200px;
    margin-top: 27px;
    .itemBox{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .title{
            width: 124px;
            text-align: center;
            font-size: 22px;
            font-weight: 400;
            color: #FFFFFF;
            padding: 6px 14px;
            border-bottom: 2px solid #5473E8;
        }
        .row{
            margin-top: 20px;
            margin-left: -60px;
            display: flex;
            align-items: center;
        }
        .icon{
            width: 20px;
            height: 20px;
            
        }
        .desc{
            margin-left: 30px;
            font-size: 22px;
            font-weight: bold;
            color: #FFFFFF;
        }
    }
`


export default FooterCard;