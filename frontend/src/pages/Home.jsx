import { useRef, useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar.jsx";
import Form from "../components/Form/Form.jsx";
import Dashboard from "../components/Dashboard.jsx";
import Toolbar from "../components/Tools/Toolbar.jsx";
import JobList from "../components/JobList/Joblist.jsx";
import Pagination from "../components/Pagination.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./Home.css"

function Home() {
  const navigate = useNavigate();
  const [, removeCookie] = useCookies(["token"]);
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
  const [sortOrder, setSortOrder] = useState("recent");
  const [debouncedSearchItem, setDebouncedSearchItem] = useState("");
  const [status, setStatus] = useState("All");
  const [showJobModal, setShowJobModal] = useState(false);

  const fetchJobs = useCallback(async () => {
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
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Unable to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchItem, sortOrder, status]);
  const [stats, SetStats] = useState({
    interested: 0,
    applied: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
  })

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:3000/jobs/stats`,
        { withCredentials: true, }
      );
      SetStats(res.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await axios.get(
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
  useEffect(() => {
  const originalOverflow = document.body.style.overflow;

  if (showJobModal) {
    document.body.style.overflow = "hidden";
  }

  return () => {
    document.body.style.overflow = originalOverflow;
  };
}, [showJobModal]);

  return (
    <>
      <Navbar removeCookie={removeCookie} navigate={navigate}></Navbar>
      <Dashboard
        jobList={jobList}
        stats={stats}
        setEditingIndex={setEditingIndex}
        setFormData={setFormData}
        setShowJobModal={setShowJobModal}
      />
      {showJobModal && (
  <div
    className="job-modal-overlay"
    onClick={() => setShowJobModal(false)}
  >
    <div
      className="job-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <Form
        jobList={jobList}
        setJobList={setJobList}
        editingIndex={editingIndex}
        setEditingIndex={setEditingIndex}
        formData={formData}
        setFormData={setFormData}
        fetchJobs={fetchJobs}
        refreshData={refreshData}
        onClose={() => setShowJobModal(false)}
      />
    </div>
  </div>
)}
      <Toolbar
        setDebouncedSearchItem={setDebouncedSearchItem}
        debouncedSearchItem={debouncedSearchItem}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        status={status}
        setStatus={setStatus}
        setCurrentPage={setCurrentPage}
      ></Toolbar>
      <JobList
        jobList={jobList}
        currentJobs={currentJobs}
        setFormData={setFormData}
        setEditingIndex={setEditingIndex}
        jobRef={jobRef}
        error={error}
        loading={loading}
        refreshData={refreshData}
        setShowJobModal={setShowJobModal}
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
