import styled from 'styled-components';
import { FC, useMemo } from 'react';
import Link from 'next/link';
import { Svg } from 'react-optimized-image';
import { useRecoilValue } from 'recoil';

import StakingL2Logo from 'assets/svg/app/staking-l2-logo.svg';

import ROUTES from 'constants/routes';
import { DESKTOP_SIDE_NAV_WIDTH, zIndex } from 'constants/ui';
import UIContainer from 'containers/UI';

import SideNav from './SideNav';
import useWindowSize from 'utils/useWindowSize'
const DesktopSideNav: FC = () => {
	const { clearSubMenuConfiguration } = UIContainer.useContainer();

	const { width, height } = useWindowSize();
	return (
		<Container onMouseLeave={clearSubMenuConfiguration} data-testid="sidenav"> 
			<StakingLogoWrap>
				<Link href={ROUTES.Home}>
					{/* style={{transform:`scale(${width/1920},${width/1920})`}} */}
					<div>
						<Svg src={StakingL2Logo} />
					</div>
				</Link>
			</StakingLogoWrap>

			<SideNav isDesktop={true} />
		</Container>
	);
};

export default DesktopSideNav;

const Container = styled.div`
	z-index: 49;
	height: 100%;
	position: fixed;
	top: 0;
	width: ${DESKTOP_SIDE_NAV_WIDTH}px;
	left: 0;
	background: #203298;
	border-radius: 0px 1.9rem 1.9rem 0px;
	border-right: 1px solid ${(props) => props.theme.colors.grayBlue};
	display: grid;
	grid-template-rows: auto 1fr auto auto;
	overflow-y: hidden;
	overflow-x: visible;
	transition: left 0.3s ease-out;
`;

const StakingLogoWrap = styled.div`
	padding: 1rem 0 1rem 1.2rem;
	cursor: pointer;
`;

const LineSeparator = styled.div`
	height: 1px;
	background: ${(props) => props.theme.colors.grayBlue};
	margin-bottom: 25px;
`;
