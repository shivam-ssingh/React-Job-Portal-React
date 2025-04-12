import { React, useState, useEffect, useContext } from "react";
import JobListing from "./JobListing";
import Spinner from "./Spinner";
import { UserContext } from "./UserContext";

const JobListings = ({ isHome = false }) => {
  const { user, logout } = useContext(UserContext);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const storedUserData = JSON.parse(localStorage.getItem("user"));
      // const apiUrl = isHome ? "/api/jobs?_limit=3" : "/api/jobs";
      const apiUrl = isHome
        ? "https://express-job-api.onrender.com/api/v1/jobs?limit=3"
        : "https://express-job-api.onrender.com/api/v1/jobs";
      try {
        console.log("calling api");
        const res = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedUserData["token"]}`,
          },
        });
        if (!res.ok) {
          if (res.status == 401) {
            logout();
            navigate("/login");
          }
          const error = await res.json();
          throw new Error(error.message || "Something went wrong");
        }
        const data = await res.json();
        console.log(data);
        setJobs(data.jobs);
      } catch (error) {
        setJobs([]);
        console.log("Error getting data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  //   const jobListings = isHome ? jobs.slice(0, 3) : jobs;
  return (
    <section className="bg-blue-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
          {isHome ? "Recent Jobs" : "Browse Jobs"}
        </h2>
        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobListing key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default JobListings;
