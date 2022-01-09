import { FC, useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Deal from './components/deal';
import NoWallet from './components/noWallet';

import UIContainer from 'containers/UI';

const PendingOrder: FC = () => {
	const { t } = useTranslation();
	const { setTitle } = UIContainer.useContainer();

	// header title
	useEffect(() => {
		setTitle('wallet', 'escrow');
	}, [setTitle]);

	return (
		<>
			<Head>
				<title>{t('escrow.page-title')}</title>
			</Head>
			{/* <NoWallet /> */}
			<Deal />
		</>
	);
};

export default PendingOrder;
