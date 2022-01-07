import styled, { css } from 'styled-components';
import { FC, useRef, useState ,useEffect} from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { Svg } from 'react-optimized-image';
import { useRecoilValue } from 'recoil';
import { getOptimismNetwork } from '@synthetixio/optimism-networks';

import UIContainer from 'containers/UI';
import { linkCSS } from 'styles/common';
import media from 'styles/media';
import CaretUpIcon from 'assets/svg/app/caret-up-small.svg';
import ROUTES from 'constants/routes';
import SettingsModal from 'sections/shared/modals/SettingsModal';
import { isWalletConnectedState, networkState } from 'store/wallet';
import { isL2State, isMainnetState, delegateWalletState } from 'store/wallet';
import { MENU_LINKS, MENU_LINKS_L2, MENU_LINKS_DELEGATE } from '../constants';
import { SubMenuLink } from '../constants';
import useWindowSize from 'utils/useWindowSize'
const getKeyValue = <T extends object, U extends keyof T>(obj: T) => (key: U) => obj[key];

export type SideNavProps = {
	isDesktop?: boolean;
};

const SideNav: FC<SideNavProps> = ({ isDesktop }) => {
	const { t } = useTranslation();
	const router = useRouter();
	const menuLinkItemRefs = useRef({});
	const isWalletConnected = useRecoilValue(isWalletConnectedState);
	const isL2 = useRecoilValue(isL2State);
	const delegateWallet = useRecoilValue(delegateWalletState);
	const network = useRecoilValue(networkState);
	const {
		closeMobileSideNav,
		setSubMenuConfiguration,
		clearSubMenuConfiguration,
		setNetworkError,
	} = UIContainer.useContainer();
	const isMainnet = useRecoilValue(isMainnetState);
	const [settingsModalOpened, setSettingsModalOpened] = useState<boolean>(false);

	const menuLinks = delegateWallet ? MENU_LINKS_DELEGATE : isL2 ? MENU_LINKS_L2 : MENU_LINKS;

	return (
		<MenuLinks>
			{menuLinks.map(({ i18nLabel, link }, i) => {
				// const onSetSubMenuConfiguration = () => {
				// 	setSubMenuConfiguration({
				// 		// Debt data only exists on mainnet for now, need to hide otherwise
				// 		routes: (isMainnet
				// 			? subMenu
				// 			: subMenu!.filter(({ subLink }) => subLink !== ROUTES.Home)) as any,
				// 		topPosition: (getKeyValue(menuLinkItemRefs.current) as any)(i).getBoundingClientRect()
				// 			.y as number,
				// 	});
				// };

				return (
					<MenuLinkItem
						{...(isDesktop
							? {
									onMouseEnter: () => {

									},
									onClick: () => {
										router.push(link);
										clearSubMenuConfiguration();
									},
							  }
							: {
									onClick: () => {
										router.push(link);
										closeMobileSideNav();
										clearSubMenuConfiguration();
									},
							  })}
						key={link}
						data-testid={`sidenav-${link}`}
						isActive={
							router.asPath === link || (link !== ROUTES.Home && router.asPath.includes(link))
						}
					>
						<MenuLinkSubMenu name={t(i18nLabel)} link={link}>
						</MenuLinkSubMenu>
						
					</MenuLinkItem>
				);
			})}

		</MenuLinks>
	);
};

export type SideMenuProps = {
	name?: string;
	link?:string;
};
export type childMenu = {
	i18nLabel?: string;
	subLink?:string;
};
const MenuLinkSubMenu: FC<SideMenuProps> = ({name,link=''})=>{
	const { t } = useTranslation();
	const router = useRouter();
	const { width, height } = useWindowSize();
	const isActive = router.asPath === link || (link !== ROUTES.Home && router.asPath.indexOf(link)>-1)
	return (
		<MenuLink isActive={isActive}>
			<div 
				className="link"
				// onClick={() => {
				// 	setSettingsMenuOpened(!settingsMenuOpened)
				// }}
			>
				{name}
			</div>
		</MenuLink>
	);
}

const MenuLink = styled.div<{ isActive?: boolean;}>`
	&:after {
		width: 2px;
		height: 2.4rem;
		content: '';
		position: absolute;
		top: 0;
		/* the line needs to outside (so around -3px), however due to overflow issues, it needs to be inside for now */
		left: 0;
		background: ${(props) => props.theme.colors.orange};
		display: none;
		${(props) =>
			props.isActive &&
			css`
				display: block;
			`}
	}
		${(props) =>
			props.isActive &&
			css`
				background:#5563B1
			`}
`;
// padding-left: 24px;
const MenuLinks = styled.div`
	position: relative;
`;

const MenuLinkItem = styled.div<{ isActive?: boolean;isL2Switcher?: boolean }>`
	line-height: 1;
	// padding-bottom: 10px;
	position: relative;
	
	svg {
		margin-left: 6px;
	}

	.link {
		display: flex;
		justify-content: center;
		align-items: center;
		// padding-left: 24px;
		/* padding:0.75rem 0 0.75rem 3.75rem; */
		height: 70px;
		/* line-height: 70px; */
		/* text-align:center; */
		border-bottom:1px solid #6F77C1;
		${linkCSS};
		font-family: ${(props) => props.theme.fonts.condensedMedium};
		text-transform: uppercase;
		// opacity: ${(props) => (props.isL2Switcher ? 1 : 0.4)};
		font-size: 18px;
		cursor: pointer;
		background:${(props) => (props.isActive ? '#5563B1' : 'transparent')};
		color: ${(props) => props.theme.colors.white};
		&:hover {
			opacity: ${(props) => (props.isL2Switcher ? 0.8 : 1)};
			color: ${(props) => (props.isL2Switcher ? props.theme.colors.pink : props.theme.colors.blue)};
			// svg {
			// 	color: ${(props) => props.theme.colors.blue};
			// }
		}
		svg {
				color: ${(props) => (props.isActive ? "#F86C29" : props.theme.colors.white)};
			}
		${(props) =>
			props.isActive &&
			css`
				opacity: unset;
			`}

		${media.lessThan('md')`
			font-family: ${(props) => props.theme.fonts.extended};
			font-size: 20px;
			opacity: 1;
		`}
	}
	
	&:after {
		width: 2px;
		height: 70px;
		content: '';
		position: absolute;
		top: 0;
		/* the line needs to outside (so around -3px), however due to overflow issues, it needs to be inside for now */
		left: 0;
		background: ${(props) => props.theme.colors.orange};
		display: none;
		${(props) =>
			props.isActive &&
			css`
				display: block;
			`}
	}
`;

export default SideNav;
