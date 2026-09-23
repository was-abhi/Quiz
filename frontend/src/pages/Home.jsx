import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="home">
            <h1>Real-Time Quiz Competition</h1>
            <p>Quiz Competition Management System</p>

            <div className="home-buttons">
                <Link to="/judge">
                    <button>Judge Dashboard</button>
                </Link>

                <Link to="/audience">
                    <button>Audience View</button>
                </Link>
            </div>
        </div>
    );
}

export default Home;