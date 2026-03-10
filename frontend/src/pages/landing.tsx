import { useNavigate } from 'react-router-dom'


export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <div>
            <h1>Job Tracker</h1>
            <h3>Keep ontop of your job hunt</h3>

            <div>
                <button onClick={() => navigate("/signup")}>Get started</button>
                <button onClick={() => navigate("/login")}>Login</button>
            </div>
        </div>
    )
}