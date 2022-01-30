import React,{useMemo, useState} from 'react';
import styled from 'styled-components';
import Img from 'react-optimized-image';
import Button from 'components/Button';
import Upload from 'rc-upload';

const Evidence=()=>{
    const UploadProps={
		action: () => {
			return new Promise(resolve => {
			  setTimeout(() => {
				resolve('/upload.do');
			  }, 2000);
			});
		},
		onStart(file:any) {
			console.log('onStart', file, file.name);
		},
		onSuccess(ret:any) {
			console.log('onSuccess', ret);
		},
		onError(err:any) {
			console.log('onError', err);
		},
	}
    return (
        <Container>
            <ImgWrapper>
                <img className='img' src="http://m.imeitou.com/uploads/allimg/2016062920/ke4rrvvmx5g.jpg"/>
            </ImgWrapper>


            <Upload {...UploadProps}>
                <div style={{marginTop:'10px'}}>
                    <Button variant="primary" size='sm'>
                        <SubmitTxt width='160px'>提交证据</SubmitTxt>
                    </Button>
                </div>
            </Upload>
            {/* <SubmitBtn>
                提交证据
            </SubmitBtn> */}
        </Container>
    )
}
const Container=styled.div`

`
const ImgWrapper=styled.div`
    width: 180px;
    height: 120px;
    background: #6D83FF;
    display: flex;
    justify-content: center;
    align-items: center;
    .img{
        width: 66px;
        height: auto;
    }
`

const SubmitTxt = styled.span`
    display: inline-block;
    width:${(props) => props.width};
`

const SubmitBtn=styled.div`
    margin-top: 13px;
    width: 180px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    background: #6D83FF;
    border-radius: 5px;
`

export default Evidence;
