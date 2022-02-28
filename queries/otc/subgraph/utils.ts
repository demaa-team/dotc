// @ts-nocheck
import {Order,Deal} from "./types";
import { BigNumber } from 'ethers';
import Wei, { wei } from '@synthetixio/wei';

export const OTC_GRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/demaa-team/otc';

export const ipfsRepo = "http://221.237.167.6:8081/ipfs/";
export const defaultAvatar:string = "http://m.imeitou.com/uploads/allimg/2016062920/ke4rrvvmx5g.jpg";
export const ipfsEndPoint = 'http://221.237.167.6:5001';

export const ONE_SECOND = 1000;
export const ONE_MIN = 60 * ONE_SECOND;
export const ONE_HOUR = 60 * ONE_MIN;
export const ONE_DAY = 24 * ONE_HOUR;
export const DEAL_EXPIRED = ONE_DAY;
export const RESPONDE_EXPIRED = 3 * ONE_DAY;

export const formatTimeLeft = (t)=>{
    if(t<=0){
        return '00h:00m:00s';
    }
    const hs = Math.floor(t/ONE_HOUR);
    const ms = Math.floor((t%ONE_HOUR)/ONE_MIN);
    const ss = Math.floor((t%ONE_MIN)/ONE_SECOND);
    return `${hs}h:${ms}m:${ss}s`;
}

export const formatDateLeft = (t)=>{
    if(t<=0){
        return '00d:00h:00m:00s';
    }
    const ds = Math.floor(t/ONE_DAY);
    const hs = Math.floor((t%ONE_DAY)/ONE_HOUR);
    const ms = Math.floor((t%ONE_HOUR)/ONE_MIN);
    const ss = Math.floor((t%ONE_MIN)/ONE_SECOND);
    return `${ds}d:${hs}h:${ms}m:${ss}s`;
}

export const getAvatar = (avatar:string, defaultIcon?:any):any=>{
    if(avatar === ""){
        if(defaultIcon){
            return defaultIcon;
        }else {
            return defaultAvatar;
        }
    } else {
        return ipfsRepo +  avatar;
    }
}

export const GAS_LIMIT:BigNumber = BigNumber.from(8_000_000);
export const GAS_PRICE:Wei = wei(2e-9);

export const USDT_ADDRESS:string = "0x8ecAD5eD3C3D244d0CB2412005e2107963F4cF65";

export const formatOrder = (response: any): Partial<Order> => ({
    orderID: response.orderID,
    maker: response.maker,
    currencyCode: response.currencyCode,
    coinCode: response.coinCode,
    price: response.price,
    volume:response.volume,
    leftAmount: response.leftAmount,
    lockedAmount: response.lockedAmount,
});

export const formatDeal = (response: any): Partial<Deal> => ({
    dealID: response.dealID,
    orderID: response.orderID,
    maker: response.maker,
    taker: response.taker,
    currencyCode: response.currencyCode,
    coinCode: response.coinCode,
    price: response.price,
    amount: response.amount,
    fee: response.fee,
    collateralType: response.collateralType,
    collateral: response.collateral,
    lockedAmount: response.lockedAmount,
    dealState: response.dealState,
    cTime: (Number(response.cTime) * ONE_SECOND),
    uTime: (Number(response.uTime) * ONE_SECOND),
    adjudicationInfo: response.adjudicationInfo
});

Date.prototype.Format = function (fmt) { 
    var o = {
        "M+": this.getMonth() + 1, 
        "d+": this.getDate(), 
        "h+": this.getHours(), 
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


export const formatDate = function(d, fmt){
    var o = {
        "M+": d.getMonth() + 1, 
        "d+": d.getDate(), 
        "h+": d.getHours(), 
        "m+": d.getMinutes(),
        "s+": d.getSeconds(),
        "q+": Math.floor((d.getMonth() + 3) / 3),
        "S": d.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}