// @ts-nocheck
import React,{useEffect, useMemo,useState,FC} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import styled,{css} from 'styled-components';
import castArray from 'lodash/castArray';
import HelpIcon from 'public/images/market/help-icon.png';
import PriceCurrencySelect from 'sections/shared/modals/SettingsModal/PriceCurrencySelect';
import Select from 'components/Select';
import BaseModal from 'components/BaseModal';
import Input from 'components/Input/Input';
import Button from 'components/Button';
import LabelInput from '../../../pending-order/components/label-input';

import Img, { Svg } from 'react-optimized-image';
import { Tooltip,FlexDiv } from 'styles/common';

let timer: number | null=null;
const TIME=60;
let time=60;
interface PropsType{
    onSelectChange:(v:string)=>void,
}
const Pledge:FC<PropsType>=({onSelectChange})=>{
    const {t}=useTranslation();
    const [showModal,setShowModal]=useState(false);
    const [countDown,setCountDown]=useState(TIME);
    const [isCounting,setIsCounting]=useState(false);
    const [maxNum,setMaxNum]=useState<number>();
    const [requestData,setRequestData]=useState({tel:'',code:''});
    const [selectVal,setSelectVal]=useState({label:'', value:''})
    const handleVerify=()=>{
        setShowModal(true);
    }
    const changeMaxNum=(e:any)=>{
        const t = e.target.value.replace(/[^\d]/g,'')
        setMaxNum(t)
    }

    const fixMaxNum=()=>{
        setMaxNum(1000)
    }

    const handleChange=(key:string,val:any)=>{
        setRequestData({...requestData,[key]:val})
    }

    const options=[
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]

    const selectChange=(e:any)=>{
        onSelectChange(e.value)
    }

    const handleGetVerifyCode=()=>{
        if(isCounting)return;
        setIsCounting(true);
        timer=setInterval(()=>{
            if(time-1===0){
                setIsCounting(false);
                clearInterval(timer as any);
            }
            time=time-1;
            setCountDown(time);
            if(time===0){
                time=TIME;
            }
        },1000)
    }
    useEffect(()=>{
        return ()=>{
            clearInterval(timer as any);
        }
    },[])
    return (
        <Container>
            <div>
                <div className="info">
                <Tooltip
                        arrow={true}
                        placement="top"
                        content={ t('modals.market.pledge-tool-tip')}
                    >
                        <CopyClipboardContainer>
                        <Img className='questionIcon' src={HelpIcon}/>
                        </CopyClipboardContainer>
                    </Tooltip>
                <div className="des">
                    You should provide collateral for the transaction
                </div>
                </div>
                <div className="tips" onClick={handleVerify}>
                    没有抵押物？通过验证获取一次无抵押交易资格。
                </div>
            </div>
            <div className="maxBox">
                <div className="selectBox">
                    <SelectComponent>
                        <Select variant="solid" value={selectVal} options={options} className='select' onChange={(e)=>selectChange(e)}></Select>
                        {/* <PriceCurrencySelect/> */}
                    </SelectComponent>
                </div>
                <Input onChange={(e)=>changeMaxNum(e)} value={maxNum} placeholder='最小50'></Input>
                <div className="allowBtn" onClick={fixMaxNum}>Max</div>
            </div>
            <BtnBox>
				<Button variant="primary" size='xl'>
					<SubmitTxt>Approve transfer collateral</SubmitTxt>
				</Button>
			</BtnBox>
        

            {/* <BaseModal title="测试" onDismiss={()=>setShowModal(false)} isOpen={showModal}>

            </BaseModal> */}
            <StyledBaseModal title="测试" onDismiss={()=>setShowModal(false)} isOpen={showModal}>
                <ModalContent>
                    <LabelInput label='联系方式' name='tel' val={requestData.tel} onChange={handleChange}></LabelInput>
                    <LabelInput label='验证码' name='code' val={requestData.code} onChange={handleChange}></LabelInput>
                    <GetVerifyCodeBtn onClick={handleGetVerifyCode} isForbid={isCounting}>{isCounting?countDown+'s':'获取验证码'}</GetVerifyCodeBtn>
                </ModalContent>

                <ModalFooter>
                    <Button variant="primary" size='xl' onClick={()=>setShowModal(false)}>
                        <SubmitTxt>提交</SubmitTxt>
                    </Button>
                </ModalFooter>  

            </StyledBaseModal>
        </Container>
    )
}
const StyledBaseModal = styled(BaseModal)`
	[data-reach-dialog-content] {
		width: 30vw;
	}
	/* .card-header {
		font-size: 12px;
		font-family: ${(props) => props.theme.fonts.interBold};
		// background-color: ${(props) => props.theme.colors.navy};
		// border-bottom: 1px solid ${(props) => props.theme.colors.grayBlue};
	}
	.card-body {
		padding: 24px;
		background-color: ${(props) => props.theme.colors.navy};
	} */
`;

const BtnBox=styled.div`
    margin-top: 30px;    
	width: 100%;
	text-align: center;
`

const ModalContent=styled.div`
    position: relative;
`
const ModalFooter=styled.div`
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    padding: 0 5vw;
`

const GetVerifyCodeBtn=styled.div<{isForbid:boolean}>`
    width: 120px;
    height: 48px;
    line-height: 50px;
    flex: none;
    background: #5473E8;
    font-size: 20px;
    text-align: center;
    /* padding: 0 10px; */
    border-radius: 0 10px 10px 0;
    cursor: ${(props)=>props.isForbid?'not-allowed':'pointer'};
    position: absolute;
    bottom: 1px;
    right: 2px;
`

// 最大和最小公共样式
const maxAndMinCommon=css`
    width: 150px;
    height: 100%;
    line-height: 60px;
    text-align: center;
    background: #5473E8;
    font-size: 24px;
    font-weight: bold;
    color: #FFFFFF;
    cursor: pointer;
`
const Container=styled.div`
    height: 306px;
    background: #203298;
    border-radius: 22px;
    padding: 44px 38px 50px 38px;
    .info{
        display: flex;
        .questionIcon{
            width: 20px;
            height: 20px;
            margin-right: 10px;
        }
    }
    .des{
        margin-bottom: 10px;
        text-align: center;
        font-size: 20px;
    }
    .tips{
        margin-bottom: 30px;
        text-align: center;
        font-size: 15px;
        font-weight: 400;
        text-decoration: underline;
        color: #F76A2D;
        cursor: pointer;
        &:hover{
            color: #5473E8;
        }
    }
    .maxBox{
        display: flex;
        height: 60px;
        .selectBox{
            height:60px;
            line-height: 60px;
            pad-left:10px;
            flex: 1;
            border-radius: 10px;
            display: flex;
        }

        .allowBtn{
            width: 20%;
            height: 100%;
            line-height: 60px;
            text-align: center;
            background: #5473E8;
            border-radius: 0px 10px 10px 0px;
            font-size: 24px;
            font-weight: bold;
            color: #FFFFFF;
            cursor: pointer;
        }
        input{
            width 50%;
            height:60px;
            background-color: #1A2479;
        }
    }
    .loan{
        display: flex;
        height: 60px;
        margin-top: 34px;
        .help{
            width: 28%;
            height: 100%;
            display: flex;
            align-items: center;
            background: #1A2479;
            border-radius: 10px;
            padding: 0 16px;
            margin-right: 1.3%;
     
            .txt{
                font-size: 20px;
                font-weight: 400;
                color: #FFFFFF;
            }
        }
    
    }
`

const SelectComponent=styled.div`
    flex: 1;
    .react-select__control{
        height: 60px;
        /* width: 36.4%; */
    }
    .select{
        border-radius: 10px 0px 0px 10px;
        background: unset;
    }
`

const PledgeInfoTooltip = styled(Tooltip)`
	background: ${(props) => props.theme.colors.navy};
	.tippy-arrow {
		color: ${(props) => props.theme.colors.navy};
	}
	.tippy-content {
		font-size: 14px;
	}
`;

const Strong = styled.strong`
	font-family: ${(props) => props.theme.fonts.interBold};
`;

const SubmitTxt = styled.span`
    display: inline-block;
    width:16vw;
`
const CopyClipboardContainer = styled(FlexDiv)`
	cursor: pointer;
	color: ${(props) => props.theme.colors.gray};
	margin-left: 10px;
	&:hover {
		svg {
			color: ${(props) => props.theme.colors.white};
		}
	}
`;

export default Pledge;