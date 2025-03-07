import { useState } from 'react';
import {
  Button,
  Input,
  Stack,
  Text,
  Box,
  Flex,
  Image,
  Center
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { api } from '../utils/api';
import LoginButton from "@/components/LoginButton";
import Cookies from 'js-cookie';
import Head from 'next/head';

type AuthFormData = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
};

const LoginPage = () => {
  const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  });

  const signupSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string(),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter")
      .matches(/[a-z]/, "Password must contain at least 1 lowercase letter")
      .matches(/\d/, "Password must contain at least 1 number")
      .matches(/[@$!%*?&]/, "Password must contain at least 1 special character"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: yupResolver(isLogin ? loginSchema : signupSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    const url = isLogin ? '/login' : '/signup';

    try {
      const response = await api.post(url, data);

      if (response.status === 200) {
        if (isLogin) {
          // Store the JWT token on successful login
          const { access_token } = response.data;
          if (access_token) {
            Cookies.set('access_token', access_token); // Store the token
            router.push('/home');
          }
        } else {
          router.push('/login');
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.error || "An error occurred");
      } else {
        setErrorMessage("An unknown error occurred");
      }
    }
  };

  return (
    <Flex minHeight="100vh" align="center" justify="center">
      <Head>
        <title>RepRaise - {isLogin ? 'Login':'Sign Up'}</title>
        <meta name="description" content="Track your fitness goals" />
      </Head>
      <Box
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        width="100%"
        maxWidth="400px"
        alignItems={"center"}
        bg='whiteAlpha.900'
      >
        <Center m={0} p={0}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={40}
            m={0}
            p={0}
            objectFit="contain"
            style={{ display: 'block' }}
          />
        </Center>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack mt={2}>
            <Box>
              <Input type="email" placeholder="Email" {...register('email')} />
              {errors.email && <Text color="red.500">{errors.email.message}</Text>}
            </Box>

            <Box>
              <Input type="password" placeholder="Password" {...register('password')} />
              {errors.password && <Text color="red.500">{errors.password.message}</Text>}
            </Box>

            {!isLogin && (
              <>
                <Box>
                  <Input type="password" placeholder="Confirm Password" {...register('confirmPassword')} />
                  {errors.confirmPassword && <Text color="red.500">{errors.confirmPassword.message}</Text>}
                </Box>

                <Box>
                  <Input type="text" placeholder="First Name" {...register('firstName')} />
                  {errors.firstName && <Text color="red.500">{errors.firstName.message}</Text>}
                </Box>

                <Box>
                  <Input type="text" placeholder="Last Name" {...register('lastName')} />
                  {errors.lastName && <Text color="red.500">{errors.lastName.message}</Text>}
                </Box>
              </>
            )}

            <Button type="submit" colorScheme="teal" width="full">
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>

            {errorMessage && <Text color="red.500" textAlign="center">{errorMessage}</Text>}
          </Stack>
        </form>

        <Text textAlign="center" mt="4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <Button variant="ghost" colorScheme="blue" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </Button>
        </Text>

        <Box mt={4} textAlign="center">
          <LoginButton />
        </Box>
      </Box>
    </Flex>
  );
};

export default LoginPage;
