import React from "react";
import { Box, Heading, Text, Flex, Image, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar";
import Head from "next/head";

const AboutUsPage = () => {
  const router = useRouter();

  // Team member data
  const teamMembers = [
    {
      name: "Tanmay Raval",
      role: "Database & Cloud Engineer",
      techStack: "SQL Server, PostgreSQL Azure, AWS, Flask, Django, Data Analysis and Visualization using Python",
      image: "/tanmay.jpeg",
      bioPage: "https://shor.by/esvZ",
    },
    {
      name: "Rushik Patel",
      role: "Backend Developer",
      techStack: "Java, Python, Flutter, FlutterFlow, HTML, CSS, JavaScript, Angular JS, Spring Boot, MongoDB (Compass), SQL, Dart, Data analysis and filtering",
      image: "/rushik.jpeg",
      bioPage: "https://shor.by/nKmL",
    },
    {
      name: "Nima Patel",
      role: "Frontend Developer",
      techStack: "HTML, CSS, JS, Next.js, Node.js, Python, MySQL, PostgreSQL, Oracle, MongoDB",
      image: "/nima.jpeg",
      bioPage: "https://shor.by/ggRi",
    },
    {
      name: "Shubhkaram Singh Thind",
      role: "Data Analyst",
      techStack: "Power BI, Tableau, Excel, Python, NumPy, Pandas, Seaborn, Matplotlib, MySQL, PostgreSQL, Microsoft SQL Server",
      image: "/shubh.jpeg",
      bioPage: "https://shor.by/zll8",
    },
  ];

  return (
    <Box minHeight="100vh" p={8}>
      <Head>
        <title>RepRaise - About Us</title>
        <meta name="description" content="Track your fitness goals" />
      </Head>
      <Navbar />
      <Box maxWidth="1200px" mx="auto" bg="white" p={8} borderRadius="md" boxShadow="lg" mt={90} mb={10}>
        <Heading as="h1" size="2xl" textAlign="center" mb={8}>
          About Us
        </Heading>
        <Text fontSize="lg" textAlign="center" mb={8}>
          We are Team NexByte: Shaping the Future, One Byte at a Time
        </Text>
        <Flex wrap="wrap" justify="center" gap={8}>
          {teamMembers.map((member, index) => (
            <Box
              key={index}
              bg="gray.50"
              p={6}
              borderRadius="md"
              boxShadow="md"
              textAlign="center"
              width={{ base: "100%", md: "45%", lg: "22%" }}
              display="flex"
              flexDirection="column"
            >
              <Image
                src={member.image}
                alt={member.name}
                borderRadius="full"
                boxSize="150px"
                mx="auto"
                mb={4}
              />
              <Heading as="h3" size="lg" mb={2}>
                {member.name}
              </Heading>
              <Text fontSize="md" color="gray.600" mb={2}>
                {member.role}
              </Text>
              <Text fontSize="sm" color="gray.500" mb={4} flex="1">
                <strong>Tech Stack:</strong> {member.techStack}
              </Text>
              <Flex justifyContent="center" mt="auto">
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() => router.replace(member.bioPage)}
                >
                  Know More
                </Button>
              </Flex>
            </Box>
          ))}
        </Flex>
      </Box>
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

export default AboutUsPage;