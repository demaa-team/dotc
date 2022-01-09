import React,{useMemo} from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import castArray from 'lodash/castArray';
interface PropsType{
    icon:any,
    list:any
}

const ItemCard:React.FC<PropsType>=({icon,list})=>{

    return (
        <Container>
            <LeftBox style={{backgroundImage:`url(${icon.src})`}}></LeftBox>
            <RightBox>
                {
                    list.map((v:any)=>
                        <div className="item" key={v.label}>
                            <div className="title">{v.label}</div>
                            <div className="val">{v.val}</div>
                        </div>
                    )
                }
            </RightBox>
        </Container>
    )
}

const Container=styled.div`
    /* width: 908px; */
    height: 120px;
    background: #203298;
    border-radius: 22px;
    padding: 30px 72px;
    display: flex;
    align-items: center;
    margin-bottom: 50px;
    &:last-child{
        margin-bottom: 0px;
    }
`

const LeftBox=styled.div`
    width: 48px;
    height: 48px;
    background-size: 100%;
    background-repeat: no-repeat;
`
const RightBox=styled.div`
    display: flex;
    flex: 1;
    .item{
        flex: 1;
        border-right: 2px solid #6D83FF;
        &:last-child{
            border-right: none;
        }
        .title{
            text-align: center;
            font-size: 20px;
            font-weight: 400;
            color: #C4CCF8;
        }
        .val{
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #FFFFFF;
            margin-top: 4px;
        }
    }
`


export default ItemCard;