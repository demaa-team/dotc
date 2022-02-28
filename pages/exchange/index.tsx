import React, { FC, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
// import Table from 'components/Table';
// import Table from 'components/Table';
import Table from './components/table';
import useSynthetixQueries from 'demaa-queries';

import TableCom from './components/tableCom'

import UIContainer from 'containers/UI';
import Connector from 'containers/Connector';

// import Select from './components/select';
import Select from 'components/Select';
import Currency from 'components/Currency';
import { useRouter } from 'next/router';
import useDealHistoryQuery from "queries/otc/subgraph/useDealHistoryQuery";
import { useRecoilState, useRecoilValue } from 'recoil';
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
import { appReadyState } from 'store/app';
import { walletAddressState, isWalletConnectedState, networkState } from 'store/wallet';
import QUERY_KEYS from 'constants/queryKeys';
import { BigNumber } from 'ethers';
import {GAS_LIMIT, GAS_PRICE, formatTimeLeft, DEAL_EXPIRED} from "queries/otc/subgraph/utils";

const Exchange: FC = () => {
	const router = useRouter();
	const { t } = useTranslation();
	const { setTitle } = UIContainer.useContainer();
	const dealQuery = useDealHistoryQuery();
	let deals = dealQuery.isSuccess?dealQuery.data:[];
	const walletAddress = useRecoilValue(walletAddressState);
	const {useSynthetixTxn, useContractTxn } = useSynthetixQueries();
	const [dealID, setDealID] = useState<BigNumber>(BigNumber.from(0));
	const [actionState, setActionState] = useState<string>("");
	const [txModalOpen, setTxModalOpen] = useState<boolean>(false);

	// header title
	useEffect(() => {
		setTitle('staking', 'earn');
	}, [setTitle]);

	deals = deals??[];

	const timePromt = (t):string =>{
		const left = (t + DEAL_EXPIRED) - Date.now();
		if(left <= 0){
			return 'Expired';
		}
		return formatTimeLeft(left);
	};

	const data = useMemo(()=> deals.map(d=>({
		dealID: d.dealID,
		role: walletAddress === d.maker?"Maker":"Taker",
		coinType: d.coinCode,
		currencyType: d.currencyCode,
		uint: Number(d.price).toFixed(2),
		amount: d.amount,
		fee:Number(d.fee).toFixed(2),
		payment: (Number(d.price) * Number(d.amount)).toFixed(2),
		remainingTime: timePromt(d.cTime),
		status: d.dealState,
		adjudicationInfo:d.adjudicationInfo,
		action:'handle'
	})), [deals]);

	const tableCol=[
		{
			Header: 'ID',
			accessor: 'dealID',
			height:10,
			width:30,
		},
		{
			Header: 'ROLE',
			accessor: 'role',
			width:50,
		},
		{
			Header: 'TOKEN',
			accessor: 'coinType',
			width:50,
		},
		{
			Header: 'CURRENCY',
			accessor: 'currencyType',
			width:50,
		},
		{
			Header: 'UNIT',
			accessor: 'uint',
			width:40,
		},
		{
			Header: 'AMOUNT',
			accessor: 'amount',
			width:50,
		},
		{
			Header: 'FEE',
			accessor: 'fee',
			width:40,
		},
		{
			Header:"PAYMENT",
			accessor: 'payment',
			width:80,
		},
		{
			Header: 'Remaining Time',
			accessor: 'remainingTime',
			width:100,
		},
		{
			Header: 'STATUS',
			accessor: 'status',
			width:80,
		},
		{
			Header: 'ACTION',
			accessor: 'action',
			width:80,
			Cell: ({row:{values:deal}}) => {
				return (
					<>
						<div className="handleBtnGroup">
						{deal.status === "Confirming" ? (walletAddress === deal.maker ? 
						<div className="btn" onClick={()=>handleConfirmDeal(deal)}>Confirm</div>:
						<div className="btn" onClick={()=>handleCancelDeal(deal)}>Cancel</div>
						):<span>Noop</span>}
						</div>
					</>
				)
			},
		},
		{
			Header: '',
			accessor: 'detail',
			width:80,
			Cell: ({row:{values:deal}}) => {
				return (
					<>
						<div className="handleBtnGroup">
							<div className="btn action" onClick={()=>handleBtnCLick(deal)}>More...</div>
						</div>
					</>
				)
			},
		},
	]

	const confirmDealTxn = useSynthetixTxn(
		"OTC",
		'confirmDeal',
		[dealID], 
	{ gasPrice: GAS_PRICE.toBN(), gasLimit:GAS_LIMIT}
	);

	const cancelDealTxn = useSynthetixTxn(
		"OTC",
		'cancelDeal',
		[dealID], 
	{ gasPrice: GAS_PRICE.toBN(), gasLimit:GAS_LIMIT}
	);

	const handleConfirmDeal= (deal)=>{
		setDealID(deal.dealID);
		setActionState("confirm");
	}

	const handleCancelDeal= (deal)=>{
		setDealID(deal.dealID);
		setActionState("cancel");
	}

	const handleBtnCLick=(deal)=>{
		router.push(`/exchange/detail/${deal.dealID}`);
	}

	useEffect(()=>{
		if(actionState !== ""){
			if (actionState == "confirm"){
				confirmDealTxn.mutate();
			} else {
				cancelDealTxn.mutate();
			}
			setTxModalOpen(true);
			setActionState("");
		}
	}, [dealID, actionState]);

	useEffect(() => {
		switch (confirmDealTxn.txnStatus) {
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
	}, [confirmDealTxn.txnStatus]);

	useEffect(() => {
		switch (cancelDealTxn.txnStatus) {
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
	}, [cancelDealTxn.txnStatus]);

	// 角色下拉框
	const roleOptions = [
		{ label: 'Maker', value: '0' },
		{ label: 'Taker', value: '1' },
	]
	// 商品类型
	const productOptions = [
		{ label: 'USDT', value: '0' },
		{ label: 'USDC', value: '1' },
	]
	// 货币类型
	const currencyOptions = [
		{ label: 'CNY', value: '0' },
		{ label: 'USD', value: '1' },
	]	
	// 交易状态
	const delOptions = [
		{ label: 'Confimming', value: '0' },
		{ label: 'Cancelled', value: '1' },
		{ label: 'Confirmed', value: '2' },
	]

	return (
		<>
			<Head>
				<title>{t('exchange.page-title')}</title>
			</Head>

			<Container>
				{/*
				<SelectWrap>
					<SelectInput data-testid="select">
						{ <Select
							inputId={`label-asset-options`}
							formatOptionLabel={(option) => (
								<Currency.Name currencyKey={option.label} showIcon={true} />
							)}
							{...{ options, value }}
							onChange={(option: any) => {
								console.log(option,'option');
								
								// if (option) {
								// 	setAsset(option.value);
								// }
							}}
							variant="outline"
							isDisabled={false}
						/> }
						<Select
							variant="outline"
							options={roleOptions}
						/>
					</SelectInput>

					<SelectInput data-testid="select">
						<Select
							variant="outline"
							options={productOptions}
						/>
					</SelectInput>

					<SelectInput data-testid="select">
						<Select
							variant="outline"
							options={currencyOptions}
						/>
					</SelectInput>
					<SelectInput data-testid="select">
						<Select
							variant="outline"
							options={delOptions}
						/>
					</SelectInput>
				</SelectWrap>
						*/}
				<Styles>
					<TableCom
						palette="primary"
						isLoading={dealQuery.isLoading}
						{...{ columns:tableCol }}
						data={data}
						// noResultsMessage={noResultsMessage}
						showPagination={true}
					/>
				</Styles>
				
			</Container>

			    {actionState === "confirm" && confirmDealTxn.errorMessage !== "" && <ErrorMessage>{confirmDealTxn.errorMessage}</ErrorMessage>}
			    {actionState === "cancel" && cancelDealTxn.errorMessage !== "" && <ErrorMessage>{cancelDealTxn.errorMessage}</ErrorMessage>}

				{txModalOpen && actionState === "confirm" && (
				<TxConfirmationModal
					onDismiss={() => setTxModalOpen(false)}
					txError={confirmDealTxn.errorMessage}
					attemptRetry={confirmDealTxn.mutate}
					content={
						<TxModalContent/>
					}
				/>
				)}

				
			{txModalOpen  &&  actionState === "cancel" && (
				<TxConfirmationModal
					onDismiss={() => setTxModalOpen(false)}
					txError={cancelDealTxn.errorMessage}
					attemptRetry={cancelDealTxn.mutate}
					content={
						<TxModalContent/>
					}
				/>
				)}
		</>
	);
};
const Container=styled.div`
	font-family: ${(props) => props.theme.fonts.condensedMedium};
	background: #203298;
	border-radius: 22px;
`
const SelectWrap=styled.div`
	width: 100%;
	height: 100px;
	padding: 0 25px;
	display: flex;
	align-items: center;
	justify-content: space-around;
`

const Styles = styled.div`
	width: 100%;
	table {
		width: 100%;
		border-spacing: 0;
		/* border: 1px solid black; */
		thead{
			background: #192987;
		}
		tr {
			height: 50px;
			:last-child {
				td {
					border-bottom: 0;
				}
			}
		}

		th,
		td {
			margin: 0;
			padding: 0.5rem;
			text-align: center;
			/* border-bottom: 1px solid black;
			border-right: 1px solid black; */

			:last-child {
				border-right: 0;
			}
		}
	}
	.table-row{
		>div{
			background: #192987;
		}
	}
	.table-body-row{
		border-bottom: unset;
	}
	.table-body-cell{
		border-bottom: 1px solid #515FAF;
	}
	.table-body{
		overflow-x: unset;
		overflow-y: unset;
	}
	.handleBtnGroup{
		&:last-child{
			margin-left: 10px;
		}
		.btn{
			cursor: pointer;
			&:last-child{
				margin-top: 10px;
			}
			&:hover{
				color: #F86C29;
			}
		}
		.disabledBtn{
			cursor: not-allowed;
			color:#9195a3;
			&:hover{
				color: #9195a3;
			}
		}
		span{
			color: gray
		}
		.action{
			text-decoration:underline;
			color:yellow;
			&:hover{
				color:red;
			}

		}
	}
	.table-body-row{
		:last-child{
			.table-body-cell{
				border-bottom: unset;
			}
		}
	}
`;

const SelectInput = styled.div`
	width: 300px;
	flex: 1;
	margin: 0 25px;
	.react-select__control{
		border:1px solid #a5a5a5
	}
`;


export default Exchange;
