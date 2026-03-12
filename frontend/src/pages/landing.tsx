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
                <button
                    onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
                    className="w-full px-4 py-2 bg-white text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                    >
                    Continue with Google
                </button>
            </div>
        </div>
    )
}