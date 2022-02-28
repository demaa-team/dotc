import { FC, useEffect, useState } from 'react';

export const ContactSelectOptions = [
    {
        value:'1',
        cn:'电话',
        en:'tel'
    },{
        value:'2',
        cn:'tg',
        en:'tg'
    },{
        value:'3',
        cn:'whatsapp',
        en:'whatsapp'
    },{
        value:'4',
        cn:'line',
        en:'line'
    },{
        value:'5',
        cn:'其他',
        en:'other'
    }
]

export const PaySelectOptions = [
    {
        value:'1',
        cn:'支付宝',
        en:'aliapay'
    },{
        value:'2',
        cn:'paypal',
        en:'paypal'
    },{
        value:'3',
        cn:'微信',
        en:'wechat'
    },{
        value:'4',
        cn:'银行卡',
        en:'card'
    },{
        value:'5',
        cn:'其他',
        en:'other'
    }
]

export const Config = ()=>{
    return <></>;
}

export default Config;