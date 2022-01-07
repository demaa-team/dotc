import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { appReadyState } from 'store/app';
import { FlexDivCol } from 'styles/common';
import media from 'styles/media';

import Form from 'sections/delegate/Form';
import Table from 'sections/delegate/Table';

const Index: FC = () => {
	const isAppReady = useRecoilValue(appReadyState);

	return !isAppReady ? null : (
		<Container>
			<Col>
				<Form />
			</Col>
			<Col style={{marginTop:'1rem'}}>
				<Table />
			</Col>
		</Container>
	);
};

const Container = styled.div`
	background:#203298;
	padding:1rem;
	border-radius:1rem;
	// display: grid;
	// grid-template-columns: 1fr 0fr 1fr;
	// grid-gap: 1rem;

	${media.lessThan('mdUp')`
		display: flex;
		flex-direction: column;
	`}
`;

const Col = styled(FlexDivCol)``;

export default Index;
