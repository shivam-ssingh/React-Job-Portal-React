import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import MainLayout from "./layouts/MainLayout";
import JobsPage from "./pages/JobsPage";
import NotFoundPage from "./pages/NotFoundPage";
import JobPage, { jobLoader } from "./pages/JobPage";
import AddJobPage from "./pages/AddJobPage";
import EditJobPage from "./pages/EditJobPage";
import PrivateRoute from "./components/PrivateRoute";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import { UserProvider } from "./components/UserContext";
const App = () => {
  const [user, setUser] = useState(null);
  // Add New Job
  const addJob = async (newJob) => {
    try {
      const storedUserData = JSON.parse(localStorage.getItem("user"));
      console.log("stored toke data is ..........", storedUserData["token"]);
      const res = await fetch(
        "https://express-job-api.onrender.com/api/v1/jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedUserData["token"]}`,
          },
          body: JSON.stringify(newJob),
        }
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Something went wrong");
      }
      return;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  };

  // Delete Job
  const deleteJob = async (id) => {
    const storedUserData = JSON.parse(localStorage.getItem("user"));
    console.log("DELETE CALL......", id);
    const res = await fetch(
      `https://express-job-api.onrender.com/api/v1/jobs/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedUserData["token"]}`,
        },
      }
    );
    console.log("DELETE CALL......", res);
    // const res = await fetch(`/api/jobs/${id}`, {
    //   method: "DELETE",
    // });
    return;
  };

  // Update Job
  const updateJob = async (job) => {
    const storedUserData = JSON.parse(localStorage.getItem("user"));
    const res = await fetch(
      `https://express-job-api.onrender.com/api/v1/jobs/${job.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedUserData["token"]}`,
        },
        body: JSON.stringify(job),
      }
    );
    console.log("Update job request....", JSON.stringify(job));
    console.log("Update job....", res);
    return;
  };

  const handleLogin = (userData) => {
    // Save user data in localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const applyJob = async (jobApplicant) => {
    try {
      const storedUserData = JSON.parse(localStorage.getItem("user"));
      console.log("stored toke data is ..........", storedUserData["token"]);
      const res = await fetch(
        "https://express-job-api.onrender.com/api/v1/jobs/apply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedUserData["token"]}`,
          },
          body: JSON.stringify(jobApplicant),
        }
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Something went wrong");
      }
      return;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  };
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout user={user} setUser={setUser} />}>
        <Route path="/login" element={<LoginRegisterPage />} />
        <Route path="/register" element={<LoginRegisterPage />} />

        <Route
          index
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-job"
          element={
            <PrivateRoute>
              {" "}
              <AddJobPage addJobSubmit={addJob} />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-job/:id"
          element={
            <PrivateRoute>
              {" "}
              <EditJobPage updateJobSubmit={updateJob} />{" "}
            </PrivateRoute>
          }
          loader={jobLoader}
        />
        <Route
          path="/jobs/:id/:userid"
          element={
            <PrivateRoute>
              {" "}
              <JobPage deleteJob={deleteJob} applyjob={applyJob} />{" "}
            </PrivateRoute>
          }
          loader={jobLoader}
        />
        <Route
          path="/jobs"
          element={
            <PrivateRoute>
              {" "}
              <JobsPage />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <PrivateRoute>
              {" "}
              <JobPage />
            </PrivateRoute>
          }
          loader={jobLoader}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
};

export default App;
