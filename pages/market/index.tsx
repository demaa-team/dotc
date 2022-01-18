import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import WeiXinImg from 'public/images/market/weixin.png';
import PayPalImg from 'public/images/market/paypal.png';
import Img, { Svg } from 'react-optimized-image';

const Market = () => {
	const router = useRouter();
	const { t } = useTranslation();
	const itemCardContentData=[
		{
			label:'剩余',
			val:1000,
			unit:'USDT'
		},
		{
			label:'单价',
			val:6.33,
			unit:'元'
		},
		{
			label:'成交',
			val:250000,
			unit:'USDT'
		},
		{
			label:'用时',
			val:10,
			unit:'分钟'
		}
	]

	const handleJumpDetail=()=>{
		router.push('/market/detail/123');
	}
	return (
		<>
			<Head>
				<title>{t('market.page-title')}</title>
			</Head>
			<Container>
				{
					[1,2,3,4,5,6,7,8,9,10].map(v=>
						<ItemCard key={v}>
							<HeaderBox>
								<div className="avatarBox">
									<img className='avatar' src="https://pica.zhimg.com/80/v2-308d6eecb6bf60f53be0d6eeade0c734_720w.jpg?source=1940ef5c" alt="" />
								</div>
								<div className="name">大掌柜</div>
								<div className="desc">安全、放贷速度快</div>
							</HeaderBox>
							<SplitLine/>
							<ItemContent>
								{
									itemCardContentData.map((v,i)=>
										<div className="row" key={i}>
											<div className="label">{v.label}</div>
											<div className="val">{v.val}</div>
											<div className="unit">{v.unit}</div>
										</div>
									)
								}
								<div className="row">
									<div className="label">支付</div>
									<div className="payType">
										<Img className='payImg' src={WeiXinImg}/>
										<Img className='payImg' src={PayPalImg}/>
									</div>
								</div>
								<JumpBtn className='jumpBtn' onClick={handleJumpDetail}/>
							</ItemContent>
						</ItemCard>
					)
				}
				
			</Container>
		</>
	);
};

const Container = styled.div`
	padding: 80px 10px;
	/* display: flex;
    flex-wrap: wrap;
	justify-content: center; */
	display: grid;
	justify-content: center;
	grid-template-columns: repeat(auto-fill,440px);
	grid-gap: 35px 35px;
`;

const ItemCard= styled.div`
	/* width: 440px;
	height: 680px; */
	border: 2px solid #1F54A5;
	/* border-image: linear-gradient(0deg, #5AD3C5, #1CB6CC) 10 10; */
	/* background: linear-gradient(0deg, rgba(90, 211, 197,0.26) 0%, rgb(28, 182, 204,0.26) 99%); */
	background: #203298;
	border-radius: 10px;
	padding: 30px 20px;
	/* margin: 35px; */
	box-shadow: 0px 0px 20px rgb(0 0 0 / 20%);
	&:hover{
		border-color: #1EB7CC;
		background: #2839C1;
		box-shadow: 0 0 28px -12px #000;
		.jumpBtn{
			background-image: url('/images/market/arrow-right-hover.png');
		}
	}
`;

const HeaderBox=styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	.avatarBox{
		width: 122px;
		height: 122px;
		border: 2px dashed #49C8BA;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.avatar{
		width: 104px;
		height: 104px;
		border-radius: 50%;
	}
	.name{
		font-size: 18px;
		text-align: center;
		margin-top: 20px;
	}
	.desc{
		text-align: center;
		margin-top: 22px;
	}
`;

const SplitLine =styled.div`
	width: 100%;
	height: 2px;
	background: linear-gradient(251deg, #5AD2C5 0%, #20B9CD 100%);
	border-radius: 1px;
	margin-top: 17px;
`
const ItemContent=styled.div`
	margin-top: 17px;
	.row{
		display: flex;
		margin-bottom: 23px;
		.label{
			&::before{
				content:'';
				display: inline-block;
				width: 10px;
				height: 10px;
				background: #F86C29;
				border-radius: 50%;
				margin-right: 10px;
			}
			font-size: 20px;
		}
		.val{
			flex: 2;
			width: 169px;
			height: 35px;
			line-height: 35px;
			text-align:center;
			background: rgba(7, 20, 92, 0.54);
			margin-left: 30px;
		}
		.unit{
			flex: 1;
			height: 35px;
			line-height: 35px;
			text-align: center;
		}
		.payType{
			height: 35px;
			display: flex;
			align-items: center;
			margin-left: 30px;
			.payImg{
				width: auto;
				height: 27px;
				margin-right: 20px;
			}
		}
	}
`

const JumpBtn=styled.div`
	width: 66px;
	height: 66px;
	margin: 48px auto 0;
	background-image: url('/images/market/arrow-right.png');
	background-size: 100%;
	cursor: pointer;
`

export default Market;
