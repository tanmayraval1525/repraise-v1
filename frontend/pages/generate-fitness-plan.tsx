import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Flex, Spinner, Text, Card } from "@chakra-ui/react";
import MarkdownIt from "markdown-it";
import { useRouter } from 'next/router';
import { api_authorized } from '../utils/api';
import Navbar from "@/components/navbar";
import Head from "next/head";

const GenerateFitnessPlanPage = () => {
  const [fitnessPlan, setFitnessPlan] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading immediately
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const markdownContainerRef = useRef<HTMLDivElement>(null);
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  }

  );

  // Fetch fitness plan when the component mounts
  useEffect(() => {
    const fetchFitnessPlan = async () => {
      try {
        // Example: Fetching from your Flask API
        const response = await api_authorized.get("/home/user_fitness_analysis");
        setFitnessPlan(response.data.ai_recommendation); // Store as a string
      } catch (error) {
        setError("Failed to fetch fitness plan. Please try again.");
        console.error("Error fetching fitness plan:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchFitnessPlan();
  }, []);

  useEffect(() => {
    if (markdownContainerRef.current && fitnessPlan) {
      markdownContainerRef.current.innerHTML = md.render(fitnessPlan);
    }
  }, [fitnessPlan]);

  const handleGoBack = () => {
    router.replace("/home"); // Navigate back to the home page
  };

  return (
    <Box bg={"transparent"}>
      <Head>
        <title>RepRaise - Your Fitness Plan</title>
        <meta name="description" content="Track your fitness goals" />
      </Head>
      <Navbar />
      
        {isLoading ? (

          <Card.Root width="90%"  style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <Card.Body>
              <Flex
                direction="column" // Stack items vertically
                alignItems="center" // Center items horizontally
                justifyContent="center" // Center items vertically
                height="200px" // Set a fixed height for the card body (adjust as needed)
              >
                <Spinner size="lg" />
                <Text mt={4}>Generating your fitness plan...</Text>
              </Flex>
            </Card.Body>
          </Card.Root>

        ) : error ? (
          <Box>
            <Text color="red.500">Error: {error}</Text>
            <Button onClick={handleGoBack} mt={90}>
              Go Back
            </Button>
          </Box>
        ) : (

          <Card.Root width="90%" mx="auto" mt={90} mb={20}>
            <Card.Header>Your Customized Fitness Plan</Card.Header>
            <Card.Body>
              <Card.Description>
                <div ref={markdownContainerRef} />
              </Card.Description>
              <Flex justify="center">
                <Button width="20%" onClick={handleGoBack} mt={4}>
                  Go Back
                </Button>
              </Flex>
            </Card.Body>
          </Card.Root>

        )}
     
      <Box
        as="footer"
        bg="gray.200"
        color="gray.900"
        py={4}
        textAlign="center"
        position="fixed"
        bottom="0"
        left={0}
        right={0}
        width="100%"
        mt={4}
      >
        <Text fontSize="sm">
          © {new Date().getFullYear()} Team NexByte • All Rights Reserved.
        </Text>
      </Box>
    </Box>

  );
};

export default GenerateFitnessPlanPage;