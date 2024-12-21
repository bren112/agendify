import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabase'; // Certifique-se de importar sua instância do Supabase
import { useNavigate } from 'react-router-dom';
import './agendar.css';
import img from './img.png';
import corpo from './corpo.png'
function Agendar() {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [queueStatus, setQueueStatus] = useState(null); // Estado do status da fila pendente
  const [isApproved, setIsApproved] = useState(false); // Estado para verificar se está aprovado
  const [queuePosition, setQueuePosition] = useState(null); // Posição do usuário na fila
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (userId) {
      const fetchUserData = async () => {
        try {
          // Buscar nome do usuário
          const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('nome')
            .eq('id', userId)
            .single();

          if (userError) throw userError;

          setUserName(userData.nome);

          // Verificar se o usuário está na fila de aprovados
          const { data: approvedData, error: approvedError } = await supabase
            .from('fila_aprovados')
            .select('id')
            .eq('fk_user_id', userId)
            .single();

          if (approvedError && approvedError.code !== 'PGRST116') throw approvedError;
          setIsApproved(!!approvedData);

          // Buscar status da fila pendente e posição na fila
          if (!approvedData) {
            const { data: queueData, error: queueError } = await supabase
              .from('fila_pendente')
              .select('id, status, created_at')
              .eq('fk_user_id', userId)
              .single();

            if (queueError && queueError.code !== 'PGRST116') throw queueError;

            setQueueStatus(queueData?.status ?? null);

            if (queueData) {
              // Contar quantas pessoas estão na fila antes do usuário
              const { data: queueCount, error: countError } = await supabase
                .from('fila_pendente')
                .select('id', { count: 'exact' })
                .lt('created_at', queueData.created_at); // Pessoas antes na fila

              if (countError) throw countError;

              setQueuePosition(queueCount?.length || 0);
            }
          }
        } catch (err) {
          console.error('Erro ao acessar o banco de dados:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleEnterQueue = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      if (queueStatus === null) {
        const { error } = await supabase
          .from('fila_pendente')
          .insert([{ fk_user_id: userId, status: false }]);

        if (error) throw error;

        setQueueStatus(false);
      } else if (queueStatus === false) {
        const { error } = await supabase
          .from('fila_pendente')
          .delete()
          .eq('fk_user_id', userId);

        if (error) throw error;

        setQueueStatus(null);
        setQueuePosition(null);
      }
    } catch (err) {
      console.error('Erro ao atualizar a fila:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="pai">
      <div className="agendar">
        <div className="user">
          <img src={img} alt="Usuário" />
          <h1>Olá, {userName || 'Usuário'}</h1>
        </div>

        <button onClick={handleLogout} className="logout-button">
          Sair
        </button>
      </div>
      <div className="corpo">
      
        {isApproved ? (
          <div className='sobre'>
            <h1 id='titulo'>CORTE COM O MELHOR 💈</h1>
            <br/>
            <img src={corpo} alt="" srcset="" />
            <br/>
            <br/>
            <p className="approved-message">Você está na Fila!</p>
            {queuePosition > 0 ? (
              <p className="queue-info">{queuePosition} pessoas estão na sua frente.</p>
            ) : (
              <p className="queue-info">Você é o Próximo!</p>
            )}
          </div>
        ) : queueStatus === null ? (
          <button onClick={handleEnterQueue} className="enter-button">
            Entrar na Fila
          </button>
        ) : (
          <button
            onClick={handleEnterQueue}
            className={`queue-button ${queueStatus ? 'queue-true' : 'queue-false'}`}
          >
            {queueStatus ? 'Na Fila' : 'Remover Solicitação'}
          </button>
        )}
      </div>
    </div>
  );
}

export default Agendar;
