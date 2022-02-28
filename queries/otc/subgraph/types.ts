export type adjudicationInfo = {
    dealID: number;
    plaintiff: string;
    defendant: string;
    adjudicator: string;
    winner: string;
    evidence: string;
    explanation: string;
    verdict: string;
    progress: string;
    cTime: number;
    uTime: number
  };

export type Deal = {
    dealID: number;
    orderID: number;
    maker: string;
    taker: string;
    currencyCode: string;
    coinCode: string;
    price: string;
    amount: number;
    fee: number;
    collateralType: string | null;
    collateral: number;
    lockedAmount: number;
    dealState: string;
    cTime: number;
    uTime: number;
    adjudicationInfo:adjudicationInfo|null;
};

export type Order = {
    orderID: string;
    maker: string;
    currencyCode: string;
    coinCode: string;
    price: number;
    volume:number;
    leftAmount: number;
    lockedAmount: number;
    closed: boolean;
};

export function newOrder():Order {
    return {
        orderID:'',
        maker:'',
        currencyCode: '',
        coinCode: '',
        price: 0,
        volume: 0,
        leftAmount: 0,
        lockedAmount: 0,
        closed: false  
    }
}

export type Profile = {
    account: string;
    ipsHash: string;
    destroyed: boolean;
};


export enum ContactType {Phone,Wechat,Line,Whatsapp,TG};
export type ContactIno = {
        type: string;
        address: string;
};

export function newContactIno():ContactIno {
   return {
        type: '',
        address: ''
        };
}

export enum PayType {Wechat,Alipay,Card};
export type PayInfo = {
        type: string;
        address: string;
};

export function newPayIno():PayInfo {
    return {
         type: '',
         address: ''
         };
 }
 
export type ProfileInfo = {
    ver:number;
    ipfsHash?: string;
    account?: string;
    avatar: string;
    alias: string;
    ad: string;
    auth: string;
    order: Order;
    contacts: ContactIno[];
    pays: PayInfo[];
    volume:number;
    disputeCount:number;
    violationCount:number;
};

export function newProfileInfo():ProfileInfo{
    return {
        ver:-1,
        ipfsHash: '',
        account: '',
        avatar: '',
        alias: '',
        ad: '',
        auth: '',
        order: newOrder(),
        contacts: ([] as ContactIno[]),
        pays: ([] as PayInfo[]),
        volume:0,
        disputeCount:0,
        violationCount:0
    };
}

export type ProfileMeta = {
    account: string;
    avatar: string;
    alias: string;
    ad: string;
    auth: string;
    contacts: ContactIno[];
    pays: PayInfo[];
};

export type Evidence = {
    ver: number;
    dealID: number;
    evidence:string[];
    explanation:string[];
    verdict:string;
};