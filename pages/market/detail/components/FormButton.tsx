import React from 'react';
import styled from 'styled-components';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'components/Button';
import { NoTextTransform } from 'styles/common';

type FormButtonProps = {
	collateralAsset: string;
	sellAsset: string;
	isWalletConnected: boolean;
	isApproved: boolean;
	hasInsufficientCollateral: boolean;
	onClick: () => Promise<void>;
	hasInput: boolean;
};

const FormButton: React.FC<FormButtonProps> = ({
	collateralAsset,
	sellAsset,
	isWalletConnected,
	isApproved,
	hasInsufficientCollateral,
	onClick,
	hasInput,
}) => {
	const { t } = useTranslation();

	return (
		<StyledCTA
			variant="primary"
			size="lg"
			disabled={
				hasInsufficientCollateral || !hasInput
			}
			data-testid="loans-form-button"
			{...{ onClick }}
		>
			{!isWalletConnected ? (
				t('common.wallet.connect-wallet')
			) : hasInsufficientCollateral ? (
				<Trans
					i18nKey="market.detail.insufficient-label"
					values={{}}
					components={[<NoTextTransform />]}
				/>
			) : !isApproved ? (
				<Trans
					i18nKey="market.detail.approve-label"
					values={{
						collateralAsset,
					}}
					components={[<NoTextTransform />]}
				/>
			) : (
				<Trans
					i18nKey="market.detail.buy-label"
					values={{
						sellAsset,
					}}
					components={[<NoTextTransform />]}
				/>
			)}
		</StyledCTA>
	);
};

export default FormButton;

const StyledCTA = styled(Button)`
	font-size: 1rem;
	font-family: ${(props) => props.theme.fonts.condensedMedium};
	box-shadow: 0px 0px 10px rgba(0, 209, 255, 0.9);
	border-radius: 4px;
	width: 100%;
	text-transform: uppercase;
`;
