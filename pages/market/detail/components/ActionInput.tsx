// @ts-nocheck
import React, {FC}from 'react';
import styled,{css} from 'styled-components';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import LabelInput from '../../../pending-order/components/label-input';
import { _nameprepTableB2 } from 'ethers/node_modules/@ethersproject/strings/lib/idna';

type ActionButtonProps = {
    name:string;
    isNumber:boolean;
    label:string;
    value:string;
    isBtnDisable:boolean;
    btnText:string;
    defaultValue:string;
    onValueChange?:(k:string,e:any)=>void;
    onBtnClick?:()=>void;
};

const ActionInput: FC<ActionButtonProps> =({
    name,
    label, 
    value, 
    onValueChange, 
    defaultValue,
    onBtnClick, 
    isNumber = false, 
    btnText = 'Sumbit', 
    isBtnDisable= false})=>{

    return <Container>
            <InputPart>
                <LabelInput label={label} name={name} defaultValue={defaultValue} type={isNumber?'number':'text'} isNumber={isNumber} requirePromt={false} val={value} onChange={onValueChange}></LabelInput>
            </InputPart>
            <ActionBtn  isBtnDisable={isBtnDisable}>
                <span onClick={onBtnClick}>{btnText}</span>
            </ActionBtn>
    </Container>;
};

const Container = styled.div`
    display:flex;
    justify-content: flex-start;
    align-items: flex-end;

`

const InputPart = styled.div`

`
const Hover = css`
 &:hover{
            color: lightgoldenrodyellow;
        }
`
const ActionBtn=styled.div.attrs(props=> ({
    onClick: props.isBtnDisable?null:props.onBtnClick,
}))`
    min-width:80px;

	font-family: ${(props) => props.theme.fonts.condensedMedium};
    margin-left: 10px;
    span{
       // width: 120px;
       // height: 48px;
        line-height: 50px;
        color: ${(props=>props.isBtnDisable?'gray':'yellow')};
        text-transform: capitalize;
        font-weight: bolder ;
        text-decoration: underline;
        //flex: none;
        //background: #5473E8;
        font-size: 18px;
       // text-align: base;
        /* padding: 0 10px; */
        //border-radius: 0 10px 10px 0;
        cursor: ${(props)=>props.isBtnDisable?'not-allowed':'pointer'};
        //position: absolute;
        //bottom: 1px;
        //right: 2px;
        ${(props)=>props.isBtnDisable?null:Hover}
    }
`

const VerifyCodeBtn = styled(Button)`
	width:100%;
`

export default ActionInput;