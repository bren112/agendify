import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabase';
import './aprovados.css'; // Arquivo CSS opcional para estilos

function Aprovados() {
  const [approvedQueue, setApprovedQueue] = useState([]); // Lista de usuários aprovados
  const [loading, setLoading] = useState(true);

  // Função para buscar dados da fila de aprovados
  const fetchApprovedQueue = async () => {
    try {
      const { data, error } = await supabase
        .from('fila_aprovados')
        .select('id, fk_user_id, usuarios(nome)')
        .order('id', { ascending: true }); // Ordenar por ID

      if (error) throw error;

      setApprovedQueue(data || []); // Atualiza o estado com os dados da fila de aprovados
    } catch (err) {
      console.error('Erro ao buscar fila de aprovados:', err);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  useEffect(() => {
    fetchApprovedQueue();
  }, []);

  // Função para mover o usuário de volta para a fila pendente
  const handleDisapprove = async (userId, approvalId) => {
    try {
      // Adiciona o usuário de volta à fila pendente
      const { error: insertError } = await supabase
        .from('fila_pendente')
        .insert([{ fk_user_id: userId, status: false }]);

      if (insertError) throw insertError;

      // Remove o usuário da fila de aprovados
      const { error: deleteError } = await supabase
        .from('fila_aprovados')
        .delete()
        .eq('id', approvalId);

      if (deleteError) throw deleteError;

      // Atualiza a lista localmente
      setApprovedQueue((prev) => prev.filter((user) => user.id !== approvalId));
    } catch (err) {
      console.error('Erro ao desaprovar usuário:', err);
    }
  };

  // Função para remover o usuário da fila de aprovados (Feito)
  const handleDone = async (approvalId) => {
    try {
      const { error } = await supabase
        .from('fila_aprovados')
        .delete()
        .eq('id', approvalId);

      if (error) throw error;

      // Atualiza a lista localmente
      setApprovedQueue((prev) => prev.filter((user) => user.id !== approvalId));
    } catch (err) {
      console.error('Erro ao remover usuário da fila de aprovados:', err);
    }
  };

  if (loading) {
    return <p>Carregando...</p>; // Exibe enquanto os dados são carregados
  }

  return (
    <div className="aprovados">
      <h1>Lista de Aprovados</h1>
      {approvedQueue.length === 0 ? (
        <p>Nenhum usuário aprovado.</p>
      ) : (
        <table className="approved-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {approvedQueue.map((user) => (
              <tr key={user.id}>
                <td>{user.usuarios.nome}</td>
                <td>
                  <button
                    className="disapprove-button"
                    onClick={() => handleDisapprove(user.fk_user_id, user.id)}
                  >
                    Desaprovar
                  </button>
                  <button
                    className="done-button"
                    onClick={() => handleDone(user.id)}
                  >
                    Feito
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

export default Aprovados;
