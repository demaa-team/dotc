import React,{useMemo} from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import castArray from 'lodash/castArray';

const Personal=()=>{
    return (
        <Container>
            <div className="leftBox">
                <div className="avatarWrap">
                    <img className='avatar' src="https://pica.zhimg.com/80/v2-308d6eecb6bf60f53be0d6eeade0c734_720w.jpg?source=1940ef5c" alt="" />
                </div>
                <div className="introBox">
                    <div className="name">大掌柜</div>
                    <div className="desc">安全、放贷速度快</div>
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
        </Container>
    )
}

const Container=styled.div`
    /* width: 664px; */
    height: 306px;
    background: #203298;
    border-radius: 22px;
    padding: 15px 26px 40px 40px;
    display: flex;
    justify-content: space-between;
    .leftBox{
        /* display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center; */
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
            .desc{
                /* margin-top: 14px; */
                text-align: center;
                font-size: 20px;
                color: #D2D8F7;
                font-weight: 400;
            }
        }
    }
    .rightBox{
        display: flex;
        /* flex-direction: column-reverse; */
        /* align-items: center; */
        .rbContent{
            width: 394px;
            height: 124px;
            background-image: url('/images/market/money-bg.png');
            background-size: cover;
            position: relative;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            &::before{
                content: '';
                position: absolute;
                left: 57px;
                top: 50%;
                transform: translateY(-50%);
                width: 75px;
                height: 75px;
                background-image: url('/images/market/arrow-dress.png');
                background-size: cover;
            }
            .moneyBox{
                margin-right: 70px;
                .num{
                    line-height: 1;
                    font-size: 58px;
                    font-weight: bold;
                    color: #FFFFFF;
                }
                .unit{
                    font-size: 24px;
                    font-weight: bold;
                    color: #F86C29;
                }
            }
        }
    }
`


export default Personal;