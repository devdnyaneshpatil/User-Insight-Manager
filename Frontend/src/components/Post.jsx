import React, { useState, useEffect } from "react";
import { Button, Box, Heading, Text, Card } from "@chakra-ui/react";
import Navbar from "../subcomp/Navbar";

function Post() {
  const [buttonText, setButtonText] = useState("");
  const [posts, setPosts] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: "", company: "" });

  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("id");

      try {
        const response = await fetch(
          `https://super-ruby-sari.cyclic.app/posts/${userId}`
        );
        const data = await response.json();
        setButtonText(data.msg);

        const userInfoResponse = await fetch(
          `https://super-ruby-sari.cyclic.app/users/${userId}`
        );
        const userInfoData = await userInfoResponse.json();
        const user = {
          name: userInfoData.user.name,
          company: userInfoData.user.company,
        };
        setUserInfo(user);
        localStorage.setItem(
          "company",
          JSON.stringify({ companyName: user.company })
        );

        const postsResponse = await fetch(
          `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
        );
        const postsData = await postsResponse.json();
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleButtonClick = async () => {
    const userId = new URLSearchParams(window.location.search).get("id");

    if (buttonText === "Bulk Add") {
      try {
        const company = JSON.parse(localStorage.getItem("company")).companyName;
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
      } catch (error) {
        console.error("Error adding posts:", error);
      }
    } else if (buttonText === "Download in Excel") {
      try {
        const response = await fetch(
          `https://super-ruby-sari.cyclic.app/posts/${userId}`
        );
        const data = await response.json();
        const csvData = generateCSV(data.posts);
        downloadCSV(csvData, "data.csv");
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
      <Box
        w={"80%"}
        margin={"auto"}
        display={"grid"}
        gridTemplateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
        gap={20}
        mt={"20px"}
      >
        <Box id="button-container" textAlign="center" mb={4}>
          <Button colorScheme="teal" onClick={handleButtonClick}>
            {buttonText}
          </Button>
        </Box>
        <Box id="user-container">
          {posts.map((el) => (
            <Card key={el.id} data-id={el.id} data-company={userInfo.company} 
            mb={"20px"}
            bg="gray.200"
            p={"50px"}
            >
              <Heading>USER:-{userInfo.name}</Heading>
              <Heading as="h3" size="md">
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
