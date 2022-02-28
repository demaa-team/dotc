// @ts-nocheck
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
    isNumber:boolean;
    defaultValue?:string
    requirePromt?:boolean
}
const LabelInput: FC<PropsType> = ({
    label,
    val,
    name,
    onChange, 
    isNumber = false,
    defaultValue='',
    requirePromt=false}) => {
	const { t } = useTranslation();
    const handleInputChange=(e:any)=>{
        onChange(name,e.target.value);
    }
	return (
		<Wrapper>{requirePromt
            ?<span className="required">{label}</span>
           :<span className="normal">{label}</span>
            }
            
            <MyTextInput isNumber={isNumber} value={val} placeholder={defaultValue} onChange={handleInputChange} className='input'></MyTextInput>
        </Wrapper>
	);
};

const MyTextInput = styled(TextInput).attrs(props=>({
type:props.isNumber?'number':'text',
}))`
        height: 45px;
        border-bottom: 2px solid #2643E8;
        border-radius:0px;
        //border: 2px solid #2643E8;
        //opacity: 0.47;
        //border-radius: 11px;
        //padding: 0 15px;
        //font-weight: lighter;
        //font-size: 20px;

        &:focus{
            outline:none;
            /* border:#87C6F9 1px solid; */
            box-shadow: 0 0 8px rgba(103, 166, 217, 1);
        }
`

const Wrapper=styled.div`
    margin-bottom: 10px;
    &:first-child{
        margin-top: 0;
    }
 
    .required{
        display: inline-block;
        font-size: 18px;
        font-weight: 400;
        color: #DADDF7;
        margin-bottom: 10px;
        border-bottom: 1px solid rgba(103, 166, 217, 1);
        //margin-bottom: 16px;
        //margin-left: 15px;
        
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
    .normal{
        display: inline-block;
        font-size: 18px;
        font-weight: 400;
        color: #DADDF7;
        margin-bottom: 10px;
        border-bottom: 1px solid rgba(103, 166, 217, 1);
        text-transform: lowercase;
        //margin-left: 15px;
    }
 
`

export default LabelInput;
