import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

const Market = () => {
	const { t } = useTranslation();

	return (
		<>
			<Head>
				<title>{t('staking.page-title')}</title>
			</Head>
			<Container>market content</Container>
		</>
	);
};

const Container = styled.div`
	// padding-top: 90px;
	padding: 140px 84px;
`;


export default Market;
