import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabase'; // Certifique-se de importar sua instância do Supabase
import { useNavigate } from 'react-router-dom'; // Substitua useHistory por useNavigate
import './agendar.css'; // Importação do CSS
import img from './img.png'
function Agendar() {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Substituto para redirecionamento

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Recupera o id do usuário do localStorage

    if (userId) {
      const fetchUserName = async () => {
        try {
          const { data, error } = await supabase
            .from('usuarios') // Substitua pelo nome da tabela correta
            .select('nome') // Coluna que contém o nome do usuário
            .eq('id', userId) // Filtra pelo id do usuário
            .single(); // Espera apenas um resultado

          if (error) {
            console.error('Erro ao buscar nome:', error);
          } else if (data) {
            setUserName(data.nome); // Configura o nome do usuário
          }
        } catch (err) {
          console.error('Erro ao acessar o banco de dados:', err);
        } finally {
          setLoading(false); // Finaliza o carregamento
        }
      };

      fetchUserName();
    } else {
      setLoading(false); // Finaliza o carregamento se o ID não for encontrado
    }
  }, []);

  const handleLogout = () => {
    // Limpa o localStorage
    localStorage.removeItem('userId');
    
    // Redireciona para a página de login
    navigate('/login'); // Use o useNavigate para redirecionar
  };

  if (loading) {
    return <p>Carregando...</p>; // Exibe um estado de carregamento
  }

  return (
    <div className="agendar">
       <div className="user">
            <img src={img} alt="" srcset="" />
            <h1>{userName || 'Usuário'}</h1>
            </div>
      <button onClick={handleLogout} className="logout-button">
        Sair
      </button>
    </div>
  );
}

export default Agendar;
