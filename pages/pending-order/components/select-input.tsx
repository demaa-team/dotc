import React,{ FC, useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import NumericInput  from 'components/Input/NumericInput';
import Select from 'components/Select';
import Currency from 'components/Currency';

import UIContainer from 'containers/UI';
interface OPtionType {
    value: string,
    label: string,
}
interface PropsType {
    label: string,
    options: OPtionType[],
    onInputChange: (n: string, e: any) => void,
    inputVal: string,
    selectVal: any,
    onSelectChange: (n: string, e: any) => void,
    name: string
    isDisabled?: boolean;
}
const SelectInput: FC<PropsType> = ({ name, label, inputVal, selectVal, options, onInputChange, onSelectChange, isDisabled = false }) => {
    const { t } = useTranslation();
    return (
        <Wrapper>
            <div className="label">{label}</div>
            <RowWrap>
                <Select
                    variant="outline"
                    formatOptionLabel={(option) => (
                        <Currency.Name currencyKey={option.label} showIcon={true} />
                    )}
                    value={selectVal} 
                    options={options} 
                    className='select' 
                    onChange={(e) => onSelectChange(name, e)}
                    isDisabled
                ></Select>
                <NumericInput value={inputVal} placeholder='0.00' onChange={(e) => onInputChange(name, e.target.value)} className='input'></NumericInput>
            </RowWrap>


        </Wrapper>
    );
};

const Wrapper = styled.div`
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
        /*
        &::after{
            content: '';
            display: inline-block;
            width: 12px;
            height: 14px;
            margin-left: 6px;
            background: url('/images/pending-order/require-icon.png') no-repeat center;
            background-size: 100%;
        }*/
    }
    .select{
        min-width: 120px;
        flex: 1;
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

export default SelectInput;
