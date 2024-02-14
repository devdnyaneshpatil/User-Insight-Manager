import React, { useState, useEffect } from "react";

function Post() {
  const [buttonText, setButtonText] = useState("");
  const [posts, setPosts] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: "", company: "" });

  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("id");

      try {
        const response = await fetch(`http://localhost:8080/posts/${userId}`);
        const data = await response.json();
        setButtonText(data.msg);

        const userInfoResponse = await fetch(
          `http://localhost:8080/users/${userId}`
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
          `http://localhost:8080/posts/${company}`,
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
        const response = await fetch(`http://localhost:8080/posts/${userId}`);
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

  useEffect(() => {
    displayPosts(posts);
  }, [posts, userInfo]);

  const displayPosts = (data) => {
    return data.map((el) => (
      <div key={el.id} data-id={el.id} data-company={userInfo.company}>
        <h1>{userInfo.name}</h1>
        <h3>{el.title}</h3>
        <p>{el.body}</p>
        <h4>{userInfo.company}</h4>
      </div>
    ));
  };

  return (
    <div>
      <div id="button-container">
        <button onClick={handleButtonClick}>{buttonText}</button>
      </div>
      <div id="user-container">{displayPosts(posts)}</div>
    </div>
  );
}

export default Post;
