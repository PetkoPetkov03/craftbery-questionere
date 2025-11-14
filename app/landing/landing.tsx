import { Link } from "react-router"
import "./landing.css"
import Container from "~/assets/components/Container"

const Landing = () => {
  return (
    <Container>
      <div className="quiz-portal">
            <div className="title-container">
                <h1>Build a self care routine suitable for you</h1>
                <p>Take out test to get a personalised self care routine based on your needs.</p>
            </div>

            <Link className="quiz-button" to={{
                pathname: "/quiz",
                search: "?question=1"
            }}>Start the quiz</Link>
        </div>
    </Container>
  )
}

export default Landing