import { FC, useState } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';

import { isWalletConnectedState } from 'store/wallet';
import StatBox from 'components/StatBox';
import DebtValueModal from 'sections/shared/modals/DebtValueModal';
import { Size } from 'components/StatBox/StatBox';

export const DebtValueBox: FC<{
	isBorder?:boolean;
	title: any;
	value: any;
	isGreen?: boolean;
	isPink?: boolean;
	size?: Size;
}> = ({ isBorder,title, value, isGreen, isPink, size }) => {
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const isWalletConnected = useRecoilValue(isWalletConnectedState);

	const onOpen = () => isWalletConnected; //  && setIsOpened(true);
	const onDismiss = () => setIsOpened(false);

	return (
		<>
			<DebtValue
				isBorder={isBorder}
				onClick={onOpen}
				isLarge={size === 'lg'}
				{...{ title, value, isGreen, isPink, size }}
			></DebtValue>
			<DebtValueModal {...{ value, isOpened, onDismiss }} />
		</>
	);
};

const DebtValue = styled(StatBox)<{ isGreen?: boolean; isPink?: boolean; isLarge: boolean }>`
	cursor: pointer;
	
	.title {
		color: #fff};
	}
	
	.value {
		color: ${(props) => (!props.isLarge ? 'unset' : props.theme.colors.white)};
	}
`;

export default DebtValueBox;
