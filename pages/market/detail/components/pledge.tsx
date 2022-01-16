import React,{useEffect, useMemo,useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import castArray from 'lodash/castArray';
import HelpIcon from 'public/images/market/help-icon.png';
import PriceCurrencySelect from 'sections/shared/modals/SettingsModal/PriceCurrencySelect';
import BaseModal from 'components/BaseModal';
import Input from 'components/Input/Input';

let timer: number | null=null;
const TIME=6;
let time=6;
const Pledge=()=>{
    const [showModal,setShowModal]=useState(false);
    const [countDown,setCountDown]=useState(TIME);
    const [isCounting,setIsCounting]=useState(false);
    const handleVerify=()=>{
        setShowModal(true);
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
                <div className="val">1000</div>
                <div className="maxBtn">最大</div>
            </div>
            <div className="loan">
                <div className="help">
                    <img className='questionIcon' src={HelpIcon} alt="" />
                    <div className="txt">抵押:</div>
                </div>
                <div className="selectBox">
                    <SelectComponent>
                        <PriceCurrencySelect/>
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
                    <Input></Input>
                    <GetVerifyCodeBtn onClick={handleGetVerifyCode} isForbid={isCounting}>{isCounting?countDown+'s':'获取验证码'}</GetVerifyCodeBtn>
                </ModalContent>

                <ModalFooter>
                    <div className="btn" onClick={()=>setShowModal(false)}>确定</div>    
                    <div className="btn" onClick={()=>setShowModal(false)}>取消</div>   
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
    display: flex;
`
const ModalFooter=styled.div`
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    padding: 0 5vw;
    .btn{
        width: 40%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        border-radius: 10px;
        background: #5473E8;
        cursor: pointer;
    }
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
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
        }
        .maxBtn{
            /* flex: 1; */
            width: 150px;
            height: 100%;
            line-height: 60px;
            text-align: center;
            background: #5473E8;
            border-radius: 0px 10px 10px 0px;
            font-size: 24px;
            font-weight: bold;
            color: #FFFFFF;
        }
    }
    .loan{
        display: flex;
        height: 60px;
        margin-top: 34px;
        .help{
            width: 186px;
            height: 100%;
            display: flex;
            align-items: center;
            background: #1A2479;
            border-radius: 10px;
            padding: 0 16px;
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
                width: 150px;
                height: 100%;
                line-height: 60px;
                text-align: center;
                background: #5473E8;
                border-radius: 0px 10px 10px 0px;
                font-size: 24px;
                font-weight: bold;
                color: #FFFFFF;
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
    /* width: 240px; */
    flex: 1;
    .react-select__control{
        height: 60px;
    }
`




export default Pledge;