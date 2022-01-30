import { FC, useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import TextInput from 'components/Input/TextInput';

import UIContainer from 'containers/UI';
interface PropsType{
    label:string,
    val:string,
    onChange:(k:string,e:any)=>void,
    name:string
}
const LabelInput: FC<PropsType> = ({label,val,name,onChange}) => {
	const { t } = useTranslation();
    const handleInputChange=(e:any)=>{
        onChange(name,e.target.value);
    }
	return (
		<Wrapper>
            <div className="label">{label}</div>
            <TextInput value={val} placeholder='请输入' onChange={handleInputChange} className='input'></TextInput>
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
    .input{
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

export default LabelInput;
