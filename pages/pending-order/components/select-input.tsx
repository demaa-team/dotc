import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import TextInput from 'components/Input/TextInput';
import Select from 'components/Select';

import UIContainer from 'containers/UI';
interface OPtionType{
    value:string,
    label:string,
}
interface PropsType{
    label:string,
    options:OPtionType[],
    onInputChange:(n:string,e:any)=>void,
    inputVal:string,
    selectVal:any,
    onSelectChange:(n:string,e:any)=>void,
    name:string
}
const SelectInput: FC<PropsType> = ({name,label,inputVal,selectVal,options,onInputChange,onSelectChange}) => {
	const { t } = useTranslation();
	return (
		<Wrapper>
            <div className="label">{label}</div>
            <RowWrap>
                <Select variant="outline" value={selectVal} options={options} className='select' onChange={(e)=>onSelectChange(name,e)}></Select>
                <TextInput value={inputVal} placeholder='请输入' onChange={(e)=>onInputChange(name,e.target.value)} className='input'></TextInput>
            </RowWrap>
            
            
        </Wrapper>
	);
};

const Wrapper=styled.div`
    margin-top: 20px;
    &:first-child{
        margin-top: 0;
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
        min-width: 120px;
        flex: 1;
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

export default SelectInput;
