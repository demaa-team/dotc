import { FC, ReactNode, useEffect } from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { mediaStyles } from 'styles/media';
const PRELOADED_FONTS = [
	'/fonts/Inter-Regular.woff2',
	'/fonts/Inter-SemiBold.woff2',
	'/fonts/Inter-Bold.woff2',
	'/fonts/GT-America-Mono-Bold.woff2',
	'/fonts/GT-America-Extended-Bold.woff2',
	'/fonts/GT-America-Condensed-Medium.woff2',
	'/fonts/GT-America-Condensed-Bold.woff2',
];
type LayoutProps = {
	children: ReactNode;
};
const Layout: FC<LayoutProps> = ({ children }) => {
	return (
		<Html  lang="en">
			{children}
		</Html>
	);
};
export default class MyDocument extends Document {
	static async getInitialProps(ctx: any) {
		const styledComponentsSheet = new ServerStyleSheet();
		const originalRenderPage = ctx.renderPage;
		
		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: (App: any) => (props: any) =>
						styledComponentsSheet.collectStyles(<App {...props} />),
				});

			const initialProps = await Document.getInitialProps(ctx);
			return {
				...initialProps,
				styles: (
					<>
						{initialProps.styles}
						{styledComponentsSheet.getStyleElement()}
					</>
				),
			};
		} finally {
			styledComponentsSheet.seal();
		}
	}

	render() {
		return (
			<Layout>
				<Head>
					<style type="text/css" dangerouslySetInnerHTML={{ __html: mediaStyles }} />
					{PRELOADED_FONTS.map((fontPath) => (
						<link
							key={fontPath}
							rel="preload"
							href={fontPath}
							as="font"
							type="font/woff2"
							crossOrigin="anonymous"
						/>
					))}
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Layout>
		);
	}
}
