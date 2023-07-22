import {
    getInterfaceInfoVOByIdUsingGET,
    payInterfaceByPOST,
} from '@/services/nero-api-backend/interfaceInfoController';
import { useParams } from '@@/exports';
import { PageContainer } from '@ant-design/pro-components';
import { Badge, Button, Card, Descriptions, Divider, Form, InputNumber, message } from 'antd';
import { history } from '@umijs/max';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

let payNum = 100;

const box = document.getElementById('back');
if (box != null) {
    box.style.left = '25px';
}
const onChange = (value: number) => {
    payNum = value;
    console.log(payNum);
};

const Index: React.FC = () => {
    const [invokeLoading, setInvokeLoading] = useState(false);
    const [data, setData] = useState<API.InterfaceInfoVO>();
    const params = useParams();

    const loadData = async () => {
        try {
            const interfaceInfoRes = await getInterfaceInfoVOByIdUsingGET({
                id: Number(params.id),
            });

            const interfaceInfoData = interfaceInfoRes.data;

            if (interfaceInfoData) {
                setData(interfaceInfoData);
            }
        } catch (error: any) {
            message.error('请求失败，' + error.message);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onFinish = async (values: any) => {
        console.log('values:', values);
        if (!params.id) {
            message.error('接口不存在');
            return;
        }
        setInvokeLoading(true);
        try {
            const res = await payInterfaceByPOST({
                interfaceInfoId: Number(params.id),
                ...values,
            });
            console.log('调用接口请求数据：', res);
            if (res.data) {
                message.success('接口充值成功');
                history.push('/my_interface');
            } else if (res.code === 50001) {
                message.error('该接口拥有数量上限');
            } else {
                message.error('接口充值失败');
            }
        } catch (error: any) {
            message.error('接口充值失败');
        }
        setInvokeLoading(false);
    };

    return (
        <PageContainer>
            <Card>
                {data ? (
                    <Descriptions title={data.name} column={4} layout={'vertical'}>
                        <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
                        <Descriptions.Item label="接口状态">
                            {data.status ? (
                                <Badge status="success" text={'开启'} />
                            ) : (
                                <Badge status="default" text={'关闭'} />
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="请求地址">
                            {data.host}
                            {data.url}
                        </Descriptions.Item>
                        <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
                        <Descriptions.Item label="接口价格">{data.price}￥/个</Descriptions.Item>
                        <Descriptions.Item label="请求参数示例">
                            {data.requestParams}
                        </Descriptions.Item>
                        <Descriptions.Item label="创建时间">
                            {moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')}
                        </Descriptions.Item>
                        <Descriptions.Item label="更新时间">
                            {moment(data.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    <>接口不存在</>
                )}
            </Card>
            {data ? (
                <>
                    <Divider />
                    <Card title={'接口充值'}>
                        <Form name="invoke" layout={'vertical'} onFinish={onFinish}>
                            <Form.Item label={'充值数量'} name={'payNum'} initialValue={100}>
                                <InputNumber
                                    id="id"
                                    size="large"
                                    min={1}
                                    max={100000}
                                    step={10}
                                    defaultValue={100}
                                />
                            </Form.Item>
                            <Form.Item wrapperCol={{ span: 16 }}>
                                <Button type="primary" htmlType="submit">
                                    充值
                                </Button>
                                <Button
                                    id="back"
                                    onClick={() => {
                                        history.push('/my_interface');
                                    }}
                                >
                                    返回
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                    <Divider />
                </>
            ) : null}
        </PageContainer>
    );
};

export default Index;
