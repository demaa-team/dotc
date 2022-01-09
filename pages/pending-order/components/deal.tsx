import styled from 'styled-components';
const Deal = () => {
    return (
        <Container>
            <ContainerTop>
                <div>
                    <span>ID</span>
                    <span>&nbsp;&nbsp;123</span>
                </div>
                <div>编辑 删除</div>
            </ContainerTop>
            <ContainerFixed>
                <div className='containerFixedLeft'>
                    <div>
                        化名 <input className='longInput'></input>
                    </div>
                    <div>
                        广告 <input className='longInput'></input>
                    </div>
                    <div>
                        价格 <select name="" id="">
                        <option value="">CNY</option></select> <input ></input>
                    </div>
                    <div>
                        商品 <select name="" id="">
                        <option value="">USDT</option></select> <input ></input>
                    </div>
                </div>
                <div className='containerFixedRight'>
                    <div className='headPortrait'>
                        <div>头像</div>
                        <button>上传头像</button>
                    </div>
                    <button className='confirmTransfer'>批准系统转账</button>
                </div>
            </ContainerFixed>
            <ContainerDynamic>
                <div className='dynamicWay'>联系方式</div>
                <div className='dynamicForm'>
                    <div className='dynamicWayItem'>
                        <select name="" id="">
                            <option value="">电话号码</option>
                        </select>
                        <input ></input>
                        <button>-</button>
                    </div>
                    <div className='dynamicWayItem'>
                        <select name="" id="">
                            <option value="">微信</option>
                        </select>
                        <input ></input>
                        <button>-</button>
                    </div>
                    <div>
                        <button className='dynamicWayItemAdd'>+</button>
                    </div>
                </div>
            </ContainerDynamic>
            <ContainerDynamic>
                <div className='dynamicWay'>支付方式</div>
                <div className='dynamicForm'>
                    <div className='dynamicWayItem'>
                        <select name="" id="">
                            <option value="">银行卡</option>
                        </select>
                        <input ></input>
                        <button>-</button>
                    </div>
                    <div className='dynamicWayItem'>
                        <select name="" id="">
                            <option value="">支付宝</option>
                        </select>
                        <input ></input>
                        <button>-</button>
                    </div>
                    <div>
                        <button className='dynamicWayItemAdd'>+</button>
                    </div>
                </div>
            </ContainerDynamic>
            <Footer>
                <button>开单</button>
            </Footer>
        </Container>
    )
}

const Container=styled.div`
   padding: 0 20px;
   button{
       color: #FFFFFF;
       background: #02a7f0;
       border: 1px solid transparent;
       user-select: none;
        touch-action: manipulation;
        height: 32px;
        padding: 4px 15px;
        font-size: 14px;
        border-radius: 2px;
        cursor: pointer;
        line-height: 1.5715;
        position: relative;
        display: inline-block;
        font-weight: 400;
        white-space: nowrap;
        text-align: center;
   }
   input{
       background: #203298;
       border: 1px solid #71727b;
       border-radius: 2px;
       color:#FFFFFF;
       width: 280px;
       height: 32px;
   }
   select{
       background: #203298;
       border: 1px solid #71727b;
       margin-right: 10px;
       border-radius: 2px;
       color:#FFFFFF;
       width: 80px;
       height: 32px;
   }
`

const ContainerTop=styled.div`
   display: flex;
   justify-content: space-between;
`

const ContainerFixed=styled.div`
   display: flex;
   justify-content: space-between;
   margin-top: 20px;
   >div>div{
       margin-top: 10px;
   }
   select{
       width: 20%;
       margin-right: 1%;
   }
   input{
       width:60%;
   }
   .longInput{
       width: 82%;
   }
   .containerFixedLeft{
       width: 50%;
   }
   .containerFixedRight{
       width: 50%;
       .headPortrait{
           text-align: right;
           div{
               height: 80px;
           }
       }
       .confirmTransfer{
           width: 100%;
           margin-top: 10px;
       }
   }
`
const ContainerDynamic=styled.div`
   display: flex;
   margin-top: 20px;
   .dynamicWay{
       width: 48%;
       margin-right: 2%;
       border: 1px solid #FFFFFF;
       text-align: center;
       line-height: 32px;
       height: 32px;
   }
   .dynamicForm{
        width: 50%;
    }
   .dynamicWayItem{
        margin-bottom: 6px;
        select{
            width: 20%;
            margin-right: 2%;
        }
        input{
            width: 60%;
        }
        button{
            width: 5%;
            margin-left: 1%;
        }
    }
    .dynamicWayItemAdd{
        width: 96%;
    }
`

const Footer=styled.div`
   display: flex;
   justify-content: space-between;
   margin-top: 20px;
   width: 100%;
   button{
       width: 100%;
   }
`
export default Deal;
