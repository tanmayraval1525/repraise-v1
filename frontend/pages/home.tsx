import {
  Box,
  Button,
  HStack,
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Input,
  Text,
  Card,
  Flex,
  Heading,
  Table,
  Grid,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { Stack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import { api_authorized } from '../utils/api';
import axios from "axios";
import React from 'react';
import { useRouter } from 'next/router';
import Head from "next/head";


type Activity = {
  activity_id: number;
  activityName: string;
  activityDuration: string;
  calories_burned: string;
  Date: string;
};

type Food = {
  food_id: number;
  food_name: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  date: string;
};


const FitnessPlan = () => {

  const router = useRouter();

  // Function to fetch AI response and store as markdown
  const handleGeneratePlan = async () => {
    router.replace("/generate-fitness-plan")
  }



  return (
    <Box mt={4} mb={6} textAlign="center">
      <Button
        colorScheme="blue"
        onClick={handleGeneratePlan}
        size="lg"
        mb={5}

      >
        Generate Fitness Plan
      </Button>
    </Box>
  );
};



export { FitnessPlan };




export default function Home() {
  const { onClose } = useDisclosure();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [activityName, setActivityName] = useState("");
  const [activityDuration, setActivityDuration] = useState("");
  const [foodName, setFoodName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [calories_consumed, setCaloriesConsumed] = useState("");
  const [calories_burnt, setCaloriesBurnt] = useState("");
  const [workout_duration, setWorkoutDuation] = useState("");

  useEffect(() => {
    fetchTodayStats();
    fetchActivities();
    fetchFoods();
  }, []);




  const fetchActivities = async () => {
    try {
      const response = await api_authorized.get('/home/activities');
      setActivities(response.data.activities);
    } catch (error) {
      console.error("Failed to fetch activities:", error);

    }
  };

  const fetchTodayStats = async () => {
    try {
      const response = await api_authorized.get('/home/today_calories_burnt');
      setCaloriesBurnt(response.data.calories_burnt);
      setWorkoutDuation(response.data.workout_duration);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }

    try {
      const response = await api_authorized.get('/home/today_calories_consumed');
      setCaloriesConsumed(response.data.calories_consumed);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchFoods = async () => {
    try {
      const response = await api_authorized.get('/home/food_log');
      setFoods(response.data.food_log);
    } catch (error) {
      console.error("Failed to fetch foods:", error);
    }
  };

  const onAddActivityClickButton = async () => {
    const data = { activityName, activityDuration };
    try {
      const response = await api_authorized.post('home/activities', data);
      if (response.status === 201) {
        onClose();
        fetchActivities();
        fetchTodayStats();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.error || "An error occurred");
      } else {
        setErrorMessage("An unknown error occurred");
      }
      console.error(errorMessage);
    }
  };

  const onAddFoodClickButton = async () => {
    const data = { foodName };
    try {
      const response = await api_authorized.post('/home/food_log', data);
      if (response.status === 201) {
        onClose();
        fetchFoods();
        fetchTodayStats();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.error || "An error occurred");
      } else {
        setErrorMessage("An unknown error occurred");
      }
      console.error(errorMessage);
    }
  };

  const onEditActivityClickButton = async (id: number, updatedActivity: Partial<Activity>) => {
    try {
      const response = await api_authorized.put(`/home/activities/${id}`, updatedActivity);
      if (response.status === 200) {
        onClose();
        fetchActivities();
        fetchTodayStats();
      }
    } catch (error) {
      console.error("Failed to edit activity:", error);
    }
  };

  const onEditFoodClickButton = async (id: number, updatedFood: Partial<Food>) => {
    try {
      const response = await api_authorized.put(`/home/food_log/${id}`, updatedFood);
      if (response.status === 200) {
        onClose();
        fetchFoods();
        fetchTodayStats();
      }
    } catch (error) {
      console.error("Failed to edit food:", error);
    }
  };



  const onDeleteActivityClickButton = async (activityId: number): Promise<void> => {
    try {
      const response = await api_authorized.delete(`/home/activities/${activityId}`);
      if (response.status === 200) {
        setActivities((prevActivities) =>
          prevActivities.filter((activity) => activity.activity_id !== activityId)
        );
        fetchActivities();
        fetchTodayStats();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Failed to delete activity:", error.response.data.error);
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  };

  const onDeleteFoodClickButton = async (foodId: number): Promise<void> => {
    try {
      const response = await api_authorized.delete(`/home/food_log/${foodId}`);
      if (response.status === 200) {
        setFoods((prevFoods) =>
          prevFoods.filter((food) => food.food_id !== foodId)
        );
        fetchFoods();
        fetchTodayStats();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Failed to delete food:", error.response.data.error);
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  };



  // const fetchFitnessPlan = async () => {
  //   try {
  //     const response = await api_authorized.get('/home/user_fitness_analysis');
  //     setFitnessPlan(response.data);
  //     if (fitnessPlan) {
  //       console.log(fitnessPlan.ai_recommendation);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch fitness plan:", error);
  //   }
  // };

  return (
    <Box p={5} m={1}>
      <Head>
        <title>RepRaise - Home</title>
        <meta name="description" content="Track your fitness goals" />
      </Head>
      <Navbar />

      <Box width="100%" p={4} bg="white" borderRadius="md" boxShadow="sm" mt={90}>
        <HStack m={4} margin={[4, 4, 8]} wrap="wrap" justify="center">
          <Box width={["100%", "100%", "30%"]} alignItems="center" mb={[4, 4, 0]}>
            <Text fontSize={["5xl", "6xl"]} fontWeight="bold" textAlign="center" color="blue.500" mb={4}>
              {workout_duration}
            </Text>
            <Text fontSize={["lg", "xl"]} fontWeight="bold" textAlign="center" color="blue.500" mb={4}>
              min
            </Text>
            <Text fontSize={["md", "lg"]} fontWeight="bold" textAlign="center" color="blue.300" mt={1}>
              workout duration completed
            </Text>
          </Box>

          <Box width={["100%", "100%", "30%"]} alignItems="center" mb={[4, 4, 0]}>
            <Text fontSize={["5xl", "6xl"]} fontWeight="bold" textAlign="center" color="blue.500" mb={4}>
              {calories_consumed}
            </Text>
            <Text fontSize={["lg", "xl"]} fontWeight="bold" textAlign="center" color="blue.500" mb={4}>
              kcal
            </Text>
            <Text fontSize={["md", "lg"]} fontWeight="bold" textAlign="center" color="blue.300" mt={1}>
              consumed today
            </Text>
          </Box>

          <Box width={["100%", "100%", "30%"]} alignItems="center" mb={[4, 4, 0]}>
            <Text fontSize={["5xl", "6xl"]} fontWeight="bold" textAlign="center" color="blue.500" mb={4}>
              {calories_burnt}
            </Text>
            <Text fontSize={["lg", "xl"]} fontWeight="bold" textAlign="center" color="blue.500" mb={4}>
              kcal
            </Text>
            <Text fontSize={["md", "lg"]} fontWeight="bold" textAlign="center" color="blue.300" mt={1}>
              burnt today
            </Text>
          </Box>
        </HStack>
      </Box>


      {/* Activities Logged Section */}
      <Box flex="1" width="100%" p={4} bg="white" borderRadius="md" boxShadow="sm" mt={4}>
        <Flex justify="space-between" mb={4}>
          <Heading size="lg">Activities Logged (Last 7 Days)</Heading>
          <Flex gap={2}>
            <DialogRoot closeOnInteractOutside>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg">
                  Add Activity
                </Button>
              </DialogTrigger>
              <Portal>
                <DialogContent style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                  <DialogHeader>
                    <DialogTitle>Add Activity</DialogTitle>
                  </DialogHeader>
                  <DialogBody>
                    <Stack mt={4}>
                      <Input
                        placeholder="e.g., Running"
                        value={activityName}
                        onChange={(e) => setActivityName(e.target.value)}
                      />
                      <Input
                        placeholder="e.g., 30 mins"
                        value={activityDuration}
                        onChange={(e) => setActivityDuration(e.target.value)}
                      />
                    </Stack>
                  </DialogBody>
                  <DialogFooter>
                    <DialogActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogActionTrigger>
                    <DialogActionTrigger asChild>
                      <Button onClick={onAddActivityClickButton}>Add</Button>
                    </DialogActionTrigger>
                  </DialogFooter>
                  <DialogCloseTrigger />
                </DialogContent>
              </Portal>
            </DialogRoot>
          </Flex>
        </Flex>

        {activities.length === 0 ? (
          <Text textAlign="center" color="gray.500">No activities logged yet.</Text>
        ) : (
          <>
            {/* Table for Desktop */}
            <Box display={["none", "none", "block"]}>
              <Table.Root variant="outline">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Activity</Table.ColumnHeader>
                    <Table.ColumnHeader>Date</Table.ColumnHeader>
                    <Table.ColumnHeader>Duration</Table.ColumnHeader>
                    <Table.ColumnHeader>Calories</Table.ColumnHeader>
                    <Table.ColumnHeader></Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {activities.map((activity) => (
                    <Table.Row key={activity.activity_id}>
                      <Table.Cell>{activity.activityName}</Table.Cell>
                      <Table.Cell>{activity.Date}</Table.Cell>
                      <Table.Cell>{activity.activityDuration} mins</Table.Cell>
                      <Table.Cell>{activity.calories_burned}</Table.Cell>
                      <Table.Cell>
                        {/* Use Flex to align buttons to the right */}
                        <Flex justifyContent="flex-end">
                          <DialogRoot closeOnInteractOutside>
                            <DialogTrigger asChild>
                              <Button size="sm">Edit</Button>
                            </DialogTrigger>
                            <Portal>
                              <DialogContent style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                <DialogHeader>
                                  <DialogTitle>Edit Activity</DialogTitle>
                                </DialogHeader>
                                <DialogBody>
                                  <Stack mt={4}>
                                    <Input
                                      placeholder="e.g., Running"
                                      value={activityName}
                                      onChange={(e) => setActivityName(e.target.value)}
                                    />
                                    <Input
                                      placeholder="e.g., 30 mins"
                                      value={activityDuration}
                                      onChange={(e) => setActivityDuration(e.target.value)}
                                    />
                                  </Stack>
                                </DialogBody>
                                <DialogFooter>
                                  <DialogActionTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogActionTrigger>
                                  <DialogActionTrigger asChild>
                                    <Button onClick={() => onEditActivityClickButton(activity.activity_id, { activityName: activityName, activityDuration: activityDuration })}>
                                      Edit
                                    </Button>
                                  </DialogActionTrigger>
                                </DialogFooter>
                                <DialogCloseTrigger />
                              </DialogContent>
                            </Portal>
                          </DialogRoot>
                          <Button size="sm" colorScheme="red" ml={2} onClick={() => onDeleteActivityClickButton(activity.activity_id)}>
                            Delete
                          </Button>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>

            {/* List for Mobile */}
            <Box display={["block", "block", "none"]}>
              <Flex direction="column" gap={4}>
                {activities.map((activity) => (
                  <Box key={activity.activity_id} borderWidth="1px" p={4} borderRadius="md">
                    <Heading size="sm">{activity.activityName}</Heading>
                    <Text>{activity.activityDuration} mins • {activity.calories_burned} kcal</Text>
                    <Flex mt={2} gap={2}>
                      <DialogRoot closeOnInteractOutside>
                        <DialogTrigger asChild>
                          <Button width="40%">Edit</Button>
                        </DialogTrigger>
                        <Portal>
                          <DialogContent style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                            <DialogHeader>
                              <DialogTitle>Edit Activity</DialogTitle>
                            </DialogHeader>
                            <DialogBody>
                              <Stack mt={4}>
                                <Input
                                  placeholder="e.g., Running"
                                  value={activityName}
                                  onChange={(e) => setActivityName(e.target.value)}
                                />
                                <Input
                                  placeholder="e.g., 30 mins"
                                  value={activityDuration}
                                  onChange={(e) => setActivityDuration(e.target.value)}
                                />
                              </Stack>
                            </DialogBody>
                            <DialogFooter>
                              <DialogActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogActionTrigger>
                              <DialogActionTrigger asChild>
                                <Button onClick={() => onEditActivityClickButton(activity.activity_id, { activityName: activityName, activityDuration: activityDuration })}>
                                  Edit
                                </Button>
                              </DialogActionTrigger>
                            </DialogFooter>
                            <DialogCloseTrigger />
                          </DialogContent>
                        </Portal>
                      </DialogRoot>
                      <Button width="40%" colorScheme="red" onClick={() => onDeleteActivityClickButton(activity.activity_id)}>
                        Delete
                      </Button>
                    </Flex>
                  </Box>
                ))}
              </Flex>
            </Box>
          </>
        )}
      </Box>

      {/* Food Logged Section */}

      <Box flex="1" width="100%" p={4} bg="white" borderRadius="md" boxShadow="sm" mt={4}>
        <Flex justify="space-between" mb={4}>
          <Heading size="lg">Food Logged (Last 7 Days)</Heading>
          <Flex gap={2}>

            <DialogRoot closeOnInteractOutside>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg">
                  Add Food
                </Button>
              </DialogTrigger>
              <Portal>
                <DialogContent style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                  <DialogHeader>
                    <DialogTitle>Add Food</DialogTitle>
                  </DialogHeader>
                  <DialogBody>
                    <Stack mt={4}>
                      <Input
                        placeholder="e.g., Apple"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                      />
                    </Stack>
                  </DialogBody>
                  <DialogFooter>
                    <DialogActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogActionTrigger>
                    <DialogActionTrigger asChild>
                      <Button onClick={onAddFoodClickButton}>Add</Button>
                    </DialogActionTrigger>
                  </DialogFooter>
                  <DialogCloseTrigger />
                </DialogContent>
              </Portal>
            </DialogRoot>
          </Flex>
        </Flex>

        {foods.length === 0 ? (
          <Text textAlign="center" color="gray.500">No foods logged yet.</Text>
        ) : (
          <>
            {/* Table for Desktop */}
            <Box display={["none", "none", "block"]}>
              <Table.Root variant="outline">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Food</Table.ColumnHeader>
                    <Table.ColumnHeader>Date</Table.ColumnHeader>
                    <Table.ColumnHeader>Calories</Table.ColumnHeader>
                    <Table.ColumnHeader>Protein (gm)</Table.ColumnHeader>
                    <Table.ColumnHeader>Carbs (gm)</Table.ColumnHeader>
                    <Table.ColumnHeader>Fat (gm)</Table.ColumnHeader>
                    <Table.ColumnHeader></Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {foods.map((food) => (
                    <Table.Row key={food.food_id}>
                      <Table.Cell>{food.food_name}</Table.Cell>
                      <Table.Cell>{food.date}</Table.Cell>
                      <Table.Cell>{food.calories}</Table.Cell>
                      <Table.Cell>{food.protein}</Table.Cell>
                      <Table.Cell>{food.carbs}</Table.Cell>
                      <Table.Cell>{food.fats}</Table.Cell>
                      <Table.Cell>
                        {/* Use Flex to align buttons to the right */}
                        <Flex justifyContent="flex-end">
                          <DialogRoot closeOnInteractOutside>
                            <DialogTrigger asChild>
                              <Button size="sm">Edit</Button>
                            </DialogTrigger>
                            <Portal>
                              <DialogContent style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                <DialogHeader>
                                  <DialogTitle>Edit Food Logged</DialogTitle>
                                </DialogHeader>
                                <DialogBody>
                                  <Stack mt={4}>
                                    <Input
                                      placeholder="e.g., Apple"
                                      value={foodName}
                                      onChange={(e) => setFoodName(e.target.value)}
                                    />
                                  </Stack>
                                </DialogBody>
                                <DialogFooter>
                                  <DialogActionTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogActionTrigger>
                                  <DialogActionTrigger asChild>
                                    <Button onClick={() => onEditFoodClickButton(food.food_id, { food_name: foodName })}>
                                      Edit
                                    </Button>
                                  </DialogActionTrigger>
                                </DialogFooter>
                                <DialogCloseTrigger />
                              </DialogContent>
                            </Portal>
                          </DialogRoot>
                          <Button size="sm" colorScheme="red" ml={2} onClick={() => onDeleteFoodClickButton(food.food_id)}>
                            Delete
                          </Button>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>

            {/* Grid for Mobile */}
            <Box display={["block", "block", "none"]} >
              <Grid columns={[1, 2, 3]} gap={4}>
                {foods.map((food) => (
                  <Card.Root key={food.food_id} width="100%">
                    <Card.Body>
                      <Heading size="md">{food.food_name}</Heading>
                      <Box>{food.calories} kcal • Protein: {food.protein} gm • Carbs: {food.carbs} gm • Fat: {food.fats} gm</Box>
                      <DialogRoot closeOnInteractOutside>
                        <DialogTrigger asChild>
                          <Button width="40%" m="5%">Edit</Button>

                        </DialogTrigger>
                        <Portal>
                          <DialogContent style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                            <DialogHeader>
                              <DialogTitle>Edit Food Logged</DialogTitle>
                            </DialogHeader>
                            <DialogBody>
                              <Stack mt={4}>
                                <Input
                                  placeholder="e.g., Apple"
                                  value={foodName}
                                  onChange={(e) => setFoodName(e.target.value)}
                                />
                              </Stack>
                            </DialogBody>
                            <DialogFooter>
                              <DialogActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogActionTrigger>
                              <DialogActionTrigger asChild>
                                <Button onClick={() => onEditFoodClickButton(food.food_id, { food_name: foodName })}>Edit</Button>
                              </DialogActionTrigger>
                            </DialogFooter>
                            <DialogCloseTrigger />
                          </DialogContent>
                        </Portal>
                      </DialogRoot>
                      <Button mt={2} width="40%" m="5%" colorScheme="red" onClick={() => onDeleteFoodClickButton(food.food_id)}>
                        Delete
                      </Button>
                    </Card.Body>
                  </Card.Root>
                ))}
              </Grid>
            </Box>
          </>
        )}
      </Box>


      {/* Fitness Plan Section */}
      <FitnessPlan />

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
}