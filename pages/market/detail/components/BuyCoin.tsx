import { FC, useState, useMemo, useCallback, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Tooltip,FlexDiv } from 'styles/common';
import Img, { Svg } from 'react-optimized-image';
import HelpIcon from 'public/images/market/help-icon.png';
import Wei, { wei } from '@synthetixio/wei';

import { isWalletConnectedState, walletAddressState } from 'store/wallet';
import Connector from 'containers/Connector';
import UIContainer from 'containers/UI';
import GasSelector from 'components/GasSelector';
import CRatio from './CRatio';
import FeeRatio from './FeeRatio';
import { Synths } from 'constants/currency';
import { getExchangeRatesForCurrencies } from 'utils/currencies';
import {
	ModalItemTitle as TxModalItemTitle,
	ModalItemText as TxModalItemText,
} from 'styles/common';

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
import TxConfirmationModal from 'sections/shared/modals/TxConfirmationModal';
import FormButton from './FormButton';
import AssetInput from './AssetInput';
import useSynthetixQueries from 'demaa-queries';
import { parseSafeWei } from 'utils/parse';

type BorrowSynthsTabProps = {
	profile:any;
};

const COLLATERAL_ASSETS: { [asset: string]: string[] } = {
	DEM: ['DEM'],
	WETH: ['WETH'],
	USDT: ['USDT'],
};

const collRatio:string = "0.2";
const feeRatio:string = "0.003";

const BuyCoin: FC<BorrowSynthsTabProps> = ({profile}) => {

	if(profile == null){
		return;
	}

	const { t } = useTranslation();
	const { signer, synthetixjs, provider } = Connector.useContainer();
	const router = useRouter();
	const isWalletConnected = useRecoilValue(isWalletConnectedState);
	const address = useRecoilValue(walletAddressState);

	const [collateralBalance, setCollateralBalance] = useState<Wei>(wei(0));

	const { setTitle } = UIContainer.useContainer();
	const [collateralAsset, setCollateralAsset] = useState<string>('');

	const [amount, setAmount] = useState<string>("");
	const buyAmount = parseSafeWei(amount, wei(0));

	const [gasPrice, setGasPrice] = useState<Wei>(wei(0));

	const [txModalOpen, setTxModalOpen] = useState<boolean>(false);

	const { useExchangeRatesQuery, useSynthetixTxn, useContractTxn } = useSynthetixQueries();
	const exchangeRatesQuery = useExchangeRatesQuery();
	const exchangeRates = exchangeRatesQuery.data ?? null;

	const {erc20Contract, otcContract}= useMemo(() => {
		if (!signer || !synthetixjs) return{otcContract:null, erc20Contract:null};

		const {
			contracts: {OTC, ProxyERC20},
		} = synthetixjs!;
		return {otcContract: OTC, erc20Contract:ProxyERC20};
	}, [signer, synthetixjs]);

	const [allowance, setAllowance] = useState<Wei>(wei(0));
	const getAllowance = useCallback(async () => {
		if (address && erc20Contract && otcContract) {
			const allowance = wei(await erc20Contract.allowance(address, otcContract.address));

			setAllowance(allowance);

			return allowance;
		}

		return wei(0);
	}, [address, erc20Contract, otcContract]);

    // check if approved
	const collateralAmount = useMemo(()=>{
		if(exchangeRates?.DEM && exchangeRates?.DEM.gt(wei(0))){
			return buyAmount.mul(wei("0.2")).div(exchangeRates?.DEM);
		}
		return wei(0);
	},[buyAmount, exchangeRatesQuery.isSuccess, exchangeRates?.DEM]);
	const isApproved: boolean = allowance?.gt(collateralAmount) || false;

	const approveTxn = useContractTxn(
		erc20Contract,
		'approve',
		[otcContract?.address || ethers.constants.AddressZero, ethers.constants.MaxUint256],
		{ gasPrice: gasPrice.toBN() }
	);

	const openTxn = useSynthetixTxn(
		"OTC",
		'makeDeal',
		[profile.order?.maker??ethers.constants.AddressZero, 
		buyAmount.toBN(), 
		ethers.utils.formatBytes32String("DEM")], 
		{ gasPrice: gasPrice.toBN()}
	);

	const setOrderMax =()=>{
		if(profile.order){
			setAmount(wei(profile.order.leftAmount).mul(wei("0.8")).toString(2));
		}
	}

	// check if collateralAmount needed more than blance
	useEffect(() => {
		if (!signer && !erc20Contract) return;

		let isMounted = true;
		const unsubs: Array<any> = [() => (isMounted = false)];

		const onSetBalance = async () => {
			const balance = await erc20Contract.balanceOf(address);
			if (isMounted) setCollateralBalance(wei(balance));
		};

		const subscribe = () => {
			if (provider) {
				const newBlockEvent = 'block';
				provider.on(newBlockEvent, onSetBalance);
				unsubs.push(() => provider.off(newBlockEvent, onSetBalance));
			}
		};

		onSetBalance();
		subscribe();
		return () => {
			unsubs.forEach((unsub) => unsub());
		};
	}, [signer, provider]);

	useEffect(() => {
		switch (openTxn.txnStatus) {
			case 'unsent':
				setTxModalOpen(false);
				break;
			case 'pending':
				setTxModalOpen(true);
				break;
			case 'confirmed':
				setAmount('0');
				setTxModalOpen(false);
				//router.push('/loans/list');
				break;
		}
	}, [openTxn.txnStatus, router]);

	useEffect(() => {
		switch (openTxn.txnStatus) {
			case 'unsent':
			case 'confirmed':
				getAllowance();
				break;
		}
		switch (approveTxn.txnStatus) {
			case 'unsent':
			case 'confirmed':
				getAllowance();
				break;
		}
	}, [approveTxn.txnStatus, openTxn.txnStatus, getAllowance]);

	// header title
	useEffect(() => {
		setTitle('MARKET', 'DETAIL');
	}, [setTitle]);
	
	return (
		<>
		<Container>
			<FormContainer data-testid="loans-form">
				<InputsContainer>
				<AssetInput
						label="Buy Coin"
						amount={amount}
						setAsset={null}
						setAmount={setAmount}
						asset={"USDT"}
						assets={["USDT"]}
						selectDisabled={true}
						onSetMaxAmount={setOrderMax}
						bLabel="market.detail.left-label"
						showBalance={false}
					/>
					<InputsDivider />
				<AssetInput
						label="Pledge With" 
						asset="DEM"
						setAmount={null}
						setAsset={setCollateralAsset}
						amount={collateralAmount.toString(2)}
						assets={["DEM","USDT","WETH"]}
						inputDisabled={true}
					/>
			
				</InputsContainer>
				<SettingsContainer>
					<SettingContainer>
						<FeeRatio ratio={Number(feeRatio)} />
					</SettingContainer>
					<SettingContainer>
						<CRatio ratio={Number(collRatio)} />
					</SettingContainer>
					<SettingContainer>
						<GasSelector gasLimitEstimate={openTxn.gasLimit} setGasPrice={setGasPrice} />
					</SettingContainer>
				</SettingsContainer>
			</FormContainer>

			<FormButton
				onClick={async () => {
					!isApproved ? approveTxn.mutate() : openTxn.mutate();
					setTxModalOpen(true);
				}}

				{...{
					isWalletConnected,
					isApproved,
					collateralAsset,
					sellAsset:"USDT",
					hasInsufficientCollateral: wei(collateralBalance).lt(collateralAmount),
					hasInput: buyAmount.gt(0)
				}}
			/>
			</Container>

			{approveTxn.isError && <ErrorMessage>{approveTxn.errorMessage}</ErrorMessage>}
			{openTxn.isError && <ErrorMessage>{openTxn.errorMessage}</ErrorMessage>}

			{txModalOpen && (
				<TxConfirmationModal
					onDismiss={() => setTxModalOpen(false)}
					txError={openTxn.errorMessage}
					attemptRetry={openTxn.mutate}
					content={
						<TxModalContent>
							<TxModalItem>
								<TxModalItemTitle>
									Pledge
								</TxModalItemTitle>
								<TxModalItemText>
									{collateralAmount.toString(2)} {collateralAsset}
								</TxModalItemText>
							</TxModalItem>
							<TxModalItemSeperator />
							<TxModalItem>
								<TxModalItemTitle>
									Buy
								</TxModalItemTitle>
								<TxModalItemText>
									{buyAmount.toString(2)}
								</TxModalItemText>
							</TxModalItem>
						</TxModalContent>
					}
				/>
			)}
		</>
	);
};
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

const Container=styled.div`
	width: 100%;
    background: #203298;
    border-radius: 22px;
    padding: 20px;
	margin-top: 27px;
	`

export default BuyCoin;
