import React, { FC, useEffect, useMemo } from 'react';
import styled from 'styled-components';

const DetailCard:FC<{list:any,isLast:boolean,showHistory:any}> = ({list,isLast,showHistory}) => {

    const click=()=>{
        showHistory(true)
    }
    
    return (
        <Container>
            {
                list.map((v:any,index:number)=>
                    <ItemBoxWrap key={index}>
                        <LeftBox title={v.label}>{v.label}</LeftBox>
                        <RightBox title={v.val}>{v.val}</RightBox>
                    </ItemBoxWrap>
                )
            }
            {
                isLast && <LinkBox onClick={click}><span>查看仲裁辩护记录展示</span></LinkBox>
            }
        </Container>
    )
}

const Container=styled.div`
    padding: 45px 55px;
    min-height: 360px;
    background: #203298;
    border-radius: 13px;
    display: flex;
    align-content: center;
    flex-wrap: wrap;
`

const LinkBox=styled.div`
    width: 217%;
    text-align: right;
    span{
        cursor: pointer;
        text-decoration:underline;
    }
`

const ItemBoxWrap=styled.div`
    /* background: gray; */
    display: flex;
    border-radius: 8px;
    width: 49%;
`

const LeftBox=styled.div`
    line-height: 50px;
    background: #6D83FF;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: #FFFFFF;
    border-radius: 8px 0 0 8px;
`
const RightBox=styled.div`
    flex: 1;
    width: 300px;
    line-height: 50px;
    background: rgba(3, 11, 80,.23);
    text-align: center;
    font-size: 20px;
    font-weight: 400;
    color: #FFFFFF;
    border-radius: 0 8px 8px 0;
`

export default DetailCard;