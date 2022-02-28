// @ts-nocheck
import { FC, useEffect,useState,useMemo, useCallback } from 'react';
import Head from 'next/head';
import styled,{css} from 'styled-components';
import { useTranslation } from 'react-i18next';
import {ContactSelectOptions,PaySelectOptions} from './assets/config'
import Deal from './components/deal';
import LabelInput from './components/label-input';
import SelectInput from './components/select-input';
import ContactType from './components/contact-type';
import PayType from './components/pay-type';
import Button from 'components/Button';
import Upload from 'rc-upload';
import Wei, { wei } from '@synthetixio/wei';
import {
	CURRENCY,
} from 'constants/order';
import {
	ModalItemTitle as TxModalItemTitle,
	ModalItemText as TxModalItemText,
} from 'styles/common';
import TxConfirmationModal from 'sections/shared/modals/TxConfirmationModal';
import {
	FormContainer,
	InputsContainer,
	InputsDivider,
	SettingsContainer,
	SettingContainer,
	ErrorMessage,
	TxModalContent,
	TxModalItem,
	TxModalItemSeperator,
} from 'sections/otc/common';
import { ethers } from 'ethers';
import useSynthetixQueries from 'demaa-queries';
import { useRecoilState, useRecoilValue } from 'recoil';
import {ProfileMeta} from 'queries/otc/subgraph/types';
import { walletAddressState, isWalletConnectedState, networkState } from 'store/wallet';
import {create as ipfsApi} from 'ipfs-http-client';
import useProfileQuery from "queries/otc/subgraph/useProfileQuery";

import UIContainer from 'containers/UI';
import { BigNumber } from 'ethers';
import Connector from 'containers/Connector';
import {abi, abi as erc20} from 'contracts/erc20';

import {getAvatar, defaultAvatar, ipfsEndPoint, GAS_LIMIT, GAS_PRICE, USDT_ADDRESS} from "queries/otc/subgraph/utils";

const ipfsClient = ipfsApi(ipfsEndPoint);
const Delete =require('./images/delete.png');
const Edit=require('./images/edit.png')

const unitOptions= [
	{label:'CNY', value:'CNY'},
	{label:'USD', value:'USD'},
];

const coinOptions = [
	{label:'USDT', value:'USDT'},
];

const PendingOrder: FC = () => {
	const { t } = useTranslation();
	const { signer, synthetixjs, provider } = Connector.useContainer();
	const { setTitle } = UIContainer.useContainer();
	const walletAddress = useRecoilValue(walletAddressState);
	const [txModalOpen, setTxModalOpen] = useState<boolean>(false);
	const {useSynthetixTxn, useContractTxn } = useSynthetixQueries();
	const profileQuery = useProfileQuery();
	const [orderSelect, setOrderSelect] = useState({"coin":coinOptions[0], "unit":unitOptions[0]});
	const [orderInput, setOrderInput] = useState({"coin":wei(0), "unit":wei(0)});
	const [fieldRequired, setFieldRequired] = useState<string>("");
	const [orderFieldRequired, setOrderFieldRequired] = useState<string>("");
	let address = walletAddress?walletAddress:"";
	const [requestData, setRequestData] = useState({ver:-1, auth:"", avatar:"", alias:'', ad:'', contacts:[{type:"", address:""}], pays:[{type:"", address:""}]});
	const [cid, setCid] = useState<string>(profileQuery.data?.ipfsHash??"");
	let hasProfile = profileQuery.isSuccess;
	let hasOrder = hasProfile && profileQuery.data?.order;

	useEffect(()=>{
		const ipfsVer:number = profileQuery.data?.ver??0;
		if(ipfsVer > requestData.ver){
			let newData = Object.assign({...requestData}, profileQuery.data??{});
			if(newData.contacts == null){
				newData.contacts = [{type:"", address:""}];
			} else if(newData.contacts.length == 0){
				newData.contacts[0] = {type:"", address:""};
			}
			if(newData.pays == null){
				newData.pays = [{type:"", address:""}];
			} else if(newData.pays.length == 0){
				newData.pays[0] = {type:"", address:""};
			}
			setRequestData(newData);
		}
		if(profileQuery.data?.order){
			setOrderSelect(
				Object.assign({...orderSelect}, 
				{
				"coin":{label:profileQuery.data.order.coinCode, value:profileQuery.data.order.coinCode}, 
				"unit":{label:profileQuery.data.order.currencyCode, value:profileQuery.data.order.currencyCode},
				}));
				
				setOrderInput(
					Object.assign({...orderInput},
					{
						"coin":wei(profileQuery.data.order.leftAmount),
						"unit":wei(profileQuery.data.order.price)
					}));	
		}
	},[profileQuery.data]);

	// header title
	// useEffect(() => {
	// 	setTitle('wallet', 'escrow');
	// }, [setTitle]);

	const handleValueChange=(key:string,val:any)=>{
		setRequestData(data=>Object.assign({...data},{[key]:val}));
		if(fieldRequired !== ""){
			setFieldRequired("");
		}
	}

	// coin
	const handleSelectInputChange=(key:string,v:any)=>{
		if(fieldRequired !== ""){
			setFieldRequired("");
		}
		setOrderInput(
			Object.assign({...orderInput},
			{
				[key]:wei(v)
			}));
			if(orderFieldRequired !== ""){
				setOrderFieldRequired("");
			}
	}

	const handleSelectChange=(key:string,v:any)=>{
		console.log(key)
		setOrderSelect(Object.assign({...orderSelect},
			{[key]:v}
			));

		if(orderFieldRequired !== ""){
			setOrderFieldRequired("");
		}
	}

	const handleAdd=(type:string)=>{
		if(type==='contact'){
			requestData.contacts.push({type:"", address:""})
			setRequestData({...requestData});
			return;
		}
		if(type==='pay'){
			requestData.pays.push({type:"", address:""})
			setRequestData({...requestData});
			return;
		}
	}

	const handleRemove=(idx:number,type:string)=>{
		if(type==='contact'){
			if(requestData.contacts.length===1)return;
			requestData.contacts.splice(idx,1);
			setRequestData({...requestData});
			return;
		}
		if(type==='pay'){
			if(requestData.pays.length===1)return;
			requestData.pays.splice(idx,1);
			setRequestData({...requestData});
			return;
		}
	}

	const handleInputChange=(v:any,i:number,type:string)=>{
		if(type==='contact'){
			requestData.contacts[i].address=v;
			setRequestData({...requestData});
			return;
		}
		if(type==='pay'){
			requestData.pays[i].address=v;
			setRequestData({...requestData});
			return;
		}
	}

	const handleOnSelectChange=(v:any,i:number,type:string)=>{
		if(type==='contact'){
			requestData.contacts[i].type=v.value;
			setRequestData({...requestData});
			return;
		}
		if(type==='pay'){
			requestData.pays[i].type=v.value;
			setRequestData({...requestData});
			return;
		}
	}

	let usdtContract:ethers.Contract = null;
	if(provider){
		usdtContract = new ethers.Contract(USDT_ADDRESS, abi, provider);
	}

	const  otcContract = useMemo(() => {

		if (!signer || !synthetixjs) return null;
		const {
			contracts: {OTC},
		} = synthetixjs!;


		return OTC;
	}, [signer, synthetixjs]);

	// construct tx
	const registerTxn = useSynthetixTxn(
		"OTC",
		'registerProfile',
		[cid.toString()], 
		{ GAS_PRICE: GAS_PRICE.toBN()}
	);
	const updateProfileTxn = useSynthetixTxn(
		"OTC",
		'updateProfile',
		[cid.toString()], 
		{ GAS_PRICE: GAS_PRICE.toBN(), gasLimit:GAS_LIMIT}
	);
	const orderApproveTxn = useContractTxn(
		usdtContract,
		'approve',
		[otcContract?.address || ethers.constants.AddressZero, ethers.constants.MaxUint256],
		{ GAS_PRICE: GAS_PRICE.toBN(), gasLimit:GAS_LIMIT}
	);
	const openOrderTxn = useSynthetixTxn(
		"OTC",
		'openOrder',
		[ethers.utils.formatBytes32String(orderSelect.coin.value), 
		ethers.utils.formatBytes32String(orderSelect.unit.value),
		orderInput.unit.toBN(),
		orderInput.coin.toBN()
	], 
	{ GAS_PRICE: GAS_PRICE.toBN(), gasLimit:GAS_LIMIT}
	);
	const updateOrderTxn = useSynthetixTxn(
		"OTC",
		'updateOrder',
		[orderInput.unit.toBN(),orderInput.coin.toBN()], 
	{ GAS_PRICE: GAS_PRICE.toBN(), gasLimit:GAS_LIMIT}
	);

	const [allowance, setAllowance] = useState<Wei>(wei(0));
	const getAllowance = useCallback(async () => {

		if (address && usdtContract && otcContract) {
			const allo = wei(await usdtContract.allowance(address, otcContract.address));
			
			if(!allo.eq(allowance)){
				setAllowance(allo);
			}

			return allowance;
		}

		return wei(0);
	}, [address, otcContract, usdtContract]);
	useEffect(()=>{
		if(address && otcContract && usdtContract){

			getAllowance();
		}
	},[address, otcContract, usdtContract]);
	const isOrderProved: boolean = allowance?.gt(0) || false;
	
	const validProfile = ():string=>{
		let validResult="";
		
		// name is required
		if(requestData.auth === ""){
			validResult += " [name]";
		}
		if(requestData.alias === ""){
			validResult += "These fields are required:\n";
			validResult += " [alias]";
		}
		if(!requestData.contacts.some((item)=> (item.type && item.type != "" && item.address && item.address !== ""))){
			console.log(requestData.contacts)
			validResult += " [contact list]";
		}
		if(!requestData.pays.some((item)=> (item.type && item.type != "" && item.address && item.address !== ""))){
			validResult += " [pay list]";
		}
		if(validResult !== ""){
			validResult = 'These fields are required:' + validResult;
		}
		if(validResult !== ""){
			setFieldRequired(validResult);
		} else if(fieldRequired !== "") {
			setFieldRequired("");
		}
		return validResult;
	}

	// register profile
	const registerProfile=()=>{
		if(validProfile() !== ""){
			return;
		}
		let newProfile = Object.assign({
			account: address,
		}, requestData);
		newProfile.contacts = [];
		requestData.contacts.forEach(item=>{
			if(item.type !== "" && item.address !== ""){
				newProfile.contacts.push(item);
			}
		});
		newProfile.pays = [];
		requestData.pays.forEach(item=>{
			if(item.type !== "" && item.address !== ""){
				newProfile.contacts.push(item);
			}
		});
		ipfsClient.add(JSON.stringify(newProfile)).then(profileCid=>{
		if(profileCid){
			setCid(profileCid.cid.toString());
			registerTxn.mutate();
			setTxModalOpen(true);
		}});
	}

	// update profile
	const updateProfile=()=>{
		const validMsg = validProfile();
		if(validMsg !== ""){
			setFieldRequired(validMsg);
			return;
		}
		let newProfile = Object.assign({
			account: address,
		}, requestData);
		newProfile.contacts = [];
		requestData.contacts.forEach(item=>{
			if(item.type !== "" && item.address !== ""){
				newProfile.contacts.push(item);
			}
		});
		newProfile.pays = [];
		requestData.pays.forEach(item=>{
			if(item.type !== "" && item.address !== ""){
				newProfile.pays.push(item);
			}
		});
		newProfile.ver += 1;
		console.log(newProfile)
		ipfsClient.add(JSON.stringify(newProfile)).then(profileCid=>{
		if(profileCid){
			setCid(profileCid.cid);
			updateProfileTxn.mutate();
			setTxModalOpen(true);
		}});
	}


	// const approve
	const approveOrder = ()=>{
		orderApproveTxn.mutate();
		setTxModalOpen(true);
	}

	const validOrder = ():boolean =>{
		let validResult="";
		if(orderSelect.coin.value === ""){
			validResult +="[Coin type]"
		}
		if(orderSelect.unit.value === ""){
			validResult +="[Unit type]"
		}
		if(orderInput.unit.lte(wei("0.0001"))){
			validResult +="[Unit value too small]"
		}
		if(validResult !== ""){
			validResult = `These fields are requied\n` + validResult;
			setOrderFieldRequired(validResult);
			return false;
		}
		return true;
	}
	// open order
	const openOrder = ()=>{
		if(validOrder()){
			openOrderTxn.mutate();
			setTxModalOpen(true);
		}
	}

	// update order
	const updateOrder = ()=> {
		if(validOrder()){
			updateOrderTxn.mutate();
			setTxModalOpen(true);
		}
	}

	const closeOrder = ()=>{

	}

	const UploadProps={
		type: 'drag',
		action: async (file) => {
			if(file){
				try{
					const ret = await ipfsClient.add(file);
					if(ret){
						setRequestData(data=>Object.assign({...data}, {"avatar":ret.cid.toString()}));
					}
				}catch(_){

				}
			}
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

	useEffect(() => {
		switch (registerTxn.txnStatus) {
			case 'unsent':
				setTxModalOpen(false);
				break;
			case 'pending':
				setTxModalOpen(true);
				break;
			case 'confirmed':
				setTxModalOpen(false);
				//router.push('/loans/list');
				break;
		}
	}, [registerTxn.txnStatus]);

	useEffect(() => {
		switch (updateProfileTxn.txnStatus) {
			case 'unsent':
				setTxModalOpen(false);
				break;
			case 'pending':
				setTxModalOpen(true);
				break;
			case 'confirmed':
				setTxModalOpen(false);
				//router.push('/loans/list');
				break;
		}
	}, [updateProfileTxn.txnStatus]);

	useEffect(() => {
		switch (orderApproveTxn.txnStatus) {
			case 'unsent':
				setTxModalOpen(false);
				break;
			case 'pending':
				setTxModalOpen(true);
				break;
			case 'confirmed':
				setTxModalOpen(false);
				getAllowance();
				//router.push('/loans/list');
				break;
		}
	}, [orderApproveTxn.txnStatus]);

	useEffect(() => {
		switch (openOrderTxn.txnStatus) {
			case 'unsent':
				setTxModalOpen(false);
				break;
			case 'pending':
				setTxModalOpen(true);
				break;
			case 'confirmed':
				setTxModalOpen(false);
				//router.push('/loans/list');
				break;
		}
	}, [openOrderTxn.txnStatus]);

	useEffect(() => {
		switch (updateOrderTxn.txnStatus) {
			case 'unsent':
				setTxModalOpen(false);
				break;
			case 'pending':
				setTxModalOpen(true);
				break;
			case 'confirmed':
				setTxModalOpen(false);
				//router.push('/loans/list');
				break;
		}
	}, [updateOrderTxn.txnStatus]);

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
								<LabelInput label='Name' name='auth' val={requestData.auth} onChange={handleValueChange}></LabelInput>
								<LabelInput label='Alias' name='alias' val={requestData.alias} onChange={handleValueChange}></LabelInput>
								<LabelInput label='Advertisement' name='ad' val={requestData.ad} onChange={handleValueChange}></LabelInput>
							</ASCol>
							<ASCol>
								<UploadAvatarBox>
									<Upload {...UploadProps}>
									<AvatarWrap>
										<img className='avatar' src={getAvatar(requestData.avatar,defaultAvatar)}  alt="" />
										<div className='mask'> Avatar</div>
									</AvatarWrap>
								    </Upload>
								</UploadAvatarBox>
							</ASCol>
						</ASRow>
					</AllowSystemBox>
				</TopBox>
				<BottomBox>
					<ContactType
						label="Contacts"
						list={requestData.contacts}
						onAdd={()=>handleAdd('contact')}
						onRemove={(i)=>handleRemove(i,'contact')}
						onInputChange={(v,i)=>handleInputChange(v,i,'contact')}
						onSelectChange={(v,i)=>handleOnSelectChange(v,i,'contact')}
					></ContactType>
					<PayType
						label="Payments"
						list={requestData.pays}
						onAdd={()=>handleAdd('pay')}
						onRemove={(i)=>handleRemove(i,'pay')}
						onInputChange={(v,i)=>handleInputChange(v,i,'pay')}
						onSelectChange={(v,i)=>handleOnSelectChange(v,i,'pay')}
					></PayType>
				</BottomBox>
				<Approval>
					<Button variant="primary" size='xl'>
						<SubmitTxt width='100%' onClick={
							hasProfile?updateProfile:registerProfile
							}>
							{hasProfile?"Update Profile":"Register Profile"}
							</SubmitTxt>
					</Button>
				</Approval>

			   {registerTxn.isError && <ErrorMessage>{registerTxn.errorMessage}</ErrorMessage>}
			   {updateProfileTxn.isError && <ErrorMessage>{updateProfileTxn.errorMessage}</ErrorMessage>}
			   {fieldRequired !== "" && <ErrorMessage>{fieldRequired}</ErrorMessage>}
				{txModalOpen && (
				<TxConfirmationModal
					onDismiss={() => setTxModalOpen(false)}
					txError={!hasProfile?registerTxn.errorMessage:updateProfileTxn.errorMessage}
					attemptRetry={!hasProfile?registerTxn.mutate:updateProfileTxn.mutate}
					content={
						<TxModalContent/>
					}
				/>
			)}

			</Container>
			{hasProfile ? <Container>
			<AllowSystemBox/>
						<ASRow>
							<ASCol>
							<SelectInput
									label="Coin"
									name='coin'
									options={coinOptions}
									onInputChange={handleSelectInputChange}
									selectVal={orderSelect.coin}
									inputVal={orderInput.coin.toNumber()}
									onSelectChange={handleSelectChange}
									isDisabled = {hasOrder}
								/>
								</ASCol>
							<ASCol>
						       <SelectInput
									label="Unit"
									name='unit'
									options={unitOptions}
									onInputChange={handleSelectInputChange}
									selectVal={orderSelect.unit}
									inputVal={orderInput.unit.toNumber()}
									onSelectChange={handleSelectChange}
									isDisabled = {hasOrder}
								/>
						  </ASCol>
						</ASRow>
						<ASRow>
						<Approval>
							<Button variant="primary" size='xl'>
								<SubmitTxt width='100%' onClick={
									!hasOrder?(isOrderProved?openOrder:approveOrder):updateOrder
									}>
									{!hasOrder?(isOrderProved?"Open":"Approve"):"Update"}</SubmitTxt>
							</Button>
						</Approval>
						</ASRow>

						{orderApproveTxn.isError && <ErrorMessage>{orderApproveTxn.errorMessage}</ErrorMessage>}
						{orderFieldRequired !== "" && <ErrorMessage>{orderFieldRequired}</ErrorMessage>}
			</Container>
			:null}
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
	font-family: ${(props) => props.theme.fonts.condensedMedium};
	padding: 50px 60px;
	border-radius: 22px;
	background: #203298;
	margin-bottom: 20px;
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
	margin-bottom: 20px;
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
    //flex:1
    display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 2%;
	height:100%;
	width:100%;
	.label{
		font-size: 18px;
        font-weight: 400;
        color: #DADDF7;
        margin-bottom: 8px;
        margin-left: 15px;
	}
`

const AvatarWrap=styled.div`
position: relative;
width: 250px;
height: 250px;
display: flex;
align-items: center;
justify-content: center;
border: 2px dotted #49C8BA;
border-radius: 50%;
.avatar{
	width: 240px;
	height: 240px;
	border-radius: 50%;
}

.mask{
	color:silver;
	font-size: 50px;
	position: absolute;
	top: 90px;
	bottom: 0px;
	text-transform: uppercase;
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
