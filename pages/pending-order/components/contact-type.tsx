import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import TextInput from 'components/Input/TextInput';
import Select from 'components/Select';
import Button from 'components/Button';

import UIContainer from 'containers/UI';
interface PropsType{
    label:string,
    onInputChange:(v:string,i:number)=>void,
    onSelectChange:(v:any,i:number)=>void,
    list:any,
    onAdd:()=>void,
    onRemove:(i:number)=>void,
}
const ContactType: FC<PropsType> = ({list,label,onInputChange,onSelectChange,onAdd,onRemove}) => {
	const { t } = useTranslation();
    const options=[
		{
			value: 'phone', label: '电话'
		},
		{
			value: 'wechat', label: '微信'
		},
	]
	return (
		<Wrapper>
            <div className="label">{label}</div>
            {
                list.map((v:any,index:number)=>
                    <RowWrap key={index}>
                        <Select variant="outline" value={v.select} options={options} className='select' onChange={(e)=>onSelectChange(e,index)}></Select>
                        <TextInput value={v.input} placeholder='请输入' onChange={(e)=>onInputChange(e.target.value,index)} className='input'></TextInput>
                        <RemoveBtn onClick={()=>onRemove(index)} isForbid={list.length===1}></RemoveBtn>
                    </RowWrap>
                )
            }
            <Button variant="primary" size='xl'  onClick={onAdd}>
                <SubmitTxt width='38.9vw'>+</SubmitTxt>
            </Button>
        </Wrapper>
	);
};
const btnCss=css`
    height: 54px;
	line-height: 54px;
	text-align: center;
	background: #6D83FF;
	border-radius: 14px;
	cursor: pointer;
	:hover{
		background: #F86C29;
	}
`

const SubmitTxt = styled.span`
    display: inline-block;
    width:${(props) => props.width};;
`

const Wrapper=styled.div`
    margin-right: 60px;
    flex: 1;
    &:last-child{
        margin-right: 0px;
    }
    .label{
        font-size: 18px;
        font-weight: 400;
        color: #DADDF7;
        margin-bottom: 8px;
        margin-left: 15px;
        &::after{
            content: '';
            display: inline-block;
            width: 12px;
            height: 14px;
            margin-left: 6px;
            background: url('/images/pending-order/require-icon.png') no-repeat center;
            background-size: 100%;
        }
    }
    .select{
        flex: 1;
        min-width: 120px;
        height: 66px;
        border: 2px solid #2643E8;
        /* opacity: 0.47; */
        border-radius: 11px;
        .react-select__control{
            border: none;
            height: 60px;
            border-radius: 11px;
        }
    }
`

const RowWrap=styled.div`
	display: flex;
    margin-bottom: 10px;
    &:last-child{
        margin-bottom: 0px;
    }
    .input{
        flex: 3;
        margin-left: 14px;
        height: 66px;
        border: 2px solid #2643E8;
        opacity: 0.47;
        border-radius: 11px;
        padding: 0 15px;
        font-size: 20px;
        &:focus{
            outline:none;
            /* border:#87C6F9 1px solid; */
            box-shadow: 0 0 8px rgba(103, 166, 217, 1);
        }
    }
`
const RemoveBtn=styled.div<{isForbid?:boolean}>`
    cursor: ${(props)=>props.isForbid?'not-allowed':'pointer'};
    flex: none;
    width: 46px;
    height: 66px;
    background: url('/images/pending-order/reduce-icon.png') no-repeat center;
    background-size: 30px 30px;

`

const IncreaseBtn=styled.div`
    ${btnCss}
    font-size: 32px;
    font-weight: bold;
    user-select: none;
`
export default ContactType;
