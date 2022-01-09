import { FC, useMemo, useEffect ,useState} from 'react';
import Wei, { wei } from '@synthetixio/wei';
import { CryptoCurrency, Synths } from 'constants/currency';
import UIContainer from 'containers/UI';
import { FlexDivCol } from 'styles/common';
import styled from 'styled-components';
import { formatCurrency } from 'utils/formatters/number';
import { BurnActionType } from 'store/staking';
import useBurnTx from 'sections/staking/hooks/useBurnTx';
import BurnTiles from 'sections/staking/components/BurnTiles';
import StakingInput from 'sections/staking/components/StakingInput';
import { TabContainer,TabRowContainer } from 'sections/staking/components/common';
import InfoBox from '../InfoBox';
import { StakingPanelType } from 'store/staking';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { MenuModal } from '../../../shared/modals/common';
const BurnTab: FC = () => {
	const {
		debtBalance,
		sUSDBalance,
		issuableSynths,
		onBurnChange,
		txn,
		burnType,
		needToBuy,
		amountToBurn,
		onBurnTypeChange,
		debtBalanceWithBuffer,
		swapTxn,
		quoteAmount,
		missingSUSDWithBuffer,
		percentageTargetCRatio,
		error,
		txModalOpen,
		setTxModalOpen,
		setGasPrice,
	} = useBurnTx();

	const { setTitle } = UIContainer.useContainer();
	const [settingsModalOpened, setSettingsModalOpened] = useState<boolean>(false);
	// header title
	useEffect(() => {
		setTitle('staking', 'burn');
	}, [setTitle]);

	const returnPanel = useMemo(() => {
		let handleSubmit;
		let inputValue: string = '0';
		let isLocked;
		let etherNeededToBuy;
		let sUSDNeededToBuy;
		let sUSDNeededToBurn;

		/* If a user has more sUSD than the debt balance, the max burn amount is their debt balance, else it is just the balance they have */
		const maxBurnAmount = debtBalance.gt(sUSDBalance) ? wei(sUSDBalance) : debtBalance;

		const burnAmountToFixCRatio = wei(Math.max(debtBalance.sub(issuableSynths).toNumber(), 0));

		switch (burnType) {
			case BurnActionType.MAX:
				onBurnChange(maxBurnAmount.toString());
				handleSubmit = () => {
					txn.mutate();
				};
				inputValue = maxBurnAmount.toString();
				isLocked = true;
				break;
			case BurnActionType.TARGET:
				const calculatedTargetBurn = Wei.max(debtBalance.sub(issuableSynths), wei(0));
				onBurnChange(calculatedTargetBurn.toString());
				handleSubmit = () => {
					txn.mutate();
				};
				inputValue = calculatedTargetBurn.toString();
				isLocked = true;
				break;
			case BurnActionType.CUSTOM:
				handleSubmit = () => txn.mutate();
				inputValue = amountToBurn;
				isLocked = false;
				break;
			case BurnActionType.CLEAR:
				if (!needToBuy) {
					onBurnTypeChange(BurnActionType.MAX);
					handleSubmit = () => {
						txn.mutate();
					};
					inputValue = maxBurnAmount.toString();
					isLocked = true;
					break;
				}
				onBurnChange(debtBalanceWithBuffer.toString());
				handleSubmit = () => swapTxn.mutate();
				inputValue = debtBalanceWithBuffer.toString();
				isLocked = true;
				if (quoteAmount) {
					etherNeededToBuy = formatCurrency(CryptoCurrency.ETH, quoteAmount, {
						currencyKey: CryptoCurrency.ETH,
					});
				}
				sUSDNeededToBuy = formatCurrency(Synths.sUSD, missingSUSDWithBuffer);
				sUSDNeededToBurn = formatCurrency(Synths.sUSD, debtBalanceWithBuffer);
				break;
			default: 
				return (
					<BurnTiles
						percentageTargetCRatio={percentageTargetCRatio}
						burnAmountToFixCRatio={burnAmountToFixCRatio}
					/>
				);
		}
		return (
			<SettingsModal onDismiss={()=>onBurnTypeChange(null)}>
				<StakingInput
					onSubmit={handleSubmit}
					inputValue={inputValue}
					isLocked={isLocked}
					isMint={false}
					onBack={onBurnTypeChange}
					error={error || swapTxn.errorMessage || txn.errorMessage}
					txModalOpen={txModalOpen}
					setTxModalOpen={setTxModalOpen}
					gasLimitEstimate={txn.gasLimit}
					setGasPrice={setGasPrice}
					onInputChange={onBurnChange}
					txHash={txn.hash}
					transactionState={txn.txnStatus}
					resetTransaction={txn.refresh}
					maxBurnAmount={maxBurnAmount}
					burnAmountToFixCRatio={burnAmountToFixCRatio}
					etherNeededToBuy={etherNeededToBuy}
					sUSDNeededToBuy={sUSDNeededToBuy}
					sUSDNeededToBurn={sUSDNeededToBurn}
				/>
			</SettingsModal>
		);
	}, [
		burnType,
		txModalOpen,
		amountToBurn,
		debtBalance,
		issuableSynths,
		onBurnChange,
		onBurnTypeChange,
		percentageTargetCRatio,
		sUSDBalance,
		debtBalanceWithBuffer,
		missingSUSDWithBuffer,
		needToBuy,
		quoteAmount,
		error,
		txn,
		swapTxn,
		setGasPrice,
		setTxModalOpen,
	]);
	const router = useRouter();
	const defaultTab = (router.query.action && router.query.action[0]) || StakingPanelType.MINT;
	return <TabRowContainer>
			<Col>
			{returnPanel}
			</Col>
			<Col>
				<InfoBox currentTab={defaultTab} />
			</Col>
		</TabRowContainer>;
};
type SettingsModalProps = {
	onDismiss: () => void;
};

const SettingsModal: FC<SettingsModalProps> = ({ onDismiss,children }) => {
	const { t } = useTranslation();
	return (
		<StyledMenuModal onDismiss={onDismiss} isOpen={true} title={t('modals.settings.title')}>
			{children}
		</StyledMenuModal>
	);
};
const StyledMenuModal = styled(MenuModal)`
	z-index:49;
	[data-reach-dialog-content] {
		width: 44rem;
	}
`;
const Col = styled(FlexDivCol)``;
export default BurnTab;
