import React, { useState, useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/button';

interface ModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (data: { titulo: string; objetivo: string; data: string }) => void;
  title?: string;
  initialData?: {
    titulo: string;
    objetivo: string;
    data: string;
  };
  children?: ReactNode; 
}

function formatDateLocal(dateString: string) {
  return dateString.split('T')[0];
}

export default function Modal({ 
  isOpen, 
  isLoading,
  onClose, 
  onSubmit, 
  title = "Adicionar Informações",
  initialData
}: ModalProps) {
  const isEditMode = !!initialData;
  
  const [formData, setFormData] = useState({
    titulo: '',
    objetivo: '',
    data: initialData?.data ? initialData.data.split('T')[0] : ''
  });

  const [errors, setErrors] = useState({
    titulo: '',
    objetivo: '',
    data: ''
  });

 useEffect(() => {
  if (isOpen) {
    setFormData({
      titulo: initialData?.titulo || '',
      objetivo: initialData?.objetivo || '',
      data: initialData?.data ? formatDateLocal(initialData.data) : ''
    });
    setErrors({ titulo: '', objetivo: '', data: '' });
  }
}, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      titulo: '',
      objetivo: '',
      data: ''
    };

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }

    if (!formData.objetivo.trim()) {
      newErrors.objetivo = 'Objetivo é obrigatório';
    }

    if (!isEditMode && !formData.data.trim()) {
      newErrors.data = 'Data é obrigatória';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      titulo: '',
      objetivo: '',
      data: ''
    });
    setErrors({
      titulo: '',
      objetivo: '',
      data: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed backdrop-blur-sm inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0  bg-opacity-10 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.titulo ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Digite o título..."
            />
            {errors.titulo && (
              <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>
            )}
          </div>

          <div>
            <label htmlFor="objetivo" className="block text-sm font-medium text-gray-700 mb-1">
              Objetivo
            </label>
            <textarea
              id="objetivo"
              name="objetivo"
              value={formData.objetivo}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                errors.objetivo ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Descreva o objetivo..."
            />
            {errors.objetivo && (
              <p className="mt-1 text-sm text-red-600">{errors.objetivo}</p>
            )}
          </div>

          {!isEditMode && (
            <div>
              <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
                Data
              </label>
              <input
                type="date"
                id="data"
                name="data"
                value={formData.data}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.data ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.data && (
                <p className="mt-1 text-sm text-red-600">{errors.data}</p>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              variant="success"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Enviar
            </Button>
            
          </div>
        </form>
      </div>
    </div>
  );
};