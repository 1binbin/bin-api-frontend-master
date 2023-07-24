import Footer from '@/components/Footer';
import {
    userForgetPasswordUsingPOST,
    userRegisterUsingPOST,
} from '@/services/nero-api-backend/userController';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginFormPage, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { message } from 'antd';
import React, { useRef } from 'react';
import pandaBackImg from '../../../../public/panda2.jpg';
import logo from '../../../../public/logo.png';

type LoginType = 'account' | 'register' | 'forgetPassword';

const Login: React.FC = () => {
    const formRef = useRef<ProFormInstance>();

    const handleSubmit = async (values: API.UserRegisterRequest) => {
        const { userPassword, checkPassword } = values;
        if (checkPassword) {
            // 重置密码
            if (userPassword !== checkPassword) {
                message.error('两次输入密码不一致！');
                return;
            }
            const res = await userForgetPasswordUsingPOST(values);
            if (res.code === 0) {
                const defaultRegisterSuccessMessage = '注册成功！';
                message.success(defaultRegisterSuccessMessage);
                // 切换到登录
                window.location.href = '/user/login';
                // 重置表单
                formRef.current?.resetFields();
            } else if (res.code === 50001) {
                message.error('账号不存在，重置密码失败');
                formRef.current?.resetFields();
            }
        } else {
            message.error('重置密码失败，请重试');
        }
    };
    return (
        <div>
            <div
                style={{
                    backgroundColor: 'white',
                    height: 'calc(100vh - 100px)',
                    margin: 0,
                }}
            >
                <LoginFormPage
                    backgroundImageUrl={pandaBackImg}
                    logo={logo}
                    title="Bin API 重置密码"
                    subTitle="史上最好用的API接口平台"
                    initialValues={{
                        autoLogin: true,
                    }}
                    onFinish={async (values) => {
                        console.log(values);
                        await handleSubmit(values as API.UserRegisterRequest);
                    }}
                >
                    <>
                        <ProFormText
                            fieldProps={{
                                size: 'large',
                                prefix: <UserOutlined />,
                            }}
                            name="userAccount"
                        />
                        <ProFormText.Password
                            fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined />,
                            }}
                            name="userPassword"
                            placeholder={'请输入密码'}
                            rules={[
                                {
                                    required: true,
                                    message: '密码是必填项！',
                                },
                                {
                                    min: 8,
                                    message: '长度不能少于8位！',
                                },
                            ]}
                        />
                        <ProFormText.Password
                            fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined />,
                            }}
                            name="checkPassword"
                            placeholder={'请再次输入密码'}
                            rules={[
                                {
                                    required: true,
                                    message: '密码是必填项！',
                                },
                                {
                                    min: 8,
                                    message: '长度不能少于8位！',
                                },
                            ]}
                        />
                        <a
                            style={{
                                float: 'left',
                                marginBottom: '10px',
                                marginTop: '-10px',
                            }}
                            onClick={(item) => {
                                history.push('/user/login');
                            }}
                        >
                            返回登录
                        </a>
                    </>
                </LoginFormPage>
            </div>
            <Footer />
        </div>
    );
};
export default Login;
