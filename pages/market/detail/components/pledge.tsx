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
    const [maxNum,setMaxNum]=useState();
    const [requestData,setRequestData]=useState({tel:'',code:''});
    const [selectVal,setSelectVal]=useState('')
    const handleVerify=()=>{
        setShowModal(true);
    }
    const changeMaxNum=(e:any)=>{
        const t = e.target.value.replace(/[^\d]/g,'')
        setMaxNum(t)
    }

    const fixMaxNum=()=>{
        setMaxNum('1000')
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
            <div className="maxBox">
                <Input onChange={(e)=>changeMaxNum(e)} value={maxNum} placeholder='最小XXX'></Input>
                <div className="allowBtn" onClick={fixMaxNum}>最大值</div>
            </div>
            <div className="loan">
                <div className="help">
                    <Tooltip
                        arrow={true}
                        placement="bottom"
                        content={                            t('modals.wallet.copy-address.copy-to-clipboard')
                    }
                    >
                        <CopyClipboardContainer>
                        <Img className='questionIcon' src={HelpIcon}/>
                        </CopyClipboardContainer>
                    </Tooltip>
                    {/* <PledgeInfoTooltip
                        arrow={true}
                        content={
                            <Trans
                                i18nKey="debt.actions.hedge.info.tooltip"
                                components={[<Strong />]}
                            ></Trans>
                        }
                    >
                        <Img className='questionIcon' src={HelpIcon}/>
                    </PledgeInfoTooltip> */}
                    <div className="txt">抵押:</div>
                </div>
                <div className="selectBox">
                    <SelectComponent>
                        <Select variant="solid" value={selectVal} options={options} className='select' onChange={(e)=>selectChange(e)}></Select>
                        {/* <PriceCurrencySelect/> */}
                    </SelectComponent>
                    <div className="allowBtn">批准</div>
                </div>
            </div>
            <div className="tips" onClick={handleVerify}>
                没有抵押物？通过验证获取一次无抵押交易资格。
            </div>

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
    height: 50px;
    line-height: 50px;
    flex: none;
    background: #5473E8;
    font-size: 20px;
    text-align: center;
    /* padding: 0 10px; */
    border-radius: 0 10px 10px 0;
    cursor: ${(props)=>props.isForbid?'not-allowed':'pointer'};
    position: absolute;
    bottom: 9px;
    right: 9px;
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
    .maxBox{
        display: flex;
        height: 60px;
        
        .val{
            /* width: 437px; */
            flex: 1;
            height: 100%;
            line-height: 60px;
            padding: 0 40px;
            background: #1A2479;
            font-size: 20px;
            font-weight: 400;
            color: #FFFFFF;
        }

        .allowBtn{
            width: 22.5%;
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
            width:77.5%;
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
            .questionIcon{
                width: 28px;
                height: 28px;
                margin-right: 10px;
            }
            .txt{
                font-size: 20px;
                font-weight: 400;
                color: #FFFFFF;
            }
        }
        .selectBox{
            margin-left: 10px;
            flex: 1;
            border-radius: 10px;
            display: flex;
            .allowBtn{
                width: 32.5%;
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
        }
    }
    .tips{
        margin-top: 30px;
        text-align: center;
        font-size: 20px;
        font-weight: 400;
        text-decoration: underline;
        color: #F76A2D;
        cursor: pointer;
        &:hover{
            color: #5473E8;
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