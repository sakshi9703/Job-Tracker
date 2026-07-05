import { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Form from "../components/Form/Form.jsx";
import Dashboard from "../components/Dashboard.jsx";
import Toolbar from "../components/Tools/Toolbar.jsx";
import JobList from "../components/JobList/Joblist.jsx";
import Pagination from "../components/Pagination.jsx";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import { Login, Signup } from "../pages";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Analytics from "../components/Analytics/Analytics.jsx";

function Home() {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["token"]);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "",
    description: "",
    date: "",
    location: "",
    notes: ""
  });

  const [jobList, setJobList] = useState([]);

  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true);

  const [sortOrder, setSortOrder] = useState("newest");

  const [debouncedSearchItem, setDebouncedSearchItem] = useState("");

  const [status, setStatus] = useState("All");

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:3000/jobs", {
        params: {
          search: debouncedSearchItem,
          status,
          sort: sortOrder,
        },
        withCredentials: true,
      });

      setJobList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const [stats, SetStats] = useState({
    interested: 0,
    applied: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
  })

  const fetchStats = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/jobs/stats`,
        { withCredentials: true, }
      );
      SetStats(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, [sortOrder, status, debouncedSearchItem]);

  useEffect(() => {
    fetchStats();
    fetchJobs();
  }, [sortOrder]);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/verify",
          { withCredentials: true }
        );
      } catch (err) {
        console.log(err);
      }
    };

    verifyUser();
  }, []);


  const refreshData = async () => {
    await fetchJobs();
    await fetchStats();
  }

  const [editingIndex, setEditingIndex] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const jobsperPage = 5;

  const indexofLastJob = currentPage * jobsperPage;
  const indexofFirstJob = indexofLastJob - jobsperPage;

  useEffect(() => {
    setCurrentPage(1);
  }, [status, debouncedSearchItem]);

  const currentJobs = jobList.slice(indexofFirstJob, indexofLastJob);
  const totalPages = Math.ceil(jobList.length / jobsperPage);

  const jobRef = useRef(null);
  const formRef = useRef(null);

  const scrollToJobs = () => {
    jobRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }


  return (
    <>
      <Navbar removeCookie={removeCookie} navigate={navigate}></Navbar>
      <Dashboard jobList={jobList} status={status} setStatus={setStatus} scrollToJobs={scrollToJobs} stats={stats} />
      <Form
        jobList={jobList}
        setJobList={setJobList}
        editingIndex={editingIndex}
        setEditingIndex={setEditingIndex}
        formData={formData}
        setFormData={setFormData}
        formRef={formRef}
        fetchJobs={fetchJobs}
        refreshData={refreshData}
      ></Form>
      <Toolbar
        setDebouncedSearchItem={setDebouncedSearchItem}
        debouncedSearchItem={debouncedSearchItem}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        status={status}
        setStatus={setStatus}
        setJobList={setJobList}
        setCurrentPage={setCurrentPage}
      ></Toolbar>
      <JobList
        setJobList={setJobList}
        jobList={jobList}
        currentJobs={currentJobs}
        setFormData={setFormData}
        setEditingIndex={setEditingIndex}
        scrollToForm={scrollToForm}
        jobRef={jobRef}
        fetchJobs={fetchJobs}
        error={error}
        loading={loading}
        refreshData={refreshData}
      ></JobList>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      ></Pagination>
    </>
  );
}

export default Home;