import React,{useEffect, useMemo, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import castArray from 'lodash/castArray';
import { create } from 'lodash';

const Personal=()=>{
    const [mr,setMr] = useState('50px')
    const [fn,setFn] = useState('58px')
    const [fu,setFu] = useState('24px')
    function resizeFn(){
        const dom:any = document.querySelectorAll('#personal>.rightBox')
        const num:number = Number(dom[0].clientWidth)/396
        setMr(String(num*50)+'px')
        setFn(String(num*58)+'px')
        setFu(String(num*24)+'px')
    }
    window.onresize=resizeFn
    useEffect(()=>{
       resizeFn()
    })
    return (
        <Container>
            <div className='topBox' id='personal'>
                <div className="leftBox">
                    <div className="avatarWrap">
                        <img className='avatar' src="https://pica.zhimg.com/80/v2-308d6eecb6bf60f53be0d6eeade0c734_720w.jpg?source=1940ef5c" alt="" />
                    </div>
                    <div className="introBox">
                        <div className="name">大掌柜</div>
                    </div>
                </div>
                <div className="rightBox">
                    <div className="rbContent">
                        <MoneyBox mr={mr}>
                            <Num fn={fn}>6.33</Num>
                            <Unit fu={fu}>元/USDT</Unit>
                        </MoneyBox>
                    </div>
                </div>
            </div>
            <div className="desc">安全、放贷速度快!安全、放款速度快！安全、放款速度快！安全、放款速度快！</div>
        </Container>
    )
}

const Container=styled.div`
    height: 306px;
    background: #203298;
    border-radius: 22px;
    padding: 15px 26px 40px 40px;
    .topBox{
        display: flex;
        width: 100%;
    }
    .leftBox{
        display: flex;
        flex-direction: column;
        width: 30%;
        margin-right: 13%;
        justify-content: center;
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
    .rightBox{
        width:57%;
        height: 145px;
        padding-top: 27px;
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
    }
    .desc{
        font-size: 20px;
        color: #D2D8F7;
        font-weight: 400;
        margin-top: 12px;
    }
`

const MoneyBox=styled.div`
    margin-right:${(props) => props.mr};
    margin-top:-46px;
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