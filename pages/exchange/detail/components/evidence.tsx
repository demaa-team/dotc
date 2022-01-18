import React,{useMemo, useState} from 'react';
import styled from 'styled-components';
import Img from 'react-optimized-image';

const Evidence=()=>{
    return (
        <Container>
            <ImgWrapper>
                <img className='img' src="http://m.imeitou.com/uploads/allimg/2016062920/ke4rrvvmx5g.jpg"/>
            </ImgWrapper>


            <SubmitBtn>
                提交证据
            </SubmitBtn>
        </Container>
    )
}
const Container=styled.div`

`
const ImgWrapper=styled.div`
    width: 180px;
    height: 120px;
    background: #6D83FF;
    display: flex;
    justify-content: center;
    align-items: center;
    .img{
        width: 66px;
        height: auto;
    }
`

const SubmitBtn=styled.div`
    margin-top: 13px;
    width: 180px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    background: #6D83FF;
    border-radius: 5px;
`

export default Evidence;
