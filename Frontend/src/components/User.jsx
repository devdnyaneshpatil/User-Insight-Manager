import React, { useEffect, useState } from "react";
import { Box, Button, Card, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Navbar from "../subcomp/Navbar";

function User() {
  const [users, setUsers] = useState([]);
  const [buttonTexts, setButtonTexts] = useState({});
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setUsers(data);
      setButtonTexts({});
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(
        `https://super-ruby-sari.cyclic.app/users/${userId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setButtonTexts((prevState) => ({
        ...prevState,
        [userId]: data.msg,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleButtonClick = async (id, addEl) => {
    const payload = {
      id,
      name: addEl.getAttribute("data-name"),
      email: addEl.getAttribute("data-email"),
      phone: addEl.getAttribute("data-phone"),
      website: addEl.getAttribute("data-website"),
      city: addEl.getAttribute("data-city"),
      company: addEl.getAttribute("data-company"),
    };

    try {
      if (addEl.innerText === "Add") {
        const response = await fetch(
          "https://super-ruby-sari.cyclic.app/users/add",
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        addEl.innerText = data.msg;
        addEl.classList.remove("Add");
        addEl.classList.add(data.msg);
      } else {
        navigate(`/post?id=${payload.id}`);
      }
    } catch (error) {
      console.error("Error handling button click:", error);
    }
  };

  useEffect(() => {
    if (users.length > 0) {
      users.forEach((user) => {
        fetchUserData(user.id);
      });
    }
  }, [users]);

  return (
    <>
      <Navbar />
      <Box
        w={"80%"}
        margin={"auto"}
        display={"grid"}
        gridTemplateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
        gap={20}
        mt={"20px"}
      >
        {users.length === 0 && (
          <Button colorScheme="facebook" w={"100%"} onClick={fetchUsers}>
            All Users
          </Button>
        )}
        {users.length > 0 &&
          users.map((user) => (
            <Card
              key={user.id}
              className="card"
              data-id={user.id}
              data-email={user.email}
              data-name={user.name}
              data-phone={user.phone}
              data-website={user.website}
              data-city={user.address.city}
              data-company={user.company.name}
              boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
              border={"1px solid grey"}
              p={"10px"}
            >
              <Heading className="name">{user.name}</Heading>
              <Heading className="email">Email:-{user.email}</Heading>
              <Text className="phone">PHONE:-{user.phone}</Text>
              <Text className="web">WEBSITE:-{user.website}</Text>
              <Text className="city">ADDRESS:-{user.address.city}</Text>
              <Text className="company">COMPANY:-{user.company.name}</Text>
              <Button
                colorScheme="twitter"
                data-name={user.name}
                data-email={user.email}
                data-phone={user.phone}
                data-website={user.website}
                data-city={user.address.city}
                data-company={user.company.name}
                onClick={(e) => handleButtonClick(user.id, e.target)}
              >
                {buttonTexts[user.id]}
              </Button>
            </Card>
          ))}
      </Box>
    </>
  );
}

export default User;
