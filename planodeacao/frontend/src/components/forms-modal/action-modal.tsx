import { useState, useEffect } from "react";
import BaseModal from "./modal";
import Button from "../ui/button";

interface ActionFormData {
  acao: string;
  prazo: string;
  status?: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA';
}

function ActionModal({ isOpen, onClose, onSubmit, isLoading }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ActionFormData) => void;
  isLoading: boolean;
}) {
  const [acao, setAcao] = useState('');
  const [prazo, setPrazo] = useState('');
  const [status, setStatus] = useState<'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA'>('PENDENTE');

  const [errors, setErrors] = useState({
    acao: '',
    prazo: ''
  });

  useEffect(() => {
    if (isOpen) {
      setAcao('');
      setPrazo('');
      setStatus('PENDENTE');
      setErrors({ acao: '', prazo: '' });
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {
      acao: '',
      prazo: ''
    };

    if (!acao.trim()) {
      newErrors.acao = 'Descrição da ação é obrigatória';
    }

    if (!prazo.trim()) {
      newErrors.prazo = 'Prazo é obrigatório';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({ acao, prazo, status });
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Nova Ação">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div >
          <label htmlFor="acao" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição da Ação
          </label>
          <input
            type="text"
            id="acao"
            placeholder="Descrição da ação"
            value={acao}
            onChange={e => {
              setAcao(e.target.value);
              if (errors.acao) setErrors(prev => ({ ...prev, acao: '' }));
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.acao ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.acao && (
            <p className="mt-1 text-sm text-red-600">{errors.acao}</p>
          )}
        </div>

        <div>
          <label htmlFor="prazo" className="block text-sm font-medium text-gray-700 mb-1">
            Prazo
          </label>
          <input
            type="date"
            id="prazo"
            value={prazo}
            onChange={e => {
              setPrazo(e.target.value);
              if (errors.prazo) setErrors(prev => ({ ...prev, prazo: '' }));
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.prazo ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.prazo && (
            <p className="mt-1 text-sm text-red-600">{errors.prazo}</p>
          )}
        </div>

        

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            variant="success"
            className="flex-1 px-4 py-2 text-white rounded-lg "
          >
            {isLoading ? 'Salvando...' : 'Salvar Ação'}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}

export default ActionModal;