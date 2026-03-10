
import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { recentJobs } from "../services/apis";

export default function DashboardPage() {
    const navigate = useNavigate()

    return (
        <div className="">
            <div className="relative flex items-center justify-center p-4 margin-bottom 30">
                <h1 className="text-xl font-medium">Dashboard</h1>
                <Link to={"/account"} className="absolute right-4 text-sm text-gray-400 hover:text-white transition">
                    Account
                </Link>
            </div>
            <RecentJobs />

            <div>
                <button onClick={() => navigate('/add-job')}>Add job</button>
                <button onClick={() => navigate('/all-jobs')}>View all jobs</button>
            </div>
        </div>
    )
}



function RecentJobs() {

    const [allJobs, setAllJobs] = useState([]);

    useEffect(() => {
        recentJobs().then(data => {setAllJobs(data)})
        console.log(allJobs)

    }, [])

    return (
        <div className="flex flex-col items-center justify-center ">
            <h2 className="text-lg font-medium">Recent Jobs</h2>

            {allJobs.map((job: any) => (
                <div key={job.id} className={"flex flex-row items-center justify-start gap-10"}>
                    <h3 >{job.position_name}</h3>
                    <p >{job.company}</p>
                    <p >{job.location}</p>
                    <p >£{job.salary}</p>
                </div>
            ))}
            
        </div>
    )

}