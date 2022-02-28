import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import TextInput from 'components/Input/TextInput';
import Select from 'components/Select';
import Button from 'components/Button';
import Img, { Svg } from 'react-optimized-image';

import UIContainer from 'containers/UI';

import WhatsappIcon from 'assets/order/whatsapp.svg';
import LineIcon from 'assets/order/line.svg';
import PhoneIcon from 'assets/order/phone.svg';
import TgIcon from 'assets/order/telegram.svg';
import OtherIcon from 'assets/order/other.svg';
import { setSeconds } from 'date-fns';
import {ContactIno} from 'queries/otc/subgraph/types';

interface PropsType {
    label: string,
    onInputChange: (v: string, i: number) => void,
    onSelectChange: (v: any, i: number) => void,
    list: ContactIno[],
    onAdd: () => void,
    onRemove: (i: number) => void,
}
const LABEL_ICON_MAP={
    'whatsapp':WhatsappIcon,
    'line':LineIcon,
    'phone':PhoneIcon,
    'telegram':TgIcon,
    'other':OtherIcon
}

const OptionLabel=(props:any)=>{
    return <OptionLabelWrap>
        {/* @ts-ignore */}
        <img className='icon' src={LABEL_ICON_MAP[props.value]} />
        <div className="name">{props.label}</div>
    </OptionLabelWrap>
}

const ContactType: FC<PropsType> = ({ list, label, onInputChange, onSelectChange, onAdd, onRemove }) => {
    const { t } = useTranslation();
    const options = [
        { 
            value: 'whatsapp', label: 'Whatsapp'
        },{
            value: 'phone', label: 'Phone'
        },{
            value: 'line', label: 'Line'
        },{
            value: 'telegram', label: 'Telegram'
        },{
            value: 'other', label: 'Other'
        }
    ]
    const ids = {
        "whatsapp":{ 
            value: 'whatsapp', label: 'Whatsapp'
        },
        "phone":{
            value: 'phone', label: 'Phone'
        },
        "line":{
            value: 'line', label: 'Line'
        },
        "telegram":{
            value: 'telegram', label: 'Telegram'
        },
        "other":{
            value: 'other', label: 'Other'
        }
    };
    const set = new Set();
    list.forEach(e=>{
        if(e.type !== ""){
         set.add(e.type)
         }
    });
    const optionList = [];
    list.forEach((e,i) => {
        optionList[i] = options.filter(o=>  (o.value === e.type || !set.has(o.value)));
    });
    return (
        <Wrapper>
            <div className="label">{label}</div>
            {
                list.map((v: any, index: number) =>
                    <RowWrap key={index}>
                        <Select
                            variant="outline"
                            value={ids[v.type]}
                            formatOptionLabel={(option) => (
                                <OptionLabel {...option}/>
                            )}
                            options={optionList[index]}
                            className='select'
                            onChange={(e) => onSelectChange(e, index)}
                        ></Select>
                        <TextInput value={v.address} placeholder='' onChange={(e) => onInputChange(e.target.value, index)} className='input'></TextInput>
                        <RemoveBtn onClick={() => onRemove(index)} isForbid={list.length === 1}></RemoveBtn>
                    </RowWrap>
                )
            }
            <Button variant="text" size='xl'  isHidden={list.length >= 5} onClick={onAdd}>
                <SubmitTxt>More...</SubmitTxt>
            </Button>
        </Wrapper>
    );
};
const btnCss = css`
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
const Wrapper = styled.div`
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
        /*&::after{
            content: '';
            display: inline-block;
            width: 12px;
            height: 14px;
            margin-left: 6px;
            background: url('/images/pending-order/require-icon.png') no-repeat center;
            background-size: 100%;
        }
        */
    }
    .select{
        flex: 1;
        min-width: 120px;
        height: 50px;
        border: 2px solid #2643E8;
        /* opacity: 0.47; */
        border-radius: 11px;
        .react-select__control{
            border: none;
            height: 44px;
            border-radius: 11px;
        }
    }
`

const RowWrap = styled.div`
	display: flex;
    margin-bottom: 10px;
    &:last-child{
        margin-bottom: 0px;
    }
    .input{
        flex: 3;
        margin-left: 14px;
        height: 50px;
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
const RemoveBtn = styled.div<{ isForbid?: boolean }>`
    cursor: ${(props) => props.isForbid ? 'not-allowed' : 'pointer'};
    flex: none;
    width: 46px;
    height: 50px;
    background: url('/images/pending-order/reduce-icon.png') no-repeat center;
    background-size: 30px 30px;

`

const SubmitTxt = styled.span`
    display: inline-block;
    width: 100%;
    font-size: 15px;
`

const IncreaseBtn = styled.div`
    ${btnCss}
    font-size: 32px;
    font-weight: bold;
    user-select: none;
`

const OptionLabelWrap=styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    .name{
        color: ${(props) => props.theme.colors.white};
	    font-family: ${(props) => props.theme.fonts.condensedBold};
    }
    .icon{
        width: 24px;
        height: 24px;
        margin-right: 8px;
    }
`

export default ContactType;
