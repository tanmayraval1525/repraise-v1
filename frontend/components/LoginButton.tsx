"use client"; // Ensure compatibility with Next.js App Router

import { Button, Flex, Text } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { useColorModeValue } from "@/components/ui/color-mode";


const LoginButton = () => {
  const bg = useColorModeValue("gray.200", "gray.700"); // Background color based on theme
  const color = useColorModeValue("black", "white"); // Text color based on theme

  const handleGoogleLogin = async () => {
    try {
      // Redirect the user to the backend endpoint that initiates Google OAuth
      window.location.href = "http://localhost:5000/auth/login"; // Adjust the URL to your Flask backend
    } catch (error) {
      console.error("Error during Google login:", error);
      alert("An error occurred while trying to log in with Google.");
    }
  };

  return (
    <Button
      bg={bg}
      color={color}
      variant="solid"
      width="full"
      _hover={{ bg: useColorModeValue("gray.300", "gray.600") }}
      onClick={handleGoogleLogin}
    >
      <Flex align="center" gap={2}>
        <FcGoogle size={20} />
        <Text>Sign in with Google</Text>
      </Flex>
    </Button>
  );
};

export default LoginButton;