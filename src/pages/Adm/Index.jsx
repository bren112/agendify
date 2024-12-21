import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabase';
import './adm.css'; // Certifique-se de criar um arquivo de estilo, se necessário
import { Link } from 'react-router-dom';

function Adm() {
  const [pendingQueue, setPendingQueue] = useState([]); // Lista de usuários na fila pendente
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const handleApprove = async (userId, queueId) => {
    try {
      // Buscar a última posição na tabela fila_aprovados
      const { data: approvedData, error: fetchError } = await supabase
        .from('fila_aprovados')
        .select('posicao')
        .order('posicao', { ascending: false }) // Ordenar por posição de forma decrescente
        .limit(1); // Pegamos o primeiro registro (o maior)

      if (fetchError) throw fetchError;

      // Se não houver registros, a posição será 1, caso contrário, +1 da maior posição
      const nextPosition = approvedData.length === 0 ? 1 : approvedData[0].posicao + 1;

      // Adicionar o usuário na tabela fila_aprovados com a posição calculada
      const { error: insertError } = await supabase
        .from('fila_aprovados')
        .insert([{ fk_user_id: userId, posicao: nextPosition }]);

      if (insertError) throw insertError;

      // Remover o usuário da tabela fila_pendente
      const { error: deleteError } = await supabase
        .from('fila_pendente')
        .delete()
        .eq('id', queueId);

      if (deleteError) throw deleteError;

      // Atualizar a lista da fila pendente
      setPendingQueue((prevQueue) =>
        prevQueue.filter((user) => user.id !== queueId)
      );
    } catch (err) {
      console.error('Erro ao aprovar usuário:', err);
    }
  };

  const handleDisapprove = async (queueId) => {
    try {
      // Remover o usuário da tabela fila_pendente
      const { error } = await supabase
        .from('fila_pendente')
        .delete()
        .eq('id', queueId);

      if (error) throw error;

      // Atualizar a lista da fila pendente
      setPendingQueue((prevQueue) =>
        prevQueue.filter((user) => user.id !== queueId)
      );
    } catch (err) {
      console.error('Erro ao desaprovar usuário:', err);
    }
  };

  if (loading) {
    return <p>Carregando...</p>; // Exibe enquanto os dados são carregados
  }

  return (
    <div className="adm">
      <Link to='/aprovados'>
        <button>Aprovados</button>
      </Link>
      <h1>Administração - Fila Pendente</h1>
      {pendingQueue.length === 0 ? (
        <p>Nenhum usuário na fila pendente.</p>
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
