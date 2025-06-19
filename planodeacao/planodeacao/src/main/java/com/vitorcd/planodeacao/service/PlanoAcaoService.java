package com.vitorcd.planodeacao.service;

import com.vitorcd.planodeacao.dto.PlanoAcaoDTO;
import com.vitorcd.planodeacao.entity.PlanoAcao;
import com.vitorcd.planodeacao.enums.StatusPlano;
import com.vitorcd.planodeacao.exception.ResourceNotFoundException;
import com.vitorcd.planodeacao.repositories.PlanoAcaoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class PlanoAcaoService {

    @Autowired
    private PlanoAcaoRepository planoAcaoRepository;

    public List<PlanoAcao> findAll() {
        return planoAcaoRepository.findAllWithAcoes();
    }

    public PlanoAcao findById(Long id) {
        PlanoAcao plano = planoAcaoRepository.findByIdWithAcoes(id);
        if (plano == null) {
            throw new ResourceNotFoundException("Plano de Ação não encontrado com ID: " + id);
        }

        return plano;
    }

    public PlanoAcao create(PlanoAcaoDTO planoDTO) {
        PlanoAcao plano = new PlanoAcao();

        plano.setTitulo(planoDTO.getTitulo());
        plano.setObjetivo(planoDTO.getObjetivo());
        plano.setData(planoDTO.getData());
        plano.setStatus(StatusPlano.PENDENTE);

        return planoAcaoRepository.save(plano);
    }

    public PlanoAcao update(Long id, PlanoAcaoDTO planoDTO) {
        PlanoAcao plano = findById(id);

        if (planoDTO.getTitulo() != null) {
            plano.setTitulo(planoDTO.getTitulo());
        }

        if (planoDTO.getObjetivo() != null) {
            plano.setObjetivo(planoDTO.getObjetivo());
        }

        if (planoDTO.getData() != null) {
            plano.setData(planoDTO.getData());
        }

        if (planoDTO.getStatus() != null) {
            try {
                StatusPlano novoStatus = StatusPlano.valueOf(planoDTO.getStatus());
                plano.setStatus(novoStatus);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Status inválido: " + planoDTO.getStatus());
            }
        }

        return planoAcaoRepository.save(plano);
    }

    public List<PlanoAcao> findByStatus(StatusPlano status) {
        return planoAcaoRepository.findByStatus(status);
    }

    public void delete(Long id) {
        PlanoAcao plano = findById(id);
        planoAcaoRepository.delete(plano);
    }

    public PlanoAcao atualizarStatusPlano(Long planoId) {
        PlanoAcao plano = findById(planoId);
        plano.verificarEAtualizarStatus();
        return planoAcaoRepository.save(plano);
    }

    public PlanoAcao updateStatus(Long id, String novoStatus) {
        PlanoAcao plano = findById(id);

        StatusPlano status;
        try {
            status = StatusPlano.valueOf(novoStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Status inválido: " + novoStatus); // ou lance um erro customizado
        }

        plano.setStatus(status);
        return planoAcaoRepository.save(plano);
    }


}
