import React,{useMemo} from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import castArray from 'lodash/castArray';

const Personal=()=>{
    return (
        <Container>
            <div className='topBox'>
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
                        <div className="moneyBox">
                            <div className="num">6.33</div>
                            <div className="unit">元/USDT</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="desc">安全、放贷速度快!安全、放款速度快！安全、放款速度快！安全、放款速度快！安全、放款速度快！安全、放款速度快！</div>
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
    }
    .leftBox{
        display: flex;
        flex-direction: column;
        width: 31.6%;
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
        width:594px;
        height: 145px;
        padding-top: 27px;
        .rbContent{
            background-image: url('/images/market/bg.png');
            height: 145px;
            width: 394px;
            margin-left: 130px;
            background-size: cover;
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
            .moneyBox{
                margin-right: 50px;
                margin-top: -46px;
                font-weight: bold;
                color: #FFFFFF;
                .num{
                    line-height: 1;
                    font-size: 58px;
                }
                .unit{
                    font-size: 24px;
                    text-align: center;
                }
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


export default Personal;