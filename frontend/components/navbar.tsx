import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  VStack,
  Spacer,
  Avatar,
  Input,
  Button,
  NativeSelect,
  MenuItem,
  IconButton,
  useBreakpointValue,
  MenuTrigger,
  MenuRoot,
  MenuContent,
  
} from "@chakra-ui/react";
import Hamburger from 'hamburger-react' // Icon for mobile menu
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Field } from "@/components/ui/field"
import { api_authorized } from "../utils/api";

type BodyMeasure = {
  height: string;
  weight: string;
  age: string;
  goal: string;
};

type UserInfo = {
  profile_picture_url: string;
  full_name: string;
};

export default function Navbar() {
  useEffect(() => {
    fetchProfilePicture();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setOpen] = useState(false)
  const [bodyMeasures, setBodyMeasures] = useState<BodyMeasure>({
    height: "",
    weight: "",
    age: "",
    goal: "",
  });
  const [userInfo, setUserInfo] = useState<UserInfo>({
    profile_picture_url: "",
    full_name: "",
  });

  const fetchBodyMeasures = async () => {
    try {
      const response = await api_authorized.get("/profile/user_profile");
      if (response.data) {
        setBodyMeasures(response.data);
        
      }
    } catch (error) {
      console.error("Failed to fetch User Data:", error);
    }
  };

  const fetchProfilePicture = async () => {
    try {
      const response = await api_authorized.get("/profile/get_profile_picture");
      if (response.data) {
        setUserInfo(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch User Data:", error);
    }
  };

  const handleSaveProfile = async () => {
    setIsEditing(false);
    try {
      const response = await api_authorized.put(`/profile/user_profile`, {
        height: bodyMeasures.height,
        weight: bodyMeasures.weight,
        age: bodyMeasures.age,
        goal: bodyMeasures.goal,
      });
      if (response.status === 200) {
        fetchBodyMeasures();
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Failed to edit your profile:", error);
      alert("Failed to edit your profile");
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const goal_lookup = [
    "",
    "Lose Weight",
    "Build Muscle",
    "Improve Endurance",
    "Increase Flexibility",
    "Maintain Weight",
    "Gain Strength",
    "Improve Cardiovascular Health",
  ];

  const handleLogout = async () => {
    try {
      Cookies.remove("access_token");
      alert("Logged out successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to logout.");
    }
  };

  // Responsive breakpoints
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      bg="gray.200"
      color="gray.900"
      width="100%"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={100}
      p={4}
      m={0}
    >
      <Flex justify="space-between" align="center" maxW="100%" mx="auto" m={0} p={0}>
        {/* Logo */}
        <Link href="/home">
          <Box height="100%" display="flex" alignItems="center" m={0} p={0}>
            <Image src="/logo.png" alt="Logo" width={150} height={50} objectFit="contain" />
          </Box>
        </Link>

        {/* Navigation Links (Desktop) */}
        {!isMobile && (
          <Flex align="center" gap={6} ml={4} mt={0} height="100%" p={0}>
            <Link href="/home">
              <Button variant="subtle" colorScheme="blue"  mt={0} >
                Home
              </Button>
            </Link>
            <Link href="/about-us">
              <Button variant="subtle" colorScheme="blue"  mt={0} >
                About Us
              </Button>
            </Link>
          </Flex>
        )}

        <Spacer />

        {/* Mobile Menu */}
        {isMobile && (
          <MenuRoot>
            <MenuTrigger>
              <Button aria-label="Menu" variant="outline" mr={4} as={IconButton}>
              <Hamburger toggled={isOpen} toggle={setOpen} />
              </Button>
            </MenuTrigger>
            
            <MenuContent>
              <MenuItem asChild value="home">
                <Link href="/">Home</Link>
              </MenuItem>
              <MenuItem asChild value="about-us">
                <Link href="/">About Us</Link>
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        )}

        {/* Avatar to Open Drawer */}
        <DrawerRoot>
          <DrawerTrigger asChild onClick={fetchBodyMeasures}>
            <Avatar.Root
              size="md"
              ml={4}
              mr={3}
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
            >
              <Avatar.Fallback name={userInfo.full_name} />
              <Avatar.Image src={userInfo.profile_picture_url} />
            </Avatar.Root>
          </DrawerTrigger>
          <DrawerBackdrop />
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>User Profile</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <VStack m={4} align="start">
                
                
                <Box width="100%">
                  {isEditing ? (
                    <Field label="Height">
                        <Input
                      width="100%"
                      value={bodyMeasures?.height || ""}
                      placeholder="Height (cm)"
                      onChange={(e) =>
                        setBodyMeasures({ ...bodyMeasures, height: e.target.value })
                      }
                    />
                    </Field>
                    
                  ) : (
                    <Input
                      width="100%"
                      value={"Height: " + bodyMeasures?.height + " cm" || ""}
                      disabled
                    />
                  )}
                </Box>
                <Box width="100%">
                  {isEditing ? (
                    <Field label="Weight">
                      <Input
                      width="100%"
                      value={bodyMeasures?.weight || ""}
                      placeholder="Weight (kg)"
                      onChange={(e) =>
                        setBodyMeasures({ ...bodyMeasures, weight: e.target.value })
                      }
                    />
                    </Field>
                    
                  ) : (
                    <Input
                      width="100%"
                      value={"Weight: " + bodyMeasures?.weight + " kg" || ""}
                      disabled
                    />
                  )}
                </Box>
                <Box width="100%">
                  {isEditing ? (
                    <Field label="Age">
                      <Input
                      width="100%"
                      value={bodyMeasures?.age || ""}
                      placeholder="Age"
                      onChange={(e) =>
                        setBodyMeasures({ ...bodyMeasures, age: e.target.value })
                      }
                    />
                    </Field>
                    
                  ) : (
                    <Input
                      width="100%"
                      value={"Age: " + bodyMeasures?.age + " years" || ""}
                      disabled
                    />
                  )}
                </Box>
                <Box width="100%">
                  {isEditing ? (
                    <Field label="Fitness Goal">
                    <NativeSelect.Root width="100%">
                      <NativeSelect.Field
                        placeholder="I want to..."
                        value={bodyMeasures.goal}
                        onChange={(e) =>
                          setBodyMeasures({ ...bodyMeasures, goal: e.currentTarget.value })
                        }
                      >
                        <option value="1">Lose Weight</option>
                        <option value="2">Build Muscle</option>
                        <option value="3">Improve Endurance</option>
                        <option value="4">Increase Flexibility</option>
                        <option value="5">Maintain Weight</option>
                        <option value="6">Gain Strength</option>
                        <option value="7">Improve Cardiovascular Health</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    </Field>
                  ) : (
                    <NativeSelect.Root width="100%" disabled>
                      <NativeSelect.Field
                        placeholder={
                          "I want to " +
                          goal_lookup[Number(bodyMeasures.goal)]
                        }
                      />
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    
                  )}
                </Box>
              </VStack>
            </DrawerBody>
            <DrawerFooter>
              {isEditing ? (
                <DrawerActionTrigger asChild>
                  <Button colorScheme="blue" mr={3} onClick={handleSaveProfile}>
                    Save
                  </Button>
                </DrawerActionTrigger>
              ) : (
                <Button colorScheme="blue" mr={3} onClick={handleEditProfile}>
                  Edit Profile
                </Button>
              )}
              <Spacer />
              <Button colorScheme="red" onClick={handleLogout}>
                Logout
              </Button>
              <DrawerCloseTrigger />
            </DrawerFooter>
          </DrawerContent>
        </DrawerRoot>
      </Flex>
    </Box>
  );
}