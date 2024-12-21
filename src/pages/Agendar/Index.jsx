import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabase'; // Certifique-se de importar sua instância do Supabase
import { useNavigate } from 'react-router-dom';
import './agendar.css';
import img from './img.png';
import corpo from './corpo.png';

function Agendar() {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false); // Se o usuário está aprovado
  const [queueStatus, setQueueStatus] = useState(null); // Status da fila (pendente ou aprovado)
  const [approvedList, setApprovedList] = useState([]); // Lista de aprovados
  const [showModal, setShowModal] = useState(false); // Controle do modal
  const [searchQuery, setSearchQuery] = useState(''); // Estado para o campo de busca
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
                posicao: index + 1, // Atribui um número sequencial (1, 2, 3, ...)
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
        // Inserir o usuário na fila pendente
        const { error } = await supabase
          .from('fila_pendente')
          .insert([{ fk_user_id: userId, status: false }]); // Inserir na fila pendente

        if (error) throw error;

        setQueueStatus(false);
      } else if (queueStatus === false) {
        // Remover o usuário da fila pendente
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
          <div className="sobre">
            <h1 id="titulo">CORTE COM O MELHOR 💈</h1>
            <img src={corpo} alt="" />
            <br/>

            <p className="approved-message">Você está na Fila!</p>

            <br/>
            <button onClick={toggleModal} id='mbtn' className="view-queue-button">
              Ver Meu Lugar
            </button>
            <br/>
            <br/>
            <br/>
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
