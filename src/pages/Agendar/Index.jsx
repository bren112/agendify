import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabase'; 
import { useNavigate } from 'react-router-dom';
import './agendar.css';
import img from './img.png';
import corpo from './corpo.png';

function Agendar() {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false); 
  const [queueStatus, setQueueStatus] = useState(null); 
  const [approvedList, setApprovedList] = useState([]); 
  const [showModal, setShowModal] = useState(false); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const navigate = useNavigate();

  const fetchData = async () => {
    const userId = localStorage.getItem('userId');

    if (userId) {
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

        // Buscar a lista de todos os aprovados com os dados dos usuários
        const { data: approvedListData, error: approvedListError } = await supabase
          .from('fila_aprovados')
          .select('posicao, fk_user_id')
          .order('posicao', { ascending: true });

        if (approvedListError) throw approvedListError;

        // Obter os dados de cada usuário na lista de aprovados e adicionar um número sequencial
        const usersWithNames = await Promise.all(
          approvedListData.map(async (item, index) => {
            const { data: userData, error: userError } = await supabase
              .from('usuarios')
              .select('nome')
              .eq('id', item.fk_user_id)
              .single();
            if (userError) throw userError;
            return {
              posicao: index + 1, 
              nome: userData.nome,
            };
          })
        );

        setApprovedList(usersWithNames);

      } catch (err) {
        console.error('Erro ao acessar o banco de dados:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login'); // Redireciona para a página de login se não estiver logado
      return;
    }
  
    fetchData();

    // Atualizar os dados a cada 15 segundos
    const intervalId = setInterval(fetchData, 15000);

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
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
      }
    } catch (err) {
      console.error('Erro ao atualizar a fila:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const closeModalIfClickedOutside = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      setShowModal(false);
    }
  };

  const filteredList = approvedList.filter(user =>
    user.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const refreshPage = () => {
    window.location.reload(); // Atualiza a página quando clicado
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="pai">
      <div className="agendar">
        <div className="esq">
          <div className="user">
            <img src={img} alt="Usuário" />
            <h1>Olá, {userName || 'Usuário'}</h1>
          </div>
          <button id='refresh' onClick={refreshPage} className="refresh-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
</svg>
          </button>
        </div>
        <button id='button' onClick={handleLogout} className="logout-button">
          Sair
        </button>
      </div>
      <div className="corpo">
        {isApproved ? (
          <div className="sobre">
            <h1 id="titulo">CORTE COM O MELHOR 💈</h1>
            <img src={corpo} alt="" />
            <br />
            <p className="approved-message">Você está na Fila!</p>
            <br />
            <button onClick={toggleModal} id='mbtn' className="view-queue-button">
              Ver meu Lugar!
            </button>
            <br />
            <br />
            <br />
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

      {/* Modal para exibir a lista de aprovados */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModalIfClickedOutside}>
          <div className="modal-content">
            <h2>Fila de Aprovados</h2>
            <button onClick={toggleModal} className="close-button">X</button>
            <input
              type="text"
              placeholder="Busque seu Nome!"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {filteredList.length === 0 ? (
              <p>Nenhum usuário aprovado.</p>
            ) : (
              <table id='tabela_user' className="approved-table">
                <thead>
                  <tr>
                    <th>Posição</th>
                    <th>Nome</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((user, index) => (
                    <tr id='mytr' key={index}>
                      <td>{user.posicao}</td>
                      <td>{user.nome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Agendar;
