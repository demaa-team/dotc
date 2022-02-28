// @ts-nocheck
import React,{useEffect, useMemo, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import castArray from 'lodash/castArray';
import { create } from 'lodash';
import {getAvatar} from "queries/otc/subgraph/utils";

import AdIcon from 'public/images/pending-order/ad.svg';
import RemainingIcon from 'public/images/pending-order/remaining.svg';
import AuthIcon from 'public/images/pending-order/auth.svg';
import TimeCostIcon from 'public/images/pending-order/time.svg';



const IconType =(props)=>{
    if(props.labelType === 'auth') {
        return  <img src={AuthIcon.src} ></img>
    } else if(props.labelType === 'remaining') {
        return  <img src={RemainingIcon.src} ></img>
    } else if(props.labelType === 'time') {
        return  <img src={TimeCostIcon.src} ></img>
    }
    else {
        return  <img src={AdIcon.src} ></img>
    }
}

const IconLabel =(props)=>{
    return <IconLabelWrap>
        <div className='label'>
            <div className='icon'>
                <IconType labelType='auth' {...props}/>
            </div>
            <div className='name'>{props.labelName}</div>
        </div>
        <div className='context'>{props.text}</div>
    </IconLabelWrap>
}

const IconLabelWrap = styled.div`
    height: 100%;
    margin-top: 20px;
   
    .label{
        display:flex;
        align-items: start;
        .icon{
            margin-right: 15px;;
        }
        .name{
            color: silver;
            font-size: 20px;
            text-transform: capitalize;
            text-decoration:underline;
        }
    }
    .context{
        font-size: 15px;
        margin-left: 47px;
    }
`

const Personal=(props)=>{
    let profile = props.profile;
    if(profile == null){
        return null;
    }

    const [mr,setMr] = useState('50px')
    const [fn,setFn] = useState('58px')
    const [fu,setFu] = useState('24px')
    function resizeFn(){
        const dom:any = document.querySelectorAll('#personal>.rightBox')
        const num:number = Number(dom[0].clientWidth)/396
        setMr(String(num*50)+'px')
        setFn(String(num*58)+'px')
        setFu(String(num*10)+'px')
    }
    /*
    if(!!window){
        window.onresize=resizeFn
    }
    */
    useEffect(()=>{
       resizeFn()
    })
    return (
        <Container>
            <div className='topBox' id='personal'>
                <div className="leftBox">
                    <div className='top'>
                        <div className="avatarWrap">
                            <img className='avatar' src={getAvatar(profile.avatar)} alt="" />
                        </div>
                        <div className="introBox">
                        <div className='icon'></div>
                        <div className="name">{profile.alias}</div>
                    </div>
                    </div>
                    <IconLabel labelType='auth'  labelName='Name' text={profile.auth}/>
                    <IconLabel labelType='remaining' labelName='Remainning'  text={profile?.order?.leftAmount??'0.00'}/>
                    <IconLabel labelType='time' labelName='time cost'  text='0 min'/>
                </div>
                <div className="rightBox">
                    <div className="rbContent">
                        <MoneyBox mr={mr}>
                            <Num fn={fn}>{profile?.order?.price??0}</Num>
                            <Unit fu={fu}>{profile?.order?.currencyCode??""}/{profile?.order?.coinCode??""}</Unit>
                        </MoneyBox>
                    </div>
                    <Adv>
                        <div className='icon'>
                            <img src={AdIcon.src}/>
                        </div>
                        <div className='ad'>{profile.ad} </div>
                        </Adv>
                </div>
            </div>
        </Container>
    )
}

const Adv = styled.div`
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-top:32px;
    .icon{
        margin-bottom: 32px;
    }
    .ad{
        text-align: center;
        font-size: 20px;
    }

`

const Container=styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 462px;
    background: #203298;
    border-radius: 22px;
    padding: 15px 26px 40px 40px;
    .topBox{
        display: flex;
        width: 100%;
    }
    .leftBox{
        display: flex;
        width: 40%;
        margin-right: 13%;
        flex-direction: column;
        //justify-content: center;
        .top{
            display: flex;
            flex-direction: column;
            //justify-content: center;
            align-items: center;
            .avatarWrap{
                width: 147px;
                height: 147px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px dotted #49C8BA;
                border-radius: 50%;
                .avatar{
                    width: 135px;
                    height: 135px;
                    border-radius: 50%;
                }
            }
            .introBox{
                margin-top: 10px;
                .name{
                    text-align: center;
                    color: #FFFFFF; 
                    font-size: 34px;
                    font-weight: bold;
                }
            }
        }
    }
    .rightBox{
        width:57%;
        height: 145px;
        padding-top: 0px;
        .rbContent{
            background-image: url('/images/market/bg.png');
            height: 145px;
            /* width: 394px; */
            /* margin-left: 130px; */
            background-size: 100% 100%;
            position: relative;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            &::before{
                content: '';
                position: absolute;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                width: 106px;
                height: 106px;
                background-image: url('/images/market/bg_in.png');
                background-size: cover;
            }
        }
        .desc{
            font-size: 20px;
            color: #D2D8F7;
            font-weight: 400;
            margin-top: 12px;
            text-align: center;
        }
    }
`

const Bottom = styled.div`
    
`

const MoneyBox=styled.div`
    margin-right:${(props) => props.mr};
    margin-top:0px;
    font-weight: bold;
    color: #FFFFFF;
`
const Num=styled.div`
    line-height: 1;
    font-size: ${(props) => props.fn};
`
const Unit=styled.div`
    font-size: ${(props) => props.fu};
    text-align: center;
`

export default Personal;