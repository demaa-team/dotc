import React, { FC, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
// import Table from 'components/Table';
// import Table from 'components/Table';
import Table from './components/table';

import TableCom from './components/tableCom'

import UIContainer from 'containers/UI';
// import Select from './components/select';
import Select from 'components/Select';
import Currency from 'components/Currency';
import { useRouter } from 'next/router';

const Exchange: FC = () => {
	const router = useRouter();
	const { t } = useTranslation();
	const { setTitle } = UIContainer.useContainer();

	// header title
	useEffect(() => {
		setTitle('staking', 'earn');
	}, [setTitle]);

	const columns = useMemo(
		() => [
			{
				Header: '交易ID',
				accessor: 'firstName',
			},
			{
				Header: '角色',
				accessor: 'lastName',
			},
			{
				Header: '商品类型',
				accessor: 'age',
			},
			{
				Header: '货币类型',
				accessor: 'visits',
			},
			{
				Header: '成交价格',
				accessor: 'status1',
			},
			{
				Header: '成交数量',
				accessor: 'status2',
			},
			{
				Header: '剩余确认时间',
				accessor: 'status3',
			},
			{
				Header: '状态',
				accessor: 'status',
			},
			{
				Header: '操作',
				accessor: 'action',
			},
		],
		[]
	)
	const data = [
		{
			firstName: '交易ID01',
			lastName: '角色01',
			age: '商品类型01',
			visits:'货币类型01',
			status1: '成交价格01',
			status2: '成交数量01',
			status3: '剩余确认时间01',
			status: '状态01',
			action:'handle'
		},
		{
			firstName: '交易ID02',
			lastName: '角色02',
			age: '商品类型02',
			visits:'货币类型02',
			status1: '成交价格02',
			status2: '成交数量02',
			status3: '剩余确认时间02',
			status: '状态02',
			action:'handle'
		}
	]

	const tableCol=[
		{
			Header: '交易ID',
			accessor: 'firstName',
			height:100
		},
		{
			Header: '角色',
			accessor: 'lastName',
		},
		{
			Header: '商品类型',
			accessor: 'age',
		},
		{
			Header: '货币类型',
			accessor: 'visits',
		},
		{
			Header: '成交价格',
			accessor: 'status1',
		},
		{
			Header: '成交数量',
			accessor: 'status2',
		},
		{
			Header: '剩余确认时间',
			accessor: 'status3',
		},
		{
			Header: '状态',
			accessor: 'status',
		},
		{
			Header: '操作',
			accessor: 'action',
			Cell: () => {
				return (
					<>
						<div className="handleBtnGroup">
							<div className="btn" onClick={handleBtnCLick}>确认</div>
							<div className="btn" onClick={handleBtnCLick}>取消</div>
						</div>
						<div className="handleBtnGroup">
							<div className="btn" onClick={handleBtnCLick}>仲裁</div>
							<div className="btn" onClick={handleBtnCLick}>辩护</div>
						</div>
					</>
				)
			},
		},
	]
	const handleBtnCLick=()=>{
		router.push('/exchange/detail/456');
	}

	// 角色下拉框
	const roleOptions = [
		{ label: '角色1', value: '1' },
		{ label: '角色2', value: '2' },
		{ label: '角色3', value: '3' },
	]
	// 商品类型
	const productOptions = [
		{ label: '商品1', value: '1' },
		{ label: '商品2', value: '2' },
		{ label: '商品3', value: '3' },
	]
	// 货币类型
	const currencyOptions = [
		{ label: '货币1', value: '1' },
		{ label: '货币2', value: '2' },
		{ label: '货币3', value: '3' },
	]	
	// 交易状态
	const delOptions = [
		{ label: '交易1', value: '1' },
		{ label: '交易2', value: '2' },
		{ label: '交易3', value: '3' },
	]

	const value = '1'
	return (
		<>
			<Head>
				<title>{t('exchange.page-title')}</title>
			</Head>

			<Container>
				<SelectWrap>
					<SelectInput data-testid="select">
						{/* <Select
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
						/> */}
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
				
				{/* <Styles>
					<Table
						columns={columns}
						data={data}
					/>
				</Styles> */}
				<Styles>
					<TableCom
						palette="primary"
						isLoading={false}
						{...{ columns:tableCol }}
						data={data}
						// noResultsMessage={noResultsMessage}
						// showPagination={true}
					/>
				</Styles>
				
			</Container>


			
		</>
	);
};
const Container=styled.div`
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
	table {
		width: 100%;
		border-spacing: 0;
		/* border: 1px solid black; */
		thead{
			background: #192987;
		}
		tr {
			height: 100px;
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
		background: #192987;
		/* height: 100px; */
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
