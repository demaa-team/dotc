import { FC } from 'react';
import LoaderIcon from 'assets/svg/app/loader.svg';
import { Svg } from 'react-optimized-image';

import { AbsoluteCenteredDiv } from 'styles/common';

type LoaderProps = {
	inline?: boolean;
};

export const Loader: FC<LoaderProps> = ({ inline }) => {
	const loader = <Svg src={LoaderIcon} />;

	return inline ? loader : <AbsoluteCenteredDiv>{loader}</AbsoluteCenteredDiv>;
};

Loader.defaultProps = {
	inline: false,
};

export default Loader;
