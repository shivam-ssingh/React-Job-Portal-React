import React, { useContext, useState } from "react";
import { FaArrowLeft, FaMapMarker } from "react-icons/fa";
import { useParams, useLoaderData, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../components/UserContext";

const JobPage = ({ deleteJob, applyjob }) => {
  const { user, logout } = useContext(UserContext);
  const [applyForJob, setApplyForJob] = useState(false);
  const [resumeLink, setResumeLink] = useState("");
  const navigate = useNavigate();

  const { id } = useParams();

  const loaderData = useLoaderData();
  if (loaderData == "unauthorized") {
    logout();
    navigate("/login");
  }
  const job = loaderData.job || {};
  const isUserApplied = loaderData.userPresent || false;
  console.log("user present.........", isUserApplied);

  console.log("job page data.....", job);
  const isEmployer =
    user && user["profile"]["userRole"] === "Employer" ? true : false;
  console.log("isEmployer", isEmployer);

  const onDeleteClick = async (jobId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirm) return;

    await deleteJob(jobId);

    toast.success("Job deleted successfully");

    navigate("/jobs");
  };

  const onApplyJobClick = async (jobId) => {
    const applicant = {
      jobId,
      resumeLink,
    };

    try {
      await applyjob(applicant);
      toast.success("Job Applied Successfully");
      return navigate("/jobs");
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <>
      <section>
        <div className="container m-auto py-6 px-6">
          <Link
            to="/jobs"
            className="text-indigo-500 hover:text-indigo-600 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Job Listings
          </Link>
        </div>
      </section>

      <section className="bg-indigo-50">
        <div className="container m-auto py-10 px-6">
          <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
            <main>
              <div className="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
                <div className="text-gray-500 mb-4">{job.type}</div>
                <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
                <div className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
                  <FaMapMarker className="text-orange-700 mr-1" />
                  <p className="text-orange-700">{job.location}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h3 className="text-indigo-800 text-lg font-bold mb-6">
                  Job Description
                </h3>

                <p className="mb-4">{job.description}</p>

                <h3 className="text-indigo-800 text-lg font-bold mb-2">
                  Salary
                </h3>

                <p className="mb-4">{job.salary} / Year</p>
              </div>
            </main>

            {/* <!-- Sidebar --> */}
            <aside>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-6">Company Info</h3>

                <h2 className="text-2xl">{job.company.name}</h2>

                <p className="my-2">{job.company.description}</p>

                <hr className="my-4" />

                <h3 className="text-xl">Contact Email:</h3>

                <p className="my-2 bg-indigo-100 p-2 font-bold">
                  {job.company.contactEmail}
                </p>

                <h3 className="text-xl">Contact Phone:</h3>

                <p className="my-2 bg-indigo-100 p-2 font-bold">
                  {" "}
                  {job.company.contactPhone}
                </p>
              </div>
              {/* hide the below from candidates */}
              <div
                className={
                  isEmployer
                    ? "bg-white p-6 rounded-lg shadow-md mt-6"
                    : "hidden"
                }
              >
                <h3 className="text-xl font-bold mb-6">Manage Job</h3>
                <Link
                  to={`/edit-job/${job._id}`}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                >
                  Edit Job
                </Link>
                <button
                  onClick={() => onDeleteClick(job._id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                >
                  Delete Job
                </button>
              </div>
              <div
                className={
                  !isEmployer && !isUserApplied
                    ? "bg-white p-6 rounded-lg shadow-md mt-6"
                    : "hidden"
                }
              >
                <h3 className="text-xl font-bold mb-6">Apply Job</h3>
                <button
                  onClick={() => setApplyForJob((prevState) => !prevState)}
                  className="text-indigo-500 mb-5 hover:text-indigo-600"
                >
                  Apply.
                </button>
                <div className={applyForJob ? "" : "hidden"}>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Resume Link
                  </label>
                  <input
                    value={resumeLink}
                    onChange={(e) => setResumeLink(e.target.value)}
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                  <button
                    onClick={() => onApplyJobClick(job._id)}
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Submit
                  </button>
                </div>
                {/* <Link
                  to={`/apply-job/${user.profile.id}/${job.id}`}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                >
                  Apply For Job
                </Link> */}
              </div>
              <h1
                className={
                  !isEmployer && isUserApplied
                    ? "bg-white p-6 rounded-lg shadow-md mt-6"
                    : "hidden"
                }
              >
                You've already applied
              </h1>
              {/* <div
                className={
                  isEmployer && isUserApplied
                    ? "bg-white p-6 rounded-lg shadow-md mt-6"
                    : "hidden"
                }
              >
              </div> */}
            </aside>
          </div>
        </div>
      </section>
    </>
  );

  // const [job, setJob] = useState({});
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchJobs = async () => {
  //     try {
  //       const res = await fetch(`/api/jobs/${id}`);
  //       console.log(res);
  //       const data = await res.json();
  //       console.log(data);
  //       setJob(data);
  //     } catch (error) {
  //       console.log("Error getting data", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchJobs();
  // }, []);

  // return loading ? <Spinner loading={loading} /> : <h1>{job.title}</h1>;
};

const jobLoader = async ({ params }) => {
  const storedUserData = JSON.parse(localStorage.getItem("user"));
  const res = await fetch(
    `https://express-job-api.onrender.com/api/v1/jobs/${params.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedUserData["token"]}`,
      },
    }
  );
  if (!res.ok && res.status == 401) {
    return "unauthorized";
  }
  const data = await res.json();
  return data;
};

export { JobPage as default, jobLoader };
