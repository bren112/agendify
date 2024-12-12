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
                    <button id='agendar'>Meu Horário</button>
                </div>
        </div>
        </>
    )
}
export default Home;