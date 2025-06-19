package com.vitorcd.planodeacao.service;

import com.vitorcd.planodeacao.dto.AcaoDTO;
import com.vitorcd.planodeacao.entity.Acao;
import com.vitorcd.planodeacao.entity.PlanoAcao;
import com.vitorcd.planodeacao.enums.StatusAcao;
import com.vitorcd.planodeacao.exception.ResourceNotFoundException;
import com.vitorcd.planodeacao.repositories.AcaoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class AcaoService {

    @Autowired
    private AcaoRepository acaoRepository;

    @Autowired
    private PlanoAcaoService planoAcaoService;

    public List<Acao> findByPlanoAcaoId(Long planoAcaoId) {
        return acaoRepository.findByPlanoAcaoId(planoAcaoId);
    }

    public Acao findById(Long id) {
        return acaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Acão não encontrada com ID:" + id));
    }

    public Acao create(Long planoAcaoId, AcaoDTO acaoDTO) {
        PlanoAcao plano = planoAcaoService.findById(planoAcaoId);

        Acao acao = new Acao();
        acao.setAcao(acaoDTO.getAcao());
        acao.setPrazo(acaoDTO.getPrazo());
        acao.setStatus(StatusAcao.PENDENTE);
        acao.setPlanoAcao(plano);

        Acao savedAcao = acaoRepository.save(acao);

        planoAcaoService.atualizarStatusPlano(planoAcaoId);

        return savedAcao;
    }

    public Acao update(Long id, AcaoDTO acaoDTO) {
        Acao acao = findById(id);

        if (acaoDTO.getAcao() != null) {
            acao.setAcao(acaoDTO.getAcao());
        }
        if (acaoDTO.getPrazo() != null) {
            acao.setPrazo(acaoDTO.getPrazo());
        }
        if (acaoDTO.getStatus() != null) {
            acao.setStatus(acaoDTO.getStatus());
        }

        Acao savedAcao = acaoRepository.save(acao);

        planoAcaoService.atualizarStatusPlano(acao.getPlanoAcao().getId());

        return savedAcao;
    }


    public Acao updateStatus(Long id, StatusAcao novoStatus) {
        Acao acao = findById(id);
        acao.setStatus(novoStatus);

        Acao savedAcao = acaoRepository.save(acao);

        planoAcaoService.atualizarStatusPlano(acao.getPlanoAcao().getId());

        return savedAcao;
    }

    public void delete(Long id) {
        Acao acao = findById(id);
        Long planoAcaoId = acao.getPlanoAcao().getId();

        acaoRepository.delete(acao);

        planoAcaoService.atualizarStatusPlano(planoAcaoId);
    }

    public List<Acao> findByStatus(StatusAcao status) {
        return acaoRepository.findByStatus(status);
    }
}
