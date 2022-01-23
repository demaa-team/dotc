import React,{useEffect, useMemo,useRef, useState} from 'react';
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

import WeiXinIcon from 'public/images/market/weixin-icon.png';
import PaypalIcon from 'public/images/market/paypal-icon.png';
import PhoneIcon from 'public/images/market/phone-icon.png';

import CopyIcon from 'assets/svg/app/copy.svg';
import CheckIcon from 'assets/svg/app/check.svg';


const FooterCard=()=>{
    const {t}=useTranslation();
    const [telCopied,setTelCopied]=useState(false);
    const [wxCopied,setWxCopied]=useState(false);
    const [wxPayCopied,setWxPayCopied]=useState(false);
    const [paypalCopied,setPaypalCopied]=useState(false);


    return (
        <Container>
            <div className="itemBox">
                <div className="title">联系方式</div>
                <div className="row">
                    <Img className='icon' src={PhoneIcon} />
                    <div className="desc">+8612345678</div>
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
                            <CopyToClipboard text={'+8612345678'} onCopy={() => setTelCopied(false)}>
                            <Svg src={CopyIcon} />
                                {/* {telCopied ? (
                                    <Svg
                                        src={CheckIcon}
                                        width="16"
                                        height="16"
                                        viewBox={`0 0 ${CheckIcon.width} ${CheckIcon.height}`}
                                    />
                                ) : (
                                    <Svg src={CopyIcon} />
                                )} */}
                            </CopyToClipboard>
                        </CopyClipboardContainer>
                    </Tooltip>
                </div>
                <div className="row">
                    <Img className='icon wx' src={WeiXinIcon}/>
                    <div className="desc">+8612345678</div>

                    <Tooltip
                        hideOnClick={false}
                        arrow={true}
                        placement="bottom"
                        content={t('modals.wallet.copy-address.copy-to-clipboard')}
                        // content={
                        //     wxCopied ? t('modals.wallet.copy-address.copied')
                        //         : t('modals.wallet.copy-address.copy-to-clipboard')
                        // }
                    >
                        <CopyClipboardContainer>
                            <CopyToClipboard text={'+8612345678'} onCopy={() => setWxCopied(false)}>
                            <Svg src={CopyIcon} />
                                {/* {wxCopied ? (
                                    <Svg
                                        src={CheckIcon}
                                        width="16"
                                        height="16"
                                        viewBox={`0 0 ${CheckIcon.width} ${CheckIcon.height}`}
                                    />
                                ) : (
                                    <Svg src={CopyIcon} />
                                )} */}
                            </CopyToClipboard>
                        </CopyClipboardContainer>
                    </Tooltip>
                </div>
            </div>
            <div className="itemBox">
            <div className="title">支付方式</div>
                <div className="row">
                    <Img className='icon wx' src={WeiXinIcon} />
                    <div className="desc">+86123456781</div>
                    <Tooltip
                        hideOnClick={false}
                        arrow={true}
                        placement="bottom"
                        content={
                            // wxPayCopied ? t('modals.wallet.copy-address.copied')
                            //     : t('modals.wallet.copy-address.copy-to-clipboard')
                            t('modals.wallet.copy-address.copy-to-clipboard')
                        }
                    >
                        <CopyClipboardContainer>
                            <CopyToClipboard text={'+86123456781'} onCopy={() => setWxPayCopied(false)}>
                                {/* {wxPayCopied ? (
                                    <Svg
                                        src={CheckIcon}
                                        width="16"
                                        height="16"
                                        viewBox={`0 0 ${CheckIcon.width} ${CheckIcon.height}`}
                                    />
                                ) : (
                                    <Svg src={CopyIcon} />
                                )} */}
                                <Svg src={CopyIcon} />
                            </CopyToClipboard>
                        </CopyClipboardContainer>
                    </Tooltip>
                </div>
                <div className="row">
                    <Img className='icon paypal' src={PaypalIcon}/>
                    <div className="desc">+86123456781</div>
                    <Tooltip
                        hideOnClick={false}
                        arrow={true}
                        placement="bottom"
                        content={
                            paypalCopied ? t('modals.wallet.copy-address.copied')
                                : t('modals.wallet.copy-address.copy-to-clipboard')
                        }
                    >
                        <CopyClipboardContainer>
                            <CopyToClipboard text={'+86123456781'} onCopy={() => setPaypalCopied(false)}>
                            <Svg src={CopyIcon} />
                                {/* {paypalCopied ? (
                                    <Svg
                                        src={CheckIcon}
                                        width="16"
                                        height="16"
                                        viewBox={`0 0 ${CheckIcon.width} ${CheckIcon.height}`}
                                    />
                                ) : (
                                    <Svg src={CopyIcon} />
                                )} */}
                            </CopyToClipboard>
                        </CopyClipboardContainer>
                    </Tooltip>
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
    padding: 0 15vw;
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
            &.wx{
                width: 23px;
            }
            &.paypal{
                width: 23px;
                height: auto;
            }
        }
        .desc{
            margin-left: 30px;
            font-size: 22px;
            font-weight: bold;
            color: #FFFFFF;
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