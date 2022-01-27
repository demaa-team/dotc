import { FC, useMemo } from 'react';
import styled from 'styled-components';
import { Svg } from 'react-optimized-image';
import { useTranslation } from 'react-i18next';

import { MOBILE_BODY_PADDING } from 'constants/ui';
import UIContainer from 'containers/UI';
import { FlexDivCol, FlexDivCentered } from 'styles/common';
import media from 'styles/media';
import { DesktopOnlyView, MobileOrTabletView } from 'components/Media';
import BannerManager from 'components/BannerManager';
import TitleIcon from 'assets/svg/app/menu-hamburger-white.svg';
import UserMenu from './UserMenu';
import { useRouter } from 'next/router';

const Header: FC = () => {
	const router = useRouter();
	const { t } = useTranslation();
	const { showMobileSideNav, headerTitle, headerSubtitle } = UIContainer.useContainer();
	const getRouterPath = useMemo(
		() => {
			console.log(router)
			if(router.asPath){
				const arr=router.asPath.split('/');
				if(arr.length>=4){
					return arr[1]+'/'+arr[arr.length-1];
				}else{
					return false;
				}
			}else{
				return false;
			}
		},
		[router.asPath]
	);
	return (
		<HeaderWrapper>
			<DesktopOnlyView>
				<BannerManager />
			</DesktopOnlyView>
			<Container>
				<FlexDivCentered>
					{/* <MobileOrTabletView>
						<Title onClick={showMobileSideNav}>
							<Svg src={TitleIcon} />
							{!headerTitle ? null : (
								<TitleText hasSubTitle={!!headerSubtitle}>{t(`header.${headerTitle}`)}</TitleText>
							)}
							{!headerSubtitle ? null : (
								<>
									<TitleSep>|</TitleSep>
									<SubtitleText>{t(`header.${headerTitle}/${headerSubtitle}`)}</SubtitleText>
								</>
							)}
						</Title>
					</MobileOrTabletView> */}
					{
						getRouterPath&&
						<PageRouterShow>{getRouterPath.replace('/','>')}</PageRouterShow>
					}
					<Sep />
					<UserMenu />
				</FlexDivCentered>
			</Container>
		</HeaderWrapper>
	);
};

const HeaderWrapper = styled.div`
	position: relative;
`;

const Container = styled(FlexDivCol)`
	padding: 15px 10px 11px 0;
	border:1px solid #000D56;

	${media.lessThan('mdUp')`
		padding: 10px ${MOBILE_BODY_PADDING}px 0;
	`}
`;

const Title = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	font-family: ${(props) => props.theme.fonts.condensedMedium};
	font-size: 12px;
	text-transform: uppercase;
	color: ${(props) => props.theme.colors.gray};

	svg {
		margin-right: 10px;
	}
`;

const TitleText = styled.div<{ hasSubTitle: boolean }>`
	color: ${(props) => (props.hasSubTitle ? props.theme.colors.gray : props.theme.colors.blue)};
`;

const TitleSep = styled.div`
	padding: 0 5px;
`;

const SubtitleText = styled.div`
	color: ${(props) => props.theme.colors.blue};
`;

const Sep = styled.div`
	flex: 1;
`;

const PageRouterShow=styled.div`
	padding-left: 316px;
`

export default Header;
