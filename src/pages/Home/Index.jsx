import './Home.css';
import { Link } from 'react-router-dom';
import img from './jhonny.png'
function Home(){
    return(
        <>
        <div className="home">
                <div className="img">
                    <img src={img} alt="" srcset="" />
                </div>

                <div className="buttons">
                    <Link to='/login'>
                    <button id='login'>Login</button>
                    </Link>
                    <Link to='/agendar'>
                    <button id='agendar'>Agenda</button>
                    </Link>
                </div>
        </div>
        </>
    )
}
export default Home;