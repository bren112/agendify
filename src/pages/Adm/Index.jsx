import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabase';
import './adm.css'; // Certifique-se de criar um arquivo de estilo, se necessário
import { Link, useNavigate } from 'react-router-dom';

function Adm() {
  const [pendingQueue, setPendingQueue] = useState([]); // Lista de usuários na fila pendente
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticação
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Substituindo useHistory por useNavigate

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    // Checar as credenciais
    if (username === 'jhonny123' && password === '123jhonny') {
      localStorage.setItem('auth_token', 'your-unique-token'); // Salva o token no localStorage
      setIsAuthenticated(true); // Define como autenticado
    } else {
      alert('Credenciais inválidas!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token'); // Remove o token
    setIsAuthenticated(false); // Define como não autenticado
    navigate('/adm'); // Usando navigate para redirecionar para a página inicial ou login
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchPendingQueue = async () => {
        try {
          const { data, error } = await supabase
            .from('fila_pendente')
            .select('id, fk_user_id, status, usuarios(nome)')
            .eq('status', false) // Filtrar apenas os que estão pendentes
            .order('id', { ascending: true }); // Ordenar por ID

          if (error) throw error;

          setPendingQueue(data || []); // Atualiza o estado com os dados da fila pendente
        } catch (err) {
          console.error('Erro ao buscar fila pendente:', err);
        } finally {
          setLoading(false); // Finaliza o carregamento
        }
      };

      fetchPendingQueue();
    }
  }, [isAuthenticated]);

  const handleApprove = async (userId, queueId) => {
    try {
      const { data: approvedData, error: fetchError } = await supabase
        .from('fila_aprovados')
        .select('posicao')
        .order('posicao', { ascending: false }) // Ordenar por posição de forma decrescente
        .limit(1); // Pegamos o primeiro registro (o maior)

      if (fetchError) throw fetchError;

      const nextPosition = approvedData.length === 0 ? 1 : approvedData[0].posicao + 1;

      const { error: insertError } = await supabase
        .from('fila_aprovados')
        .insert([{ fk_user_id: userId, posicao: nextPosition }]);

      if (insertError) throw insertError;

      const { error: deleteError } = await supabase
        .from('fila_pendente')
        .delete()
        .eq('id', queueId);

      if (deleteError) throw deleteError;

      setPendingQueue((prevQueue) => prevQueue.filter((user) => user.id !== queueId));
    } catch (err) {
      console.error('Erro ao aprovar usuário:', err);
    }
  };

  const handleDisapprove = async (queueId) => {
    try {
      const { error } = await supabase
        .from('fila_pendente')
        .delete()
        .eq('id', queueId);

      if (error) throw error;

      setPendingQueue((prevQueue) => prevQueue.filter((user) => user.id !== queueId));
    } catch (err) {
      console.error('Erro ao desaprovar usuário:', err);
    }
  };

  if (!isAuthenticated) {
    // Exibe o formulário de login se o usuário não estiver autenticado
    return (
      <div className="login-container">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Entrar</button>
      </div>
    );
  }

  if (loading) {
    return <p>Carregando...</p>; // Exibe enquanto os dados são carregados
  }

  return (
    <div className="adm">
      <div className="botoes">
      <button id='button' onClick={handleLogout}>Sair</button>
      <Link to='/aprovados'>
        <button id='meuLink'>Ver Clientes de Hoje</button>
        
      </Link>
      </div>
      
      <br /> <br />
      <h1 id='titulo'>SUAS SOLICITAÇÕES! 💈</h1>
      <h1>Administração - Fila Pendente</h1>
      {pendingQueue.length === 0 ? (
        <p>Nenhum Solicitação até agora...</p>
      ) : (
        <table className="queue-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pendingQueue.map((user) => (
              <tr key={user.id}>
                <td>{user.usuarios.nome}</td>
                <td>
                  <button
                    onClick={() => handleApprove(user.fk_user_id, user.id)}
                    className="approve-button"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => handleDisapprove(user.id)}
                    className="disapprove-button"
                  >
                    Desaprovar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Adm;
