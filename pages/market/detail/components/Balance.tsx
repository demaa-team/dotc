import React from 'react';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';

import { walletAddressState } from 'store/wallet';
import Connector from 'containers/Connector';
import { wei } from '@synthetixio/wei';
import {abi as erc20} from 'contracts/erc20';

const USDT_ADDRESS:string = "0x8ecAD5eD3C3D244d0CB2412005e2107963F4cF65";

type BalanceProps = {
	bLabel?: string;
	asset: string;
	onSetMaxAmount?: (amount: string) => void;
	showBalance?: boolean;
};

const Balance: React.FC<BalanceProps> = ({bLabel:label, asset, onSetMaxAmount, showBalance=true }) => {
	label = label??"balance.input-label";
	const { signer } = Connector.useContainer();
	return !signer ? null : asset === 'ETH' ? (
		<ETH {...{ onSetMaxAmount }} />
	) : (
		<ERC20 {...{showBalance, label, asset, onSetMaxAmount }} />
	);
};

export default Balance;

type ETHProps = {
	label?:string;
	onSetMaxAmount?: (amount: string) => void;
	showBalance?: boolean;
};

const ETH: React.FC<ETHProps> = ({label, onSetMaxAmount, showBalance=true }) => {
	const { t } = useTranslation();
	const { provider, signer } = Connector.useContainer();
	const [balance, setBalance] = React.useState(ethers.BigNumber.from('0'));

	const handleSetMaxAmount = () => {
		if (onSetMaxAmount && balance) {
			onSetMaxAmount(ethers.utils.formatUnits(balance, 18));
		}
	};

	React.useEffect(() => {
		if (!signer) return;

		let isMounted = true;
		const unsubs: Array<any> = [() => (isMounted = false)];

		const onSetBalance = async () => {
			const balance = await signer.getBalance();
			if (isMounted) setBalance(balance);
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

	return (
		balance && (
			<Container>
				{t(label)} {showBalance && wei(balance).toString(2)}{showBalance && ' '}
				{!onSetMaxAmount ? null : <MaxButton onClick={handleSetMaxAmount} />}
			</Container>
		)
	);
};

type ERC20Props = {
	label?:string;
	asset: string;
	onSetMaxAmount?: (amount: string) => void;
	showBalance?: boolean;
};

const ERC20: React.FC<ERC20Props> = ({label, asset, onSetMaxAmount, showBalance=true }) => {
	const { t } = useTranslation();
	const {signer, synthetixjs } = Connector.useContainer();
	const address = useRecoilValue(walletAddressState);
	const [balance, setBalance] = React.useState<ethers.BigNumber>(ethers.BigNumber.from('0'));
	const [decimals, setDecimals] = React.useState<number>(0);
	const handleSetMaxAmount = () => {
		if (onSetMaxAmount && balance && decimals) {
			onSetMaxAmount(ethers.utils.formatUnits(balance, decimals));
		}
	};

	const contract = React.useMemo(() => {
		const {
			contracts: {ProxyERC20: DEM},
		} = synthetixjs!;
		const USDT = new ethers.Contract(USDT_ADDRESS, erc20, signer);
		const tokens: Record<string, typeof DEM> = {
			DEM,
			USDT,
		};
		return tokens[asset];
	}, [asset, synthetixjs]);

	React.useEffect(() => {
		if (!(contract && address)) return;

		let isMounted = true;
		const unsubs: Array<any> = [() => (isMounted = false)];

		const loadBalance = async () => {
			const [decimals, balance] = await Promise.all([
				contract.decimals(),
				contract.balanceOf(address),
			]);
			if (isMounted) {
				setDecimals(decimals);
				setBalance(balance);
			}
		};

		const subscribe = () => {
			const transferEvent = contract.filters.Transfer();
			const onBalanceChange = async (from: string, to: string) => {
				if (from === address || to === address) {
					if (isMounted) setBalance(await contract.balanceOf(address));
				}
			};

			contract.on(transferEvent, onBalanceChange);
			unsubs.push(() => contract.off(transferEvent, onBalanceChange));
		};

		loadBalance();
		subscribe();
		return () => {
			unsubs.forEach((unsub) => unsub());
		};
	}, [contract, address]);

	return !(decimals && balance) ? null : (
		<Container>
			{t(label)} {showBalance && wei(balance).toString(2)}{showBalance && ' '}
			{!onSetMaxAmount ? null : <MaxButton onClick={handleSetMaxAmount} />}
		</Container>
	);
};

type MaxButtonProps = {
	onClick: () => void;
};

const MaxButton: React.FC<MaxButtonProps> = ({ onClick }) => {
	const { t } = useTranslation();
	return <StyleMaxButton {...{ onClick }}>{t('balance.max')}</StyleMaxButton>;
};

const Container = styled.div`
	display: flex;
	font-size: 12px;
	color: ${(props) => props.theme.colors.white};
`;

const StyleMaxButton = styled.div`
	color: ${(props) => props.theme.colors.blue};
	cursor: pointer;
	margin-left: 5px;
	text-transform: uppercase;
`;
