import './Home.css';
import img from './jhonny.png'
function Home(){
    return(
        <>
        <div className="home">
                <div className="img">
                    <img src={img} alt="" srcset="" />
                </div>

                <div className="buttons">
                    <button id='login'>Login</button>
                    <button id='agendar'>Meu Horário</button>
                </div>
        </div>
        </>
    )
}
export default Home;