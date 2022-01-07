import { Dispatch, FC, ReactNode, SetStateAction, useState, useEffect } from 'react';
import styled from 'styled-components';

import Select from 'components/Select';
import { DesktopOnlyView, MobileOrTabletView } from 'components/Media';

import { TabButton, TabList, TabPanel } from '../Tab';

export type TabInfo = {
	title: string;
	icon?: ReactNode;
	tabChildren: ReactNode;
	key: string;
	blue: boolean;
	disabled?: boolean;
};

type StructuredTabProps = {
	tabData: TabInfo[];
	boxHeight?: number;
	boxPadding: number;
	setPanelType?: Dispatch<SetStateAction<any>>;
	tabHeight?: number;
	inverseTabColor?: boolean;
	currentPanel?: string;
	singleTab?: boolean;
};

const StructuredTab: FC<StructuredTabProps> = ({
	tabData,
	boxHeight,
	boxPadding,
	setPanelType,
	tabHeight,
	inverseTabColor,
	currentPanel,
	singleTab,
}) => {
	const [activeTab, setActiveTab] = useState<string>(currentPanel ? currentPanel : tabData[0].key);

	useEffect(() => {
		if (currentPanel) {
			setActiveTab(currentPanel);
		}
	}, [currentPanel]);

	const desktop = () => (
		<Container>
			<TabList noOfTabs={tabData.length} isFill={false}>
				{tabData.map(({ title, icon, key, blue, disabled = false }, index) => (
					<TabButton
						isSingle={singleTab}
						tabHeight={tabHeight}
						inverseTabColor={inverseTabColor}
						blue={blue}
						key={`${key}-${index}-button`}
						name={title}
						active={activeTab === key}
						isDisabled={disabled}
						onClick={() => {
							setActiveTab(key);
							if (setPanelType != null) {
								setPanelType(key);
							}
						}}
					>
						{icon != null && icon}
						<TitleContainer>{title}</TitleContainer>
					</TabButton>
				))}
			</TabList>
		</Container>
	);

	const mobile = () => (
		<Select
			inputId={'tabs'}
			formatOptionLabel={(option) => option.title}
			options={tabData}
			value={tabData.find(({ key }) => key === activeTab)}
			onChange={(option: any) => {
				if (option) {
					setActiveTab(option.key);
					if (setPanelType != null) {
						setPanelType(option.key);
					}
				}
			}}
			variant="outline"
		/>
	);

	return (
		<div>
			<DesktopOnlyView>{desktop()}</DesktopOnlyView>
			<MobileOrTabletView>{tabData.length <= 2 ? desktop() : mobile()}</MobileOrTabletView>
			{tabData.map(({ title, tabChildren, key }, index) => (
				<TabPanel
					padding={boxPadding}
					height={boxHeight}
					key={`${key}-${index}-panel`}
					name={title}
					active={activeTab === key}
				>
					{tabChildren}
				</TabPanel>
			))}
		</div>
	);
};
const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`
const TitleContainer = styled.p`
	margin-left: 0.4rem;
	font-size: 1.2rem;
	font-family: Microsoft YaHei;
	text-transform: uppercase;
`;

export default StructuredTab;
