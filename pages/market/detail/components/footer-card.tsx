import React,{useEffect, useMemo,useRef, useState, FC} from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import castArray from 'lodash/castArray';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
    FlexDiv,
	Tooltip,
} from 'styles/common';
import Img, { Svg } from 'react-optimized-image';

import PhoneIcon from 'assets/order/phone.svg';

import WechatIcon from 'assets/order/wechat.svg';
import AliylipayIcon from 'assets/order/alipay.svg';
import PaypalIcon from 'assets/order/paypal.svg';
import VisaIcon from 'assets/order/visa.svg';
import OtherIcon from 'assets/order/other.svg';

import WhatsappIcon from 'assets/order/whatsapp.svg';
import LineIcon from 'assets/order/line.svg';
import TgIcon from 'assets/order/telegram.svg';

import CopyIcon from 'assets/svg/app/copy.svg';
import CheckIcon from 'assets/svg/app/check.svg';
import { isTypeSystemExtensionNode } from 'graphql';
import {ProfileInfo}  from 'queries/otc/subgraph/types';

type FooterCardProps ={
    profile:ProfileInfo;
};

const ShowIcon = ({type})=>{
    if(type === 'wechat'){
        return <Img className='icon' src={WechatIcon}/>;
    } else if(type === 'alipay') {
     return <Img className='icon' src={AliylipayIcon}/>;
    }else if(type === 'paypal') {
        return <Img className='icon' src={PaypalIcon}/>;
    }else if(type === 'visa') {
        return <Img className='icon' src={VisaIcon}/>;
    } if(type === 'phone') {
        return <Img className='icon' src={PhoneIcon}/>;
    } else if(type === 'telegram'){
        return <Img className='icon' src={TgIcon}/>;
    }else if(type === 'whatsapp'){
        return <Img className='icon' src={WhatsappIcon}/>;
    }else if(type === 'line'){
        return <Img className='icon' src={LineIcon}/>;
    }else {
     return <Img className='icon' src={OtherIcon}/>;
    }  
}

const FooterCard:FC<FooterCardProps> = ({profile})=>{
    const {t}=useTranslation();
    const [telCopied,setTelCopied]=useState(false);
    const [wxCopied,setWxCopied]=useState(false);
    const [wxPayCopied,setWxPayCopied]=useState(false);
    const [paypalCopied,setPaypalCopied]=useState(false);

    return (
        <Container>
            <div className="itemBox">
                <div className="title">Contact Method</div>
                {profile.contacts.map(item=>{
              return  <div className="row">
                    <ShowIcon type={item.type}/>
                    <div className="desc">{item.address}</div>
                    <Tooltip
                        hideOnClick={false}
                        arrow={true}
                        placement="bottom"
                        content={
                            telCopied ? t('modals.wallet.copy-address.copied')
                                : t('modals.wallet.copy-address.copy-to-clipboard')
                        }
                    >
                        <CopyClipboardContainer>
                            <CopyToClipboard text={item.address} onCopy={() => setTelCopied(false)}>
                            <Svg src={CopyIcon} />
                            </CopyToClipboard>
                        </CopyClipboardContainer>
                    </Tooltip>
                </div>})}
            </div>

            <div className="itemBox">
            <div className="title">Payment Method</div>
            {profile.pays.map(item=>
                <div className="row">
                    <ShowIcon type={item.type}/>
                    <div className="desc">{item.address}</div>
                    <Tooltip
                        hideOnClick={false}
                        arrow={true}
                        placement="bottom"
                        content={
                            t('modals.wallet.copy-address.copy-to-clipboard')
                        }
                    >
                        <CopyClipboardContainer>
                            <CopyToClipboard text={item.address} onCopy={() => setWxPayCopied(false)}>
                                <Svg src={CopyIcon} />
                            </CopyToClipboard>
                        </CopyClipboardContainer>
                    </Tooltip>
                </div>)}
            </div>
        </Container>
    )
}

const Container=styled.div`

    width: 100%;
    //height: 210px;
    background: #203298;
    border-radius: 22px;
    display: flex;
    justify-content: space-between;
    padding: 2vw 15vw 2vw 15vw;
    margin-top: 27px;

    .itemBox{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-start;
        .title{
            //width: 124px;
            color:silver;
	        font-family: ${(props) => props.theme.fonts.condensedMedium};
            text-transform: capitalize ;
            text-align: center;
            font-size: 22px;
            font-weight: 400;
            //color: #FFFFFF;
            padding: 6px 14px;
            border-bottom: 2px solid #5473E8;
        }
        .row{
            margin-top: 20px;
            margin-left: -60px;
            display: flex;
            align-items: center;
            .icon{
                width: 28px;
                height: 28px;
            }
            .desc{
                margin-left: 30px;
                font-size: 22px;
                font-weight: bold;
                color: #FFFFFF;
            }  
        }
    
    }
`

const CopyClipboardContainer = styled(FlexDiv)`
	cursor: pointer;
	color: ${(props) => props.theme.colors.gray};
	margin-left: 10px;
	&:hover {
		svg {
			color: ${(props) => props.theme.colors.white};
		}
	}
`;

export default FooterCard;