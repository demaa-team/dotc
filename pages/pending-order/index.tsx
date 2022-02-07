import { FC, useEffect,useState,useMemo } from 'react';
import Head from 'next/head';
import styled,{css} from 'styled-components';
import { useTranslation } from 'react-i18next';
import {ContactSelectOptions,PaySelectOptions} from './assets/config'
import Deal from './components/deal';
import LabelInput from './components/label-input';
import SelectInput from './components/select-input';
import ContactType from './components/contact-type';
import Button from 'components/Button';
import Upload from 'rc-upload';
import {
	CURRENCY,
} from 'constants/order';

const Delete =require('./images/delete.png');
const Edit=require('./images/edit.png')

import UIContainer from 'containers/UI';

const PendingOrder: FC = () => {
	const { t } = useTranslation();
	const { setTitle } = UIContainer.useContainer();
	const [requestData,setRequestData]=useState({alias:'',ad:'',auth:'',price:{select:null,input:''},goods:{select:null,input:''}});
	const [contactList,setContactList]=useState([{method:'',address:''}]);
	const [payList,setPayList]=useState([{method:'',address:''}]);
	// header title
	// useEffect(() => {
	// 	setTitle('wallet', 'escrow');
	// }, [setTitle]);

	const handleNameChange=(key:string,val:any)=>{
		setRequestData({...requestData,[key]:val})
	}
	const handleSelectInputChange=(key:string,v:any)=>{
		// @ts-ignore
		setRequestData({...requestData,[key]:{select:requestData[key]?.select,input:v}})
	}

	const handleSelectChange=(key:string,v:any)=>{
		setRequestData({...requestData,[key]:{select:v,input:''}})
	}

	const priceOptions=[
		{value:'1',label:'价格1'},
		{value:'12',label:'价格12'},
		{value:'13',label:'价格13'}
	]

	const goodsOptions = [
		{value:'1',label:'商品1'},
		{value:'12',label:'商品12'},
		{value:'13',label:'商品13'}
	]
	// const options=[
	// 	{ value: 'chocolate', label: 'Chocolate' },
	// 	{ value: 'strawberry', label: 'Strawberry' },
	// 	{ value: 'vanilla', label: 'Vanilla' },
	// ]
	const options=useMemo(() => CURRENCY.map((value) => ({ label: value, value })), []);

	const handleAdd=(type:string)=>{
		if(type==='contact'){
			contactList.push({
				method:'',
				address:''
			})
			setContactList([...contactList]);
			return;
		}
		if(type==='pay'){
			payList.push({
				method:'',
				address:''
			})
			setPayList([...payList]);
			return;
		}
	}

	const handleRemove=(idx:number,type:string)=>{
		if(type==='contact'){
			if(contactList.length===1)return;
			contactList.splice(idx,1);
			setContactList([...contactList]);
			return;
		}
		if(type==='pay'){
			if(payList.length===1)return;
			payList.splice(idx,1);
			setPayList([...payList]);
			return;
		}

	}
	const handleInputChange=(v:any,i:number,type:string)=>{
		if(type==='contact'){
			contactList[i].address=v;
			setContactList([...contactList]);
			return;
		}
		if(type==='pay'){
			payList[i].address=v;
			setPayList([...payList]);
			return;
		}
	}
	const handleOnSelectChange=(v:any,i:number,type:string)=>{
		if(type==='contact'){
			contactList[i].method=v;
			setContactList([...contactList]);
			return;
		}
		if(type==='pay'){
			payList[i].method=v;
			setPayList([...payList]);
			return;
		}
	}

	const UploadProps={
		action: () => {
			return new Promise(resolve => {
			  setTimeout(() => {
				resolve('/upload.do');
			  }, 2000);
			});
		},
		onStart(file:any) {
			console.log('onStart', file, file.name);
		},
		onSuccess(ret:any) {
			console.log('onSuccess', ret);
		},
		onError(err:any) {
			console.log('onError', err);
		},
	}

	const props = {
		width: '24px',
		height: '24px',
	};

	return (
		<>
			<Head>
				<title>{t('pending-order.page-title')}</title>
			</Head>
			{/* <NoWallet /> */}
			{/* <Deal /> */}
			<Container>
				{
					false && <OperationBox>
					<Button variant='text'>
						<img src={Edit} {...props}></img>
					</Button>
					&nbsp;&nbsp;
					<Button variant='text'>
						<img src={Delete} {...props}></img>
					</Button>
				</OperationBox>
				}
				<TopBox>
					<AllowSystemBox>
						<ASRow>
							<ASCol>
								<LabelInput label='化名' name='name' val={requestData.name} onChange={handleNameChange}></LabelInput>
								<LabelInput label='广告' name='ad' val={requestData.ad} onChange={handleNameChange}></LabelInput>
							</ASCol>
							<ASCol>
								<SelectInput
									label="价格"
									name='price'
									options={options}
									onInputChange={handleSelectInputChange}
									selectVal={requestData.price.select}
									inputVal={requestData.price.input}
									onSelectChange={handleSelectChange}
								></SelectInput>
								<SelectInput
									label="商品"
									name='goods'
									options={options}
									onInputChange={handleSelectInputChange}
									selectVal={requestData.goods.select}
									inputVal={requestData.goods.input}
									onSelectChange={handleSelectChange}
								></SelectInput>
							</ASCol>
						</ASRow>
						<LabelInput label='认证信息' name='auth' val={requestData.auth} onChange={handleNameChange}></LabelInput>
						<Approval>
							<Button variant="primary" size='xl'>
								<SubmitTxt width='100%'>批准系统转款</SubmitTxt>
							</Button>
						</Approval>
					</AllowSystemBox>
					<UploadAvatarBox>
						<div className="label">头像</div>
						<AvatarWrap>
							<img className='avatar' src="http://m.imeitou.com/uploads/allimg/2016062920/ke4rrvvmx5g.jpg" alt=""/>
						</AvatarWrap>
						{/* @ts-ignore */}
						<Upload {...UploadProps}>
							<div style={{marginTop:'50px',width:'100%'}}>
								<Button variant="primary" size='xl' style={{width:'100%'}}>
									<SubmitTxt width='100px'>上传头像</SubmitTxt>
								</Button>
							</div>
						</Upload>
					</UploadAvatarBox>
				</TopBox>
				<BottomBox>
					<ContactType
						label="联系方式"
						list={contactList}
						selectOptions={ContactSelectOptions}
						onAdd={()=>handleAdd('contact')}
						onRemove={(i)=>handleRemove(i,'contact')}
						onInputChange={(v,i)=>handleInputChange(v,i,'contact')}
						onSelectChange={(v,i)=>handleOnSelectChange(v,i,'contact')}
					></ContactType>

					<ContactType
						label="支付方式"
						list={payList}
						selectOptions={PaySelectOptions}
						onAdd={()=>handleAdd('pay')}
						onRemove={(i)=>handleRemove(i,'pay')}
						onInputChange={(v,i)=>handleInputChange(v,i,'pay')}
						onSelectChange={(v,i)=>handleOnSelectChange(v,i,'pay')}
					></ContactType>
				</BottomBox>

				<HandleBtnGroup>
					<Button variant="primary" size='xl'>
						<SubmitTxt width='100%'>开&nbsp;&nbsp;&nbsp;&nbsp;单</SubmitTxt>
					</Button>
					{/* <ItemBtn>开&nbsp;&nbsp;&nbsp;&nbsp;单</ItemBtn>
					<ItemBtn>编&nbsp;&nbsp;&nbsp;&nbsp;辑</ItemBtn>
					<ItemBtn>删&nbsp;&nbsp;&nbsp;&nbsp;除</ItemBtn> */}
				</HandleBtnGroup>
			</Container>
		</>
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
`;

const SubmitTxt = styled.span`
    display: inline-block;
    width:${(props) => props.width};;
`

const Container=styled.div`
	padding: 50px 60px;
	border-radius: 22px;
	background: #203298;
`

const OperationBox=styled.div`
	width: 100%;
	text-align: right;
`

const TopBox=styled.div`
	display: flex;
	width:100%;
`
const AllowSystemBox=styled.div`
	width:78%;
	flex:1;
`
const ASRow=styled.div`
	display: flex;
	width: 100%;
`

const Approval=styled.div`
	margin-top: 30px;
	width: 100%;
	button{
		width: 100%;
	}
`

const ASCol=styled.div`
	width: 47.5%;
	flex: 1;
	&:first-child{
		margin-right: 5%;
	}
`
const UploadAvatarBox=styled.div`
	margin-left: 2%;
	width:20%;
	.label{
		font-size: 18px;
        font-weight: 400;
        color: #DADDF7;
        margin-bottom: 8px;
        margin-left: 15px;
	}
`

const AvatarWrap=styled.div`
	width: 100%;
	height: 234px;
	background: #192987;
	border-radius: 14px;
	display: flex;
	justify-content: center;
	align-items: center;
	.avatar{
		height: 120px;
	}
`

const UploadAvatarBtn=styled.div`
	${btnCss};
	margin-top: 20px;
`

const SystemBtn=styled.div`
	${btnCss};
	margin-top: 70px;
`

const BottomBox=styled.div`
	display: flex;
	margin-top: 30px;
	width: 100%;
	>div{
		width: 47.5%;
		>button{
			width: 100%;
		}
	}
`

const HandleBtnGroup=styled.div`
	margin-top: 75px;
	width: 100%;
	>button{
		width: 100%;
	}
`
const ItemBtn=styled.div`
	${btnCss};
	margin-bottom: 30px;
`


export default PendingOrder;
