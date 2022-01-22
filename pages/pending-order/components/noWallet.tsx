import styled from 'styled-components';
const NoWallet = () => {
    return (
        <Container>
                <div>链接钱包</div>
        </Container>
    )
}

const Container=styled.div`
    text-align: center;
    >div{
        background: #f86c29;
        border-radius: 22px;
        display: inline-block;
        padding:10px 100px;
        margin-top: 40vh;
    }
`
export default NoWallet;
