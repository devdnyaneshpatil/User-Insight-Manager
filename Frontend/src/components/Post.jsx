import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Heading,
  Text,
  Card,
  Wrap,
  WrapItem,
  Avatar,
  useToast,
} from "@chakra-ui/react";
import Navbar from "../subcomp/Navbar";

function Post() {
  const [buttonText, setButtonText] = useState("");
  const [posts, setPosts] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: "", company: "" });
  const [fetchedPosts, setFetchedPosts] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("id");
      const userName = urlParams.get("userName");
      const company = urlParams.get("company");

      try {
        const response = await fetch(
          `https://super-ruby-sari.cyclic.app/posts/${userId}`
        );
        const data = await response.json();
        setButtonText(data.msg);

        const user = {
          name: userName,
          company: company,
        };
        setUserInfo(user);

        if (!fetchedPosts) {
          const postsResponse = await fetch(
            `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
          );
          const postsData = await postsResponse.json();
          setPosts(postsData);
          setFetchedPosts(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [fetchedPosts]);

  const handleButtonClick = async () => {
    if (buttonText === "Bulk Add") {
      const userId = new URLSearchParams(window.location.search).get("id");
      try {
        const company = userInfo.company;
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
        );
        const data = await response.json();
        const postResponse = await fetch(
          `https://super-ruby-sari.cyclic.app/posts/${company}`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const postData = await postResponse.json();
        setButtonText(postData.msg);
        toast({
          title: "Bulk Add",
          description: "Posts are added",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error adding posts:", error);
      }
    } else if (buttonText === "Download in Excel") {
      try {
        const csvData = generateCSV(posts);
        downloadCSV(csvData, "data.csv");
        toast({
          title: "Download in Excel",
          description: "Posts downloaded successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error downloading in Excel:", error);
      }
    }
  };

  const generateCSV = (posts) => {
    const headers = Object.keys(posts[0]).join(",") + "\n";
    const rows = posts.map((post) => Object.values(post).join(",")).join("\n");
    return headers + rows;
  };

  const downloadCSV = (data, filename) => {
    const blob = new Blob([data], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Navbar></Navbar>
      <Box w={"80%"} margin={"auto"} mt={"20px"}>
        <Box id="button-container" textAlign="center" mb={4}>
          <Button colorScheme="teal" onClick={handleButtonClick}>
            {buttonText}
          </Button>
        </Box>
        <Box
          id="user-container"
          display={"grid"}
          gridTemplateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
          gap={20}
          mt={"50px"}
        >
          {posts.map((el) => (
            <Card
              key={el.id}
              data-id={el.id}
              data-company={userInfo.company}
              mb={"20px"}
              bg="gray.200"
              p={"50px"}
              border=" 1px solid black"
              transition="transform 0.3s ease-in-out"
              _hover={{ transform: "scale(1.05)", cursor: "pointer" }}
            >
              <Wrap>
                <WrapItem>
                  <Avatar
                    name={userInfo.name}
                    w={"100px"}
                    h={"100px"}
                    bg={"palegreen"}
                    mb={"10px"}
                    color={"black"}
                  />
                </WrapItem>
              </Wrap>
              <Heading as="h3" size="md" color={"palevioletred"}>
                TITLE:-{el.title}
              </Heading>
              <Text>BODY:-{el.body}</Text>
              <Text>COMPANY:-{userInfo.company}</Text>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
}

export default Post;
